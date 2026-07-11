import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from "react-native-youtube-iframe";
import { stepByStepStyles } from '../../assets/styles/stepbystep.styles'; 
import { COLORS } from "../../constants/colors";
import LoadingSpinner from "../../components/LoadingSpinner";
import API_BASE_URL from "../../services/apiConfig";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Helper function to check if URL is a YouTube video
const isYouTubeUrl = (url) => {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
};

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /youtube\.com\/watch\?v=([^"&?\/\s]{11})/i,
    /youtu\.be\/([^"&?\/\s]{11})/i,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Function to construct image URL
const constructImageUrl = (filename) => {
  if (!filename) return null;
  
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/uploads/${filename}`;
};

const StepByStepScreen = () => {
  const { id, startingStep } = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(startingStep ? parseInt(startingStep) : 1);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [steps, setSteps] = useState([]);
  const [playing, setPlaying] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const playerRef = useRef(null);

  // Timer functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!timerActive) {
      setTimerActive(true);
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (timerActive) {
      setTimerActive(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Fetch recipe and steps data from backend
  useEffect(() => {
    const fetchRecipeAndSteps = async () => {
      setLoading(true);
      try {
        const recipeId = typeof id === 'string' ? parseInt(id) : id;
        
        // Fetch recipe details
        const recipeResponse = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
        const recipeData = await recipeResponse.json();
        
        if (recipeData.success) {
          const recipeInfo = {
            id: recipeData.data.id,
            title: recipeData.data.name,
            totalSteps: 0, // Will be set after fetching steps
            estimatedTime: `${recipeData.data.time} min`,
            difficulty: recipeData.data.difficulty,
          };
          setRecipe(recipeInfo);
          
          // Fetch all steps for this recipe using your API
          console.log(`Fetching steps from: ${API_BASE_URL}/steps/recipe/${recipeId}`);
          const stepsResponse = await fetch(`${API_BASE_URL}/steps/recipe/${recipeId}`);
          const stepsData = await stepsResponse.json();
          
          if (stepsData.success) {
            console.log(`Found ${stepsData.data.length} steps`);
            
            // Transform steps data based on your backend model
            const transformedSteps = stepsData.data.map(step => ({
              id: step.id,
              step_number: step.step_num, // Using step_num from backend
              title: step.step_name || `Step ${step.step_num}`, // Using step_name from backend
              description: step.step_description, // Using step_description from backend
              image: constructImageUrl(step.photo), // photo from backend
              video_url: step.video, // video from backend
              youtubeVideoId: step.video ? getYouTubeVideoId(step.video) : null,
            }));
            
            // Sort steps by step_number (they should already be sorted from backend)
            transformedSteps.sort((a, b) => a.step_number - b.step_number);
            
            setSteps(transformedSteps);
            
            // Update recipe with total steps count
            setRecipe(prev => ({
              ...prev,
              totalSteps: transformedSteps.length,
            }));
          } else {
            console.error('Failed to fetch steps:', stepsData.message);
            // Set empty steps array if API fails
            setSteps([]);
          }
        } else {
          console.error('Failed to fetch recipe:', recipeData.message);
        }
      } catch (error) {
        console.error('Error fetching recipe and steps:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeAndSteps();
    }
  }, [id]);

  // Handle YouTube video state change
  const onStateChange = (state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  };

  const handleNextStep = () => {
    // Stop video when changing steps
    setPlaying(false);
    
    if (currentStep < steps.length) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePreviousStep = () => {
    // Stop video when changing steps
    setPlaying(false);
    
    if (currentStep > 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleFinish = () => {
    stopTimer();
    setPlaying(false);
    router.push('./CookingCompletionScreen');
  };

  const handleTimerButtonPress = () => {
    if (timerActive) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  // Restart video function
  const handleRestartVideo = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0, true);
      setPlaying(true);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading step-by-step instructions..." />;
  }

  if (!recipe || steps.length === 0) {
    return (
      <SafeAreaView style={stepByStepStyles.container}>
        <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
        
        {/* Header */}
        <View style={stepByStepStyles.header}>
          <TouchableOpacity 
            style={stepByStepStyles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <View style={stepByStepStyles.headerTitleContainer}>
            <Text style={stepByStepStyles.headerTitle}>Step by step mode</Text>
          </View>
          
          <View style={stepByStepStyles.timerButton} />
        </View>

        <View style={stepByStepStyles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.primary} />
          <Text style={stepByStepStyles.errorText}>No steps available for this recipe</Text>
          <TouchableOpacity 
            style={stepByStepStyles.backToRecipeButton}
            onPress={() => router.back()}
          >
            <Text style={stepByStepStyles.backToRecipeButtonText}>Back to Recipe</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStepData = steps.find(step => step.step_number === currentStep);
  
  if (!currentStepData) {
    return <LoadingSpinner message="Step not found..." />;
  }

  // Determine what media to display for current step
  const hasImage = currentStepData?.image && !isYouTubeUrl(currentStepData.image);
  const hasYouTubeVideo = currentStepData?.youtubeVideoId;
  const hasMedia = hasImage || hasYouTubeVideo;

  return (
    <SafeAreaView style={stepByStepStyles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={stepByStepStyles.header}>
        <TouchableOpacity 
          style={stepByStepStyles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={stepByStepStyles.headerTitleContainer}>
          <Text style={stepByStepStyles.headerTitle}>Step by step mode</Text>
        </View>
        
        {/* Timer Button */}
        <TouchableOpacity 
          style={[
            stepByStepStyles.timerButton,
            timerActive && stepByStepStyles.timerButtonActive
          ]}
          onPress={handleTimerButtonPress}
        >
          {timerActive ? (
            <>
              <Ionicons name="timer" size={20} color={COLORS.primary} />
              <Text style={stepByStepStyles.timerText}>{formatTime(timerSeconds)}</Text>
            </>
          ) : (
            <>
              <Ionicons name="timer-outline" size={20} color={COLORS.text} />
              <Text style={stepByStepStyles.timerText}>Timer</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Step Progress */}
      <View style={stepByStepStyles.progressContainer}>
        <View style={stepByStepStyles.stepIndicator}>
          <Text style={stepByStepStyles.stepNumber}>Step {currentStep}</Text>
          <Text style={stepByStepStyles.stepTotal}>/{recipe.totalSteps}</Text>
        </View>
        
        <View style={stepByStepStyles.progressBar}>
          <View 
            style={[
              stepByStepStyles.progressFill, 
              { width: `${(currentStep / recipe.totalSteps) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        ref={scrollViewRef}
        style={stepByStepStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[stepByStepStyles.contentContainer, { opacity: fadeAnim }]}>
          {/* Step Title */}
          <Text style={stepByStepStyles.stepTitle}>{currentStepData.title}</Text>
          
          {/* Media Section - Handles all cases */}
          {hasMedia ? (
            <View style={stepByStepStyles.mediaContainer}>
              {hasImage && (
                <View style={stepByStepStyles.imageContainer}>
                  <Image 
                    source={{ uri: currentStepData.image }} 
                    style={stepByStepStyles.stepImage}
                    resizeMode="cover"
                    onError={(e) => {
                      console.log('Image load error:', e.nativeEvent.error);
                    }}
                  />
                </View>
              )}
              
              {hasYouTubeVideo && currentStepData.youtubeVideoId && (
                <View style={stepByStepStyles.youtubePlayerContainer}>
                  <View style={stepByStepStyles.videoHeader}>
              
                    
                    
                    {/* Video Controls */}
              
                  </View>
                  
                  <YoutubePlayer
                    ref={playerRef}
                    height={200}
                    width={width - 40}
                    videoId={currentStepData.youtubeVideoId}
                    play={playing}
                    onChangeState={onStateChange}
                    onReady={() => console.log("YouTube player ready")}
                    onError={(e) => console.log("YouTube player error:", e)}
                    webViewStyle={stepByStepStyles.youtubeWebView}
                    webViewProps={{
                      allowsFullscreenVideo: true,
                    }}
                  />
                  
                  {/* Video Controls Footer */}
                  <View style={stepByStepStyles.videoControls}>
     
                    
                    <TouchableOpacity 
                      style={stepByStepStyles.videoControl}
                      onPress={handleRestartVideo}
                    >
                      <Ionicons name="refresh" size={24} color={COLORS.primary} />
                      <Text style={stepByStepStyles.videoControlLabel}>
                        Restart
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            // No media placeholder
            <View >
              
            </View>
          )}
          
          {/* Step Description */}
          <View style={stepByStepStyles.descriptionContainer}>
            <Text style={stepByStepStyles.descriptionText}>
              {currentStepData.description}
            </Text>
          </View>
          
          {/* Step Information */}
          <View style={stepByStepStyles.stepInfoContainer}>
            <View style={stepByStepStyles.stepInfoItem}>
              <Ionicons name="list" size={16} color={COLORS.primary} />
              <Text style={stepByStepStyles.stepInfoText}>
                Step {currentStepData.step_number} of {recipe.totalSteps}
              </Text>
            </View>
            
            {/* Show video indicator if step has video */}
            {currentStepData.youtubeVideoId && (
              <View style={stepByStepStyles.stepInfoItem}>
                <Ionicons name="videocam" size={16} color={COLORS.primary} />
                <Text style={stepByStepStyles.stepInfoText}>Video tutorial available</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={stepByStepStyles.navigationContainer}>
        <TouchableOpacity 
          style={[
            stepByStepStyles.navButton,
            stepByStepStyles.previousButton,
            currentStep === 1 && stepByStepStyles.navButtonDisabled
          ]}
          onPress={handlePreviousStep}
          disabled={currentStep === 1}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentStep === 1 ? COLORS.textLight : COLORS.text} 
          />
          <Text style={[
            stepByStepStyles.navButtonText,
            currentStep === 1 && stepByStepStyles.navButtonTextDisabled
          ]}>
            Previous
          </Text>
        </TouchableOpacity>
        
        {currentStep === recipe.totalSteps ? (
          // Finish Button on last step
          <TouchableOpacity 
            style={stepByStepStyles.finishButton}
            onPress={handleFinish}
          >
            <Text style={stepByStepStyles.finishButtonText}>Finish</Text>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          // Next Button for other steps
          <TouchableOpacity 
            style={stepByStepStyles.nextButton}
            onPress={handleNextStep}
          >
            <Text style={stepByStepStyles.nextButtonText}>
              Next
            </Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default StepByStepScreen;