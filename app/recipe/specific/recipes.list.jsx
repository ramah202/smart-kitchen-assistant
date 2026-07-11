import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { recipesListStyles } from "../../../assets/styles/RecipesList.styles";
import { COLORS } from "../../../constants/colors";
import LoadingSpinner from "../../../components/LoadingSpinner";
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

const RecipesList = () => {
  const params = useLocalSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [areasMap, setAreasMap] = useState({});
  const [isFiltered, setIsFiltered] = useState(false);
  const [filterSummary, setFilterSummary] = useState(null);
  const router = useRouter();

  // Function to fetch categories and areas
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

  // Function to load filtered recipes from backend response
  const loadFilteredRecipes = async (filteredRecipesString) => {
    try {
      setIsFiltered(true);
      setLoading(true);
      
      const filteredRecipes = JSON.parse(filteredRecipesString);
      const { categoryMap, areaMap } = await fetchReferenceData();
      
      setCategoriesMap(categoryMap);
      setAreasMap(areaMap);
      
      // Transform filtered recipes
      const transformedRecipes = filteredRecipes.map(recipe => {
        const categoryName = categoryMap[recipe.id_category] || "Uncategorized";
        const areaName = areaMap[recipe.id_area] || "Unknown Area";
        const imageUrl = constructImageUrl(recipe.photo);
        
        return {
          id: recipe.id,
          name: recipe.name,
          time: recipe.time,
          photo: recipe.photo,
          id_category: recipe.id_category,
          id_area: recipe.id_area,
          area: areaName,
          category: categoryName,
          instructions: recipe.instructions,
          calories: recipe.calories,
          difficulty: recipe.difficulty,
          youtube_url: recipe.youtube_url,
          imageUrl: imageUrl,
          originalData: recipe
        };
      });
      
      setRecipes(transformedRecipes);
      
      // Parse filter summary if available
      if (params.filterSummary) {
        try {
          const summary = JSON.parse(params.filterSummary);
          setFilterSummary(summary);
        } catch (error) {
          console.error("Error parsing filter summary:", error);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error processing filtered recipes:", error);
      Alert.alert("Error", "Failed to load filtered recipes");
      fetchAllRecipes();
    }
  };

  // Original function to fetch all recipes
  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      setIsFiltered(false);
      setFilterSummary(null);
      
      const { categoryMap, areaMap } = await fetchReferenceData();
      setCategoriesMap(categoryMap);
      setAreasMap(areaMap);
      
      const response = await fetch(`${API_BASE_URL}/recipes/`);
      const data = await response.json();
      
      if (data.success) {
        const transformedRecipes = data.data.map(recipe => {
          const categoryName = categoryMap[recipe.id_category] || "Uncategorized";
          const areaName = areaMap[recipe.id_area] || "Unknown Area";
          const imageUrl = constructImageUrl(recipe.photo);
          
          return {
            id: recipe.id,
            name: recipe.name,
            time: recipe.time,
            photo: recipe.photo,
            id_category: recipe.id_category,
            id_area: recipe.id_area,
            area: areaName,
            category: categoryName,
            instructions: recipe.instructions,
            calories: recipe.calories,
            difficulty: recipe.difficulty,
            youtube_url: recipe.youtube_url,
            imageUrl: imageUrl,
            originalData: recipe
          };
        });
        
        setRecipes(transformedRecipes);
      } else {
        console.error("Failed to fetch recipes:", data.message);
        Alert.alert("Error", "Failed to load recipes");
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      Alert.alert("Error", "Failed to load recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if filtered recipes were passed
useEffect(() => {
  if (params.filteredRecipes) {
    loadFilteredRecipes(params.filteredRecipes);
  } else {
    fetchAllRecipes();
  }
}, [params.filteredRecipes]);


  const handleBack = () => {
    router.back();
  };

  const handleRecipePress = (recipeId) => {
    router.push(`../../recipe1/${recipeId}`);
  };

  const handleFilterPress = () => {
    router.push("/recipe/specific/filter.options");
  };

  const handleClearFilters = () => {
    fetchAllRecipes();
  };

  const renderFilterSummary = () => {
    if (!isFiltered || !filterSummary) return null;
    
    const summaryParts = [];
    
    // Add ingredients count
    if (filterSummary.ingredients > 0) {
      summaryParts.push(`${filterSummary.ingredients} ingredient${filterSummary.ingredients !== 1 ? 's' : ''}`);
    }
    
    // Add category
    if (filterSummary.category) {
      summaryParts.push(filterSummary.category);
    }
    
    // Add time
    if (filterSummary.time) {
      summaryParts.push(filterSummary.time);
    }
    
    // Add area
    if (filterSummary.area) {
      summaryParts.push(filterSummary.area);
    }
    
    // Add moods count
    if (filterSummary.moods > 0) {
      summaryParts.push(`${filterSummary.moods} mood${filterSummary.moods !== 1 ? 's' : ''}`);
    }
    
    // Add meal time count
    if (filterSummary.mealTime > 0) {
      summaryParts.push(`${filterSummary.mealTime} meal time${filterSummary.mealTime !== 1 ? 's' : ''}`);
    }
    
    return (
      <View style={recipesListStyles.filterSummaryContainer}>
        <Text style={recipesListStyles.filterSummaryText}>
          Filtered by: {summaryParts.join(', ')}
        </Text>
        <TouchableOpacity 
          onPress={handleClearFilters}
          style={recipesListStyles.clearFilterButton}
        >
          <Text style={recipesListStyles.clearFilterText}>Clear Filters</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={recipesListStyles.card}
      onPress={() => handleRecipePress(item.id)}
      activeOpacity={0.8}
    >
      {/* Recipe Image from Backend */}
      {item.imageUrl ? (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={recipesListStyles.cardImage}
          onError={(error) => {
            console.log('Image load error:', error.nativeEvent.error);
          }}
        />
      ) : (
        <View style={[recipesListStyles.cardImage, { 
          backgroundColor: COLORS.border,
          justifyContent: 'center',
          alignItems: 'center'
        }]}>
          <Ionicons name="fast-food-outline" size={40} color={COLORS.textLight} />
          <Text style={{ color: COLORS.textLight, fontSize: 12, marginTop: 8 }}>
            No Image
          </Text>
        </View>
      )}
      
      <View style={recipesListStyles.cardContent}>
        <Text style={recipesListStyles.cardTitle}>{item.name}</Text>
        
        {/* Category - Added */}
        <View style={recipesListStyles.categoryContainer}>
          <Ionicons name="restaurant-outline" size={14} color={COLORS.primary} />
          <Text style={recipesListStyles.categoryText}>{item.category}</Text>
        </View>
        
        {/* Area */}
        <View style={recipesListStyles.areaContainer}>
          <Ionicons name="location-outline" size={14} color={COLORS.primary} />
          <Text style={recipesListStyles.areaText}>{item.area}</Text>
        </View>
        
        <View style={recipesListStyles.cardMeta}>
          <View style={recipesListStyles.metaItem}>
            <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
            <Text style={recipesListStyles.metaText}>{item.time} min</Text>
          </View>
          <View style={recipesListStyles.metaItem}>
            <Ionicons name="flame-outline" size={16} color={COLORS.textLight} />
            <Text style={recipesListStyles.metaText}>{item.calories} cal</Text>
          </View>
          <View style={[
            recipesListStyles.difficultyBadge, 
            { backgroundColor: getDifficultyColor(item.difficulty) }
          ]}>
            <Text style={recipesListStyles.difficultyText}>
              {item.difficulty}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return COLORS.border;
    
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return COLORS.border;
    }
  };

  return (
    <View style={recipesListStyles.container}>
      {/* Header مع زر الرجوع */}
      <View style={recipesListStyles.header}>
        <TouchableOpacity 
          onPress={handleBack}
          style={recipesListStyles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={recipesListStyles.headerContent}>
          <Text style={recipesListStyles.headerTitle}>
            {isFiltered ? 'Filtered Recipes' : 'Suggested Recipes'}
          </Text>
          <Text style={recipesListStyles.headerSubtitle}>
            {isFiltered 
              ? 'Based on your selections'
              : 'Cook something delicious today!'
            }
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={handleFilterPress}
          style={recipesListStyles.filterButton}
        >
          <Ionicons name="options-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Summary */}
      {renderFilterSummary()}

      {/* Recipe Count */}
      {!loading && recipes.length > 0 && (
        <View style={recipesListStyles.counterContainer}>
          <Text style={recipesListStyles.counterText}>
            {isFiltered ? 'Found ' : ''}{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} available
          </Text>
        </View>
      )}

      {loading ? (
        <LoadingSpinner message={
          isFiltered 
            ? "Loading filtered recipes..." 
            : "Loading delicious recipes..."
        } />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={recipesListStyles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={recipesListStyles.emptyContainer}>
              <Ionicons name="fast-food-outline" size={64} color={COLORS.border} />
              <Text style={recipesListStyles.emptyText}>
                {isFiltered 
                  ? 'No recipes match your filters' 
                  : 'No recipes found'
                }
              </Text>
              <Text style={recipesListStyles.emptySubtext}>
                {isFiltered 
                  ? 'Try adjusting your filter criteria' 
                  : 'Try adding some ingredients to get suggestions'
                }
              </Text>
              {isFiltered && (
                <TouchableOpacity 
                  onPress={handleFilterPress}
                  style={recipesListStyles.emptyButton}
                >
                  <Text style={recipesListStyles.emptyButtonText}>Adjust Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

export default RecipesList;