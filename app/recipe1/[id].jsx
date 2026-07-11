import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import YoutubePlayer from "react-native-youtube-iframe";

import LoadingSpinner from "../../components/LoadingSpinner";
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import { COLORS } from "../../constants/colors";
import API_BASE_URL from "../../services/apiConfig";

const { width } = Dimensions.get('window');

// Function to construct image URL
const constructImageUrl = (filename) => {
  if (!filename) return null;
  
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/uploads/${filename}`;
};

// Function to extract YouTube video ID from various URL formats
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

// Function to format ingredient string from backend data
const formatIngredientString = (recipeIngredient) => {
  if (!recipeIngredient || !recipeIngredient.ingredient) {
    return 'Unknown ingredient';
  }
  
  const { measure, ingredient } = recipeIngredient;
  const ingredientName = ingredient.name || 'Unknown';
  
  if (measure && measure.trim() !== '') {
    return `${measure} ${ingredientName}`;
  }
  
  return ingredientName;
};

// Function to fetch ingredients from backend
const fetchIngredients = async (recipeId) => {
  try {
    console.log(`Fetching ingredients from: ${API_BASE_URL}/recipeingredients/recipe/${recipeId}`);
    const response = await fetch(`${API_BASE_URL}/recipeingredients/recipe/${recipeId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`Found ${data.data.length} ingredients for recipe ${recipeId}`);
      return data.data;
    } else {
      console.error('Failed to fetch ingredients:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};

// Function to fetch steps from backend
const fetchSteps = async (recipeId) => {
  try {
    console.log(`Fetching steps from: ${API_BASE_URL}/steps/recipe/${recipeId}`);
    const response = await fetch(`${API_BASE_URL}/steps/recipe/${recipeId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`Found ${data.data.length} steps for recipe ${recipeId}`);
      
      // Transform steps data to match frontend structure
      const transformedSteps = data.data.map(step => ({
        id: step.id,
        step_number: step.step_num,
        title: step.step_name || `Step ${step.step_num}`,
        description: step.step_description,
        image: constructImageUrl(step.photo),
        video_url: step.video,
        youtubeVideoId: step.video ? getYouTubeVideoId(step.video) : null,
      }));
      
      // Sort steps by step_number
      transformedSteps.sort((a, b) => a.step_number - b.step_number);
      
      return transformedSteps;
    } else {
      console.error('Failed to fetch steps:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching steps:', error);
    return [];
  }
};

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams();
  const router = useRouter();
  
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]); // Store ingredients from backend
  const [steps, setSteps] = useState([]); // Store steps from backend
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [areasMap, setAreasMap] = useState({});
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  // Get user token from AsyncStorage
  const getUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error("Error getting user token:", error);
      return null;
    }
  };

  // Fetch categories and areas
  const fetchReferenceData = async () => {
    try {
      const categoriesResponse = await fetch(`${API_BASE_URL}/categories/`);
      const categoriesData = await categoriesResponse.json();
      
      const categoryMap = {};
      if (categoriesData.success) {
        categoriesData.data.forEach(cat => {
          categoryMap[cat.id] = cat.name;
        });
      }
      
      const areasResponse = await fetch(`${API_BASE_URL}/areas/`);
      const areasData = await areasResponse.json();
      
      const areaMap = {};
      if (areasData.success) {
        areasData.data.forEach(area => {
          areaMap[area.id] = area.name;
        });
      }
      
      return { categoryMap, areaMap };
    } catch (error) {
      console.error("Error fetching reference data:", error);
      return { categoryMap: {}, areaMap: {} };
    }
  };

  // Check if recipe is saved in backend
  const checkIfSavedInBackend = async () => {
    try {
      const token = await getUserToken();
      if (!token) {
        console.log("No user token found, skipping favorite check");
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/user/my-favorite-recipes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const isFavorite = data.data.some(favRecipe => 
          favRecipe.id === parseInt(recipeId)
        );
        return isFavorite;
      }
      return false;
    } catch (error) {
      console.error("Error checking saved status:", error);
      return false;
    }
  };

  useEffect(() => {
    const loadRecipeDetail = async () => {
      setLoading(true);
      try {
        const id = typeof recipeId === 'string' ? parseInt(recipeId) : recipeId;
        
        // Step 1: Fetch reference data
        const { categoryMap, areaMap } = await fetchReferenceData();
        setCategoriesMap(categoryMap);
        setAreasMap(areaMap);
        
        // Step 2: Fetch recipe from backend
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
        const data = await response.json();
        
        if (data.success) {
          const recipeData = data.data;
          
          const categoryName = categoryMap[recipeData.id_category] || "Uncategorized";
          const areaName = areaMap[recipeData.id_area] || "Unknown Area";
          
          // Get YouTube video ID if exists
          const youtubeVideoId = getYouTubeVideoId(recipeData.youtube_url);
          
          const transformedRecipe = {
            id: recipeData.id,
            title: recipeData.name,
            image: constructImageUrl(recipeData.photo),
            category: categoryName,
            area: areaName,
            cookTime: `${recipeData.time} min`,
            calories: recipeData.calories,
            difficulty: recipeData.difficulty,
            youtubeUrl: recipeData.youtube_url,
            youtubeVideoId: youtubeVideoId,
            originalData: recipeData
          };
          
          console.log("Loaded recipe from backend:", transformedRecipe);
          
          setRecipe(transformedRecipe);
          
          // Step 3: Fetch ingredients from backend
          const recipeIngredients = await fetchIngredients(id);
          setIngredients(recipeIngredients);
          
          // Step 4: Fetch steps from backend
          const recipeSteps = await fetchSteps(id);
          setSteps(recipeSteps);
          
          // Step 5: Check if saved in backend
          const isSavedInBackend = await checkIfSavedInBackend();
          setIsSaved(isSavedInBackend);
          
        } else {
          console.error("Failed to fetch recipe:", data.message);
          Alert.alert("Error", "Failed to load recipe details");
        }
      } catch (error) {
        console.error("Error loading recipe detail:", error);
        Alert.alert("Error", "Failed to load recipe details");
      } finally {
        setLoading(false);
      }
    };

    loadRecipeDetail();
  }, [recipeId]);

  // Handle YouTube video state change
  const onStateChange = (state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  };

  // Handle add to favorites (backend)
  const handleAddFavorite = async () => {
    try {
      const token = await getUserToken();
      if (!token) {
        Alert.alert("Login Required", "Please login to save recipes to favorites");
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/user/my-favorite-recipes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_recipe: recipe.id
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert("Success", "Recipe added to favorites!");
        return true;
      } else {
        Alert.alert("Error", data.message?.join(', ') || "Failed to add to favorites");
        return false;
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
      Alert.alert("Error", "Failed to add to favorites");
      return false;
    }
  };

  // Handle remove from favorites (backend)
  const handleRemoveFavorite = async () => {
    try {
      const token = await getUserToken();
      if (!token) {
        Alert.alert("Login Required", "Please login to manage favorites");
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/user/my-favorite-recipes/${recipe.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert("Success", "Recipe removed from favorites!");
        return true;
      } else {
        Alert.alert("Error", data.message?.join(', ') || "Failed to remove from favorites");
        return false;
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      Alert.alert("Error", "Failed to remove from favorites");
      return false;
    }
  };

  const handleToggleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      let success = false;
      
      if (isSaved) {
        success = await handleRemoveFavorite();
        if (success) {
          setIsSaved(false);
        }
      } else {
        success = await handleAddFavorite();
        if (success) {
          setIsSaved(true);
        }
      }
      
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to step-by-step mode starting from a specific step
  const navigateToStepByStep = (startingStep = 1) => {
    router.push({
      pathname: `/step-by-step/${recipe.id}`,
      params: { startingStep }
    });
  };

  if (loading || !recipe) {
    return <LoadingSpinner message="Loading recipe details..." />;
  }

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* HEADER WITH IMAGE */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            {recipe.image ? (
              <Image
                source={{ uri: recipe.image }}
                style={recipeDetailStyles.headerImage}
                contentFit="cover"
                onError={(error) => {
                  console.log('Image load error:', error.nativeEvent.error);
                }}
              />
            ) : (
              <View style={[recipeDetailStyles.headerImage, { 
                backgroundColor: COLORS.border,
                justifyContent: 'center',
                alignItems: 'center'
              }]}>
                <Ionicons name="fast-food-outline" size={50} color={COLORS.white} />
                <Text style={{ color: COLORS.white, marginTop: 8 }}>No Image</Text>
              </View>
            )}
          </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />

          {/* Floating Buttons */}
          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                { backgroundColor: isSaving ? COLORS.textLight : COLORS.primary },
              ]}
              onPress={handleToggleSave}
              disabled={isSaving}
            >
              <Ionicons
                name={isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>{recipe.category}</Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            {recipe.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="location" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>{recipe.area} Cuisine</Text>
              </View>
            )}
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/* QUICK STATS */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#FF5C00", "#FF8E53"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="time-outline" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>{recipe.cookTime}</Text>
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#2196F3", "#1976D2"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="flame-outline" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>{recipe.calories}</Text>
              <Text style={recipeDetailStyles.statLabel}>Calories</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#9C27B0", "#673AB7"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="speedometer-outline" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>{recipe.difficulty}</Text>
              <Text style={recipeDetailStyles.statLabel}>Difficulty</Text>
            </View>
          </View>

          {/* YOUTUBE VIDEO SECTION */}
          {recipe.youtubeVideoId && (
            <View style={recipeDetailStyles.sectionContainer}>
              <View style={recipeDetailStyles.sectionTitleRow}>
                <LinearGradient
                  colors={["#FF0000", "#CC0000"]}
                  style={recipeDetailStyles.sectionIcon}
                >
                  <Ionicons name="play" size={16} color={COLORS.white} />
                </LinearGradient>
                <Text style={recipeDetailStyles.sectionTitle}>Video Tutorial</Text>
                
                {/* Play/Pause Controls */}
                <TouchableOpacity 
                  style={recipeDetailStyles.videoControlButton}
                  onPress={() => setPlaying(!playing)}
                >
                  <Ionicons 
                    name={playing ? "pause" : "play"} 
                    size={16} 
                    color={COLORS.white} 
                  />
                  <Text style={recipeDetailStyles.videoControlText}>
                    {playing ? "Pause" : "Play"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={recipeDetailStyles.youtubePlayerContainer}>
                <YoutubePlayer
                  ref={playerRef}
                  height={200}
                  width={width - 40}
                  videoId={recipe.youtubeVideoId}
                  play={playing}
                  onChangeState={onStateChange}
                  onReady={() => console.log("YouTube player ready")}
                  onError={(e) => console.log("YouTube player error:", e)}
                  webViewStyle={recipeDetailStyles.youtubeWebView}
                  webViewProps={{
                    allowsFullscreenVideo: true,
                  }}
                />
              </View>
            </View>
          )}

{/* INGREDIENTS SECTION - FROM BACKEND */}
<View style={recipeDetailStyles.sectionContainer}>
  <View style={recipeDetailStyles.sectionTitleRow}>
    <LinearGradient
      colors={[COLORS.primary, "#FF8E53"]}
      style={recipeDetailStyles.sectionIcon}
    >
      <Ionicons name="list-outline" size={16} color={COLORS.white} />
    </LinearGradient>
    <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
    <View style={recipeDetailStyles.countBadge}>
      <Text style={recipeDetailStyles.countText}>{ingredients.length}</Text>
    </View>
  </View>

  {ingredients.length > 0 ? (
    <View style={recipeDetailStyles.ingredientsGrid}>
      {ingredients.map((recipeIngredient, index) => (
        <View key={`${recipeIngredient.id || index}-${recipeIngredient.ingredient?.id || ''}`} 
              style={recipeDetailStyles.ingredientCard}>
          <View style={recipeDetailStyles.ingredientNumber}>
            <Text style={recipeDetailStyles.ingredientNumberText}>{index + 1}</Text>
          </View>
          <Text style={recipeDetailStyles.ingredientText}>
            {formatIngredientString(recipeIngredient)}
          </Text>
          <TouchableOpacity style={recipeDetailStyles.ingredientCheck}>
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  ) : (
    <View style={recipeDetailStyles.noIngredientsContainer}>
      <View style={recipeDetailStyles.noIngredientsIcon}>
        <Ionicons name="nutrition-outline" size={48} color={COLORS.border} />
      </View>
      <Text style={recipeDetailStyles.noIngredientsText}>
        No ingredients available for this recipe
      </Text>
    </View>
  )}
</View>

          {/* INSTRUCTIONS SECTION - FROM BACKEND STEPS */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#4CAF50", "#388E3C"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="book-outline" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>{steps.length}</Text>
              </View>
              
              {/* View All Steps Button - Only show if there are steps */}
              {steps.length > 0 && (
                <TouchableOpacity 
                  style={recipeDetailStyles.viewAllStepsButton}
                  onPress={() => navigateToStepByStep(1)}
                >
                  <Text style={recipeDetailStyles.viewAllStepsText}>View All Steps</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>

            <View style={recipeDetailStyles.instructionsContainer}>
              {steps.length > 0 ? (
                steps.map((step) => (
                  <TouchableOpacity 
                    key={step.id} 
                    style={recipeDetailStyles.instructionCard}
                    onPress={() => navigateToStepByStep(step.step_number)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, "#FF8E53"]}
                      style={recipeDetailStyles.stepIndicator}
                    >
                      <Text style={recipeDetailStyles.stepNumber}>{step.step_number}</Text>
                    </LinearGradient>
                    <View style={recipeDetailStyles.instructionContent}>
                      <Text style={recipeDetailStyles.instructionTitle}>
                        {step.title}
                      </Text>
                      <Text style={recipeDetailStyles.instructionText}>
                        {step.description}
                      </Text>
                      <View style={recipeDetailStyles.instructionFooter}>
                        <Text style={recipeDetailStyles.stepLabel}>Step {step.step_number}</Text>
                        {/* Show video icon if step has video */}
                        {step.video_url && (
                          <View style={recipeDetailStyles.videoIndicator}>
                            <Ionicons name="videocam" size={14} color={COLORS.primary} />
                            <Text style={recipeDetailStyles.videoIndicatorText}>
                              Has Video
                            </Text>
                          </View>
                        )}
                        <TouchableOpacity 
                          style={recipeDetailStyles.completeButton}
                          onPress={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={recipeDetailStyles.noStepsContainer}>
                  <Ionicons name="book-outline" size={40} color={COLORS.border} />
                  <Text style={recipeDetailStyles.noStepsText}>
                    No steps available for this recipe
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            style={recipeDetailStyles.primaryButton}
            onPress={handleToggleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.primary, "#FF8E53"]}
              style={recipeDetailStyles.buttonGradient}
            >
              <Ionicons 
                name={isSaved ? "heart" : "heart-outline"} 
                size={20} 
                color={COLORS.white} 
              />
              <Text style={recipeDetailStyles.buttonText}>
                {isSaving 
                  ? "Processing..." 
                  : isSaved 
                    ? "Remove from Favorites" 
                    : "Add to Favorites"
                }
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* STEP-BY-STEP BUTTON - Only show if there are steps */}
          {steps.length > 0 && (
            <TouchableOpacity
              style={recipeDetailStyles.stepByStepButton}
              onPress={() => navigateToStepByStep(1)}
            >
              <LinearGradient
                colors={["#4CAF50", "#388E3C"]}
                style={recipeDetailStyles.stepButtonGradient}
              >
                <Ionicons name="play-circle" size={24} color={COLORS.white} />
                <Text style={recipeDetailStyles.stepButtonText}>Start Step-by-Step Mode</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;