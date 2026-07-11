
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl, TextInput, Alert } from "react-native";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import API_BASE_URL from "../../services/apiConfig";
import { useFavorites } from "../../context/FavoritesContext"; 

const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allRecipes, setAllRecipes] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Map for category ID to name
  const [categoryMap, setCategoryMap] = useState({});
  
  // Get favorites context
  const { initializeFavorites } = useFavorites();

  // Function to properly construct image URL
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

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      const data = await response.json();
      
      console.log("Categories API Response:", data);
      
      if (data.success) {
        // Create category map for easy lookup
        const map = {};
        data.data.forEach(category => {
          map[category.id] = category.name;
        });
        setCategoryMap(map);
        
        // Transform backend categories to match frontend format
        const transformedCategories = data.data.map(category => {
          const imageUrl = constructImageUrl(category.icon);
          
          return {
            id: category.id,
            name: category.name,
            image: imageUrl ? { uri: imageUrl } : require("../../assets/images/all.png"),
            originalIcon: category.icon
          };
        });
        
        // Add "All" category at the beginning
        const allCategoriesList = [
          { 
            id: 0, 
            name: "All", 
            image: require("../../assets/images/all.png") 
          },
          ...transformedCategories
        ];
        
        setAllCategories(allCategoriesList);
        setCategories(allCategoriesList);
        return { categories: transformedCategories, map };
      } else {
        console.error("Failed to fetch categories:", data.message);
        return { categories: [], map: {} };
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to load categories");
      return { categories: [], map: {} };
    }
  };

  // Fetch recipes from backend
  const fetchRecipes = async (categoryMap = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/`);
      const data = await response.json();
      
      console.log("Recipes API Response:", data);
      
      if (data.success) {
        // Transform backend recipes to match frontend format
        const transformedRecipes = data.data.map(recipe => {
          // Get category name from map or use ID as fallback
          const categoryName = categoryMap[recipe.id_category] || `Category ${recipe.id_category}`;
          
          const imageUrl = constructImageUrl(recipe.photo);
          
          return {
            id: recipe.id,
            title: recipe.name,
            description: `${recipe.difficulty} • ${recipe.time} min`,
            image: imageUrl ? { uri: imageUrl } : null,
            cookTime: `${recipe.time} min`,
            calories: `${recipe.calories} cal`,
            difficulty: recipe.difficulty,
            category: categoryName,
            categoryId: recipe.id_category,
            // Store original data for detail page
            originalData: recipe
          };
        });
        
        // Store ALL recipes for filtering
        setAllRecipes(transformedRecipes);
        
        // Show only 12 random recipes initially
        const random12 = [...transformedRecipes]
          .sort(() => Math.random() - 0.5)
          .slice(0, 12);
        
        setRecipes(random12);
        return transformedRecipes;
      } else {
        console.error("Failed to fetch recipes:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      Alert.alert("Error", "Failed to load recipes");
      return [];
    }
  };

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Initialize favorites from backend
      await initializeFavorites();
      
      // Fetch categories first, then recipes with the category map
      const { categories: categoriesData, map } = await fetchCategories();
      const recipesData = await fetchRecipes(map);
      
      console.log("Total recipes loaded:", recipesData.length);
      console.log("Showing initially:", recipes.length);
      
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    
    // If "All" is selected, show random 12 recipes from ALL
    if (category === "All") {
      const random12 = [...allRecipes]
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);
      setRecipes(random12);
    } else {
      // Find the category object to get its ID
      const selectedCat = allCategories.find(cat => cat.name === category);
      
      if (selectedCat && selectedCat.id !== 0) {
        // Filter by category ID from ALL recipes
        const filtered = allRecipes.filter(recipe => 
          recipe.categoryId === selectedCat.id
        );
        // Show max 12 recipes for this category
        setRecipes(filtered.slice(0, 12));
      } else {
        // Fallback to category name filtering
        const filtered = allRecipes.filter(recipe => 
          recipe.category === category
        );
        setRecipes(filtered.slice(0, 12));
      }
    }
  };

  const handleProfilePress = () => {
    router.push("/profile");
  };

  const handleRecipePress = (recipe) => {
    // Navigate to recipe detail page with the recipe ID
    router.push(`../recipe1/${recipe.id}`);
  };

  // Filter recipes based on search query AND selected category
  const filteredRecipes = useMemo(() => {
    // Start with currently displayed recipes (max 12)
    let results = [...recipes];
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      // Search in ALL recipes, not just displayed ones
      results = allRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter (if not "All")
    if (selectedCategory !== "All") {
      // Find the selected category to get its ID
      const selectedCat = allCategories.find(cat => cat.name === selectedCategory);
      
      if (selectedCat && selectedCat.id !== 0) {
        results = results.filter(recipe => 
          recipe.categoryId === selectedCat.id
        );
      } else {
        results = results.filter(recipe => 
          recipe.category === selectedCategory
        );
      }
    }
    
    // Always limit to maximum 12 recipes
    return results.slice(0, 12);
  }, [recipes, allRecipes, searchQuery, selectedCategory, allCategories]);

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading delicious recipes..." />;
  }

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary} 
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* Header Section */}
        <View style={homeStyles.headerSection}>
          <Text style={homeStyles.greeting}>Discover Your Next Meal 🍽</Text>
          
          {/* Profile Button */}
          <TouchableOpacity
            style={homeStyles.profileButton}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/images/user-profile.jpg")}
              style={homeStyles.profileImage}
              contentFit="cover"
            />
          </TouchableOpacity>

          {/* Search Bar */}
          <View style={homeStyles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
            
            <TextInput
              style={homeStyles.searchInput}
              placeholder="Search recipes"
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories Section */}
        <View style={homeStyles.categoriesSection}>
          <Text style={homeStyles.sectionTitle}>All Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={homeStyles.categoriesScrollContent}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  homeStyles.categoryButton,
                  selectedCategory === category.name && homeStyles.selectedCategory
                ]}
                onPress={() => handleCategorySelect(category.name)}
              >
                <Image
                  source={category.image}
                  style={homeStyles.categoryIcon}
                  contentFit="contain"
                  onError={(error) => {
                    console.log(`Error loading category ${category.name} image:`, error.nativeEvent.error);
                  }}
                />
                
                <Text
                  style={[
                    homeStyles.categoryText,
                    selectedCategory === category.name && homeStyles.selectedCategoryText
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recipes List */}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>
              {selectedCategory === "All" ? "Popular Recipes" : selectedCategory}
            </Text>
            <Text style={homeStyles.recipeCount}>
              {filteredRecipes.length} recipes
            </Text>
          </View>

          {filteredRecipes.length > 0 ? (
            <FlatList
              data={filteredRecipes}
              renderItem={({ item }) => (
                <RecipeCard 
                  recipe={item} 
                  onPress={() => handleRecipePress(item)}
                />
              )}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={homeStyles.recipesList}
            />
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
              <Text style={homeStyles.emptyTitle}>No recipes found</Text>
              <Text style={homeStyles.emptyDescription}>
                {searchQuery ? `No results for "${searchQuery}"` : "Try a different category"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;