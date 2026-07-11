import { View, Text, Alert, ScrollView, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { COLORS } from "../../constants/colors";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";
import API_BASE_URL from "../../services/apiConfig";
import { useFavorites } from "../../context/FavoritesContext"; 

const FavoritesScreen = () => {
  const router = useRouter();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});
  
  // Get favorites context
  const { initializeFavorites, favoritesMap } = useFavorites();

  // Function to construct image URL (same as HomeScreen)
  const constructImageUrl = (filename) => {
    if (!filename) return null;
    
    // If already a full URL, return as is
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    
    // Remove '/api' from base URL if present and add '/uploads/'
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}/uploads/${filename}`;
  };

  // Fetch categories for mapping
  const fetchCategoryMap = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      const data = await response.json();
      
      if (data.success) {
        const map = {};
        data.data.forEach(category => {
          map[category.id] = category.name;
        });
        setCategoryMap(map);
        return map;
      }
      return {};
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {};
    }
  };

  // Load favorites from backend
  const loadFavorites = async () => {
    try {
      // Get user token from AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      
      if (!token) {
        Alert.alert("Sign In Required", "Please sign in to view your favorites.", [
          { text: "OK", onPress: () => router.replace("/(auth)/sign-in") }
        ]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Initialize favorites in context
      await initializeFavorites();

      // Fetch category map first
      const categoryMapData = await fetchCategoryMap();

      // Fetch favorite recipes from backend
      const response = await fetch(`${API_BASE_URL}/user/my-favorite-recipes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log("Favorites API Response:", data);

      if (data.success) {
        // Transform backend data to match RecipeCard expected format
        const transformedFavorites = data.data.map(recipe => {
          // Get category name from map or use ID as fallback
          const categoryName = categoryMapData[recipe.id_category] || `Category ${recipe.id_category}`;
          
          // Construct image URL properly
          const imageUrl = constructImageUrl(recipe.photo);
          
          return {
            id: recipe.id,
            title: recipe.name,
            description: `${recipe.difficulty} • ${recipe.time} min`,
            image: imageUrl ? { uri: imageUrl } : require('../../assets/images/lamb.png'),
            cookTime: `${recipe.time} min`,
            calories: `${recipe.calories} cal`,
            difficulty: recipe.difficulty,
            category: categoryName, // This is the key - using category name from map
            area: recipe.area?.name || 'Unknown',
            isFavorite: true, // Mark as favorite for display
            // Store original data for detail page
            originalData: recipe
          };
        });

        console.log("Loaded favorites:", transformedFavorites.length);
        setFavoriteRecipes(transformedFavorites);
      } else {
        console.error('Failed to fetch favorites:', data.message);
        Alert.alert("Error", data.message?.join(', ') || "Failed to load favorites");
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      Alert.alert("Error", "Failed to load favorites. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("userId");
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
  };

  const handleRecipePress = (recipe) => {
    // Navigate to recipe detail page with the recipe ID
    router.push(`../recipe1/${recipe.id}`);
  };

  // Filter out recipes that are no longer in favorites (using context map)
  const currentFavorites = favoriteRecipes.filter(recipe => 
    favoritesMap[recipe.id] === true
  );

  if (loading) return <LoadingSpinner message="Loading your favorites..." />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity style={favoritesStyles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Favorites Count */}
        <View style={favoritesStyles.statsContainer}>
          <View style={favoritesStyles.statCard}>
            <View style={[favoritesStyles.statIcon, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="heart" size={24} color={COLORS.primary} />
            </View>
            <Text style={favoritesStyles.statValue}>{currentFavorites.length}</Text>
            <Text style={favoritesStyles.statLabel}>Favorite Recipes</Text>
          </View>
        </View>

        <View style={favoritesStyles.recipesSection}>
          {currentFavorites.length > 0 ? (
            <FlatList
              data={currentFavorites}
              renderItem={({ item }) => (
                <RecipeCard 
                  recipe={item} 
                  onPress={() => handleRecipePress(item)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={favoritesStyles.row}
              contentContainerStyle={favoritesStyles.recipesGrid}
              scrollEnabled={false}
            />
          ) : (
            <NoFavoritesFound onExplore={() => router.push("/(tabs)/home")} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;