import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { randomRecipeStyles } from "../../../assets/styles/RandomRecipe.styles";
import { COLORS } from "../../../constants/colors";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../services/apiConfig";

// Function to construct image URL
const constructImageUrl = (filename) => {
  if (!filename) return null;
  
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/uploads/${filename}`;
};

const RandomRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [areasMap, setAreasMap] = useState({});
  const navigation = useNavigation();
  const router = useRouter();

  // Function to fetch categories and areas
  const fetchReferenceData = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/categories/`);
      const categoriesData = await categoriesResponse.json();
      
      const categoryMap = {};
      if (categoriesData.success) {
        categoriesData.data.forEach(cat => {
          categoryMap[cat.id] = cat.name;
        });
      }
      
      // Fetch areas
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

  // Function to fetch a random recipe based on user devices
  const fetchRandomRecipeByDevices = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Step 1: Get user token
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login to get personalized recipe suggestions based on your devices.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setLoading(false);
                setRefreshing(false);
                router.back();
              }
            },
            {
              text: "Login",
              onPress: () => {
                setLoading(false);
                setRefreshing(false);
                router.replace("/(auth)/sign-in");
              }
            }
          ]
        );
        return;
      }

      // Step 2: Fetch reference data (categories and areas)
      const { categoryMap, areaMap } = await fetchReferenceData();
      setCategoriesMap(categoryMap);
      setAreasMap(areaMap);

      // Step 3: Fetch random recipe based on user devices
      console.log("Fetching random recipe from:", `${API_BASE_URL}/recipes/random/by-devices`);
      
      const response = await fetch(`${API_BASE_URL}/recipes/random/by-devices`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      console.log("Random recipe response:", data);
      
      if (data.success && data.data) {
        const recipeData = data.data;
        
        // Step 4: Get category and area names
        const categoryName = categoryMap[recipeData.id_category] || "Uncategorized";
        const areaName = areaMap[recipeData.id_area] || "Unknown Area";

        // Step 5: Transform the recipe data
        const transformedRecipe = {
          id: recipeData.id,
          name: recipeData.name,
          time: recipeData.time,
          photo: recipeData.photo,
          id_category: recipeData.id_category,
          id_area: recipeData.id_area,
          area: areaName,
          calories: recipeData.calories,
          difficulty: recipeData.difficulty,
          category: categoryName,
          imageUrl: constructImageUrl(recipeData.photo),
          originalData: recipeData
        };

        console.log("Transformed recipe:", transformedRecipe);

        // Simulate small delay
        setTimeout(() => {
          setRecipe(transformedRecipe);
          setLoading(false);
          setRefreshing(false);
        }, 500);
        
      } else {
        // Check for specific error messages
        const errorMessage = data.message?.join(', ') || "Failed to load recipe";
        
        if (errorMessage.includes('No devices found')) {
          Alert.alert(
            "No Devices Found",
            "Please add some kitchen devices to your profile to get personalized recipe suggestions.",
            [
              {
                text: "OK",
                onPress: () => {
                  setLoading(false);
                  setRefreshing(false);
                  setRecipe(null);
                }
              }
            ]
          );
        } else if (errorMessage.includes('No recipes found')) {
          Alert.alert(
            "No Recipes Found",
            "No recipes available for your current devices. Try adding more devices or check back later.",
            [
              {
                text: "OK",
                onPress: () => {
                  setLoading(false);
                  setRefreshing(false);
                  setRecipe(null);
                }
              }
            ]
          );
        } else if (errorMessage.includes('Please login')) {
          // Token might be expired
          await AsyncStorage.removeItem('userToken');
          Alert.alert(
            "Session Expired",
            "Please login again to continue.",
            [
              {
                text: "OK",
                onPress: () => {
                  setLoading(false);
                  setRefreshing(false);
                  router.replace("/(auth)/sign-in");
                }
              }
            ]
          );
        } else {
          Alert.alert('Error', errorMessage);
          setLoading(false);
          setRefreshing(false);
          setRecipe(null);
        }
      }
      
    } catch (error) {
      console.error('Error fetching random recipe by devices:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to server. Please check your internet connection and try again.',
        [
          {
            text: "Try Again",
            onPress: () => {
              fetchRandomRecipeByDevices(isRefresh);
            }
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setLoading(false);
              setRefreshing(false);
            }
          }
        ]
      );
    }
  };

  useEffect(() => {
    fetchRandomRecipeByDevices();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    fetchRandomRecipeByDevices(true);
  };

  const handleAnotherRecipe = () => {
    fetchRandomRecipeByDevices(true);
  };

  const handleCardPress = () => {
    if (recipe && recipe.id) {
      console.log("Navigating to recipe detail with ID:", recipe.id);
      router.push(`../../recipe1/${recipe.id}`);
    } else {
      Alert.alert('Error', 'Recipe data not available. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return COLORS.border;
    
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return COLORS.border;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Finding a perfect recipe for your kitchen devices..." />;
  }

  if (!recipe) {
    return (
      <View style={randomRecipeStyles.container}>
        <View style={randomRecipeStyles.header}>
          <TouchableOpacity 
            onPress={handleBack}
            style={randomRecipeStyles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <View style={randomRecipeStyles.headerContent}>
            <Text style={randomRecipeStyles.headerTitle}>Random Recipe</Text>
            <Text style={randomRecipeStyles.headerSubtitle}>
              Personalized for your kitchen
            </Text>
          </View>
        </View>

        <View style={randomRecipeStyles.emptyContainer}>
          <Ionicons name="hardware-chip-outline" size={64} color={COLORS.border} />
          <Text style={randomRecipeStyles.emptyText}>
            No recipes found for your devices.
          </Text>
          <Text style={[randomRecipeStyles.emptyText, { fontSize: 14, marginTop: 8 }]}>
            Add kitchen devices to your profile to get personalized suggestions.
          </Text>
          <TouchableOpacity 
            style={randomRecipeStyles.anotherRecipeButton}
            onPress={handleAnotherRecipe}
          >
            <Ionicons name="refresh-outline" size={22} color={COLORS.primary} />
            <Text style={randomRecipeStyles.anotherRecipeButtonText}>
              Try Again
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[randomRecipeStyles.anotherRecipeButton, { marginTop: 12, backgroundColor: COLORS.background }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-outline" size={22} color={COLORS.primary} />
            <Text style={randomRecipeStyles.anotherRecipeButtonText}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={randomRecipeStyles.container}>
      <ScrollView 
        style={randomRecipeStyles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header with Back Button */}
        <View style={randomRecipeStyles.header}>
          <TouchableOpacity 
            onPress={handleBack}
            style={randomRecipeStyles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <View style={randomRecipeStyles.headerContent}>
            <Text style={randomRecipeStyles.headerTitle}>Random Recipe</Text>
            <Text style={randomRecipeStyles.headerSubtitle}>
              Personalized for your kitchen devices
            </Text>
          </View>
        </View>

        {/* Device-based Recipe Info */}
        <View style={randomRecipeStyles.infoCard}>
          <Ionicons name="hardware-chip" size={24} color={COLORS.primary} />
          <Text style={randomRecipeStyles.infoText}>
            This recipe was randomly selected based on your kitchen devices.
          </Text>
        </View>

        {/* Recipe Card - Clickable */}
        <TouchableOpacity 
          style={randomRecipeStyles.recipeCard}
          onPress={handleCardPress}
          activeOpacity={0.9}
        >
          {/* Recipe Image */}
          {recipe.imageUrl ? (
            <Image 
              source={{ uri: recipe.imageUrl }} 
              style={randomRecipeStyles.recipeImage}
              onError={(error) => {
                console.log('Image load error:', error.nativeEvent.error);
                console.log('Failed URL:', recipe.imageUrl);
              }}
            />
          ) : (
            <View style={[randomRecipeStyles.recipeImage, { 
              backgroundColor: COLORS.border,
              justifyContent: 'center',
              alignItems: 'center'
            }]}>
              <Ionicons name="fast-food-outline" size={50} color={COLORS.textLight} />
              <Text style={{ color: COLORS.textLight, marginTop: 8 }}>No Image</Text>
            </View>
          )}
          
          {/* Recipe Content */}
          <View style={randomRecipeStyles.recipeContent}>
            {/* Recipe Title and Difficulty */}
            <View style={randomRecipeStyles.titleRow}>
              <Text style={randomRecipeStyles.recipeTitle}>
                {recipe.name || 'Unknown Recipe'}
              </Text>
              <View style={[
                randomRecipeStyles.difficultyBadge,
                { backgroundColor: getDifficultyColor(recipe.difficulty) }
              ]}>
                <Text style={randomRecipeStyles.difficultyText}>
                  {(recipe.difficulty || 'Unknown').toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Recipe Meta Info */}
            <View style={randomRecipeStyles.metaContainer}>
              <View style={randomRecipeStyles.metaItem}>
                <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                <Text style={randomRecipeStyles.metaText}>
                  {recipe.time || '0'} min
                </Text>
              </View>
              
              <View style={randomRecipeStyles.metaItem}>
                <Ionicons name="flame-outline" size={18} color={COLORS.primary} />
                <Text style={randomRecipeStyles.metaText}>
                  {recipe.calories || '0'} cal
                </Text>
              </View>
              
              <View style={randomRecipeStyles.metaItem}>
                <Ionicons name="location-outline" size={18} color={COLORS.primary} />
                <Text style={randomRecipeStyles.metaText}>
                  {recipe.area}
                </Text>
              </View>
              
              <View style={randomRecipeStyles.metaItem}>
                <Ionicons name="restaurant-outline" size={18} color={COLORS.primary} />
                <Text style={randomRecipeStyles.metaText}>
                  {recipe.category}
                </Text>
              </View>
            </View>

            {/* Device-based recipe indicator */}
            <View style={randomRecipeStyles.deviceIndicator}>
              <Ionicons name="hardware-chip-outline" size={16} color={COLORS.primary} />
              <Text style={randomRecipeStyles.deviceIndicatorText}>
                Compatible with your kitchen devices
              </Text>
            </View>

            {/* Tap to view details message */}
            <View style={randomRecipeStyles.tapMessageContainer}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.textLight} />
              <Text style={randomRecipeStyles.tapMessageText}>
                Tap card to view full recipe details
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Another Recipe Button */}
        <TouchableOpacity 
          style={randomRecipeStyles.anotherRecipeButton}
          onPress={handleAnotherRecipe}
        >
          <Ionicons name="shuffle-outline" size={22} color={COLORS.primary} />
          <Text style={randomRecipeStyles.anotherRecipeButtonText}>
            Get Another Random Recipe
          </Text>
        </TouchableOpacity>

        {/* Refresh Instruction */}
        <View style={randomRecipeStyles.refreshInstruction}>
          <Ionicons name="refresh-outline" size={14} color={COLORS.textLight} />
          <Text style={randomRecipeStyles.refreshInstructionText}>
            Pull down to refresh or use button above
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default RandomRecipe;