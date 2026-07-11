import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  RefreshControl, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ingredientsStyles } from "../../../assets/styles/ingredients.styles";
import { COLORS } from "../../../constants/colors";
import { useRouter } from "expo-router";
import { useIngredients } from '../../context/IngredientsContext';
import LoadingSpinner from '../../../components/LoadingSpinner';
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../services/apiConfig";

const IngredientsScreen = () => {
  const [ingredients, setIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingError, setFetchingError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { updateSelectedIngredients, clearSelectedIngredients } = useIngredients();
  const router = useRouter();

  // Fetch ingredients from backend
  useEffect(() => {
    fetchIngredients();
    // Clear previous selections when entering this screen
    clearSelectedIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      setFetchingError(null);
      
      const response = await fetch(`${API_BASE_URL}/ingredients/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Transform backend data to match frontend structure
        const transformedIngredients = data.data.map((ingredient) => {
          console.log("RAW ingredient record from backend:", ingredient);
          
          // Check if icon is a full URL or just a filename
          let imageUri = null;
          if (ingredient.icon) {
            // If icon already contains http:// or https://, use it directly
            if (ingredient.icon.startsWith('http://') || ingredient.icon.startsWith('https://')) {
              imageUri = ingredient.icon;
            } else {
              // Otherwise, construct the URL using your API base
              // Remove '/api' from base URL if present and add '/uploads/'
              const baseUrl = API_BASE_URL.replace('/api', '');
              imageUri = `${baseUrl}/uploads/${ingredient.icon}`;
            }
          }
          
          console.log("FINAL image URL:", imageUri);

          return {
            id: ingredient.id,
            name: ingredient.name,
            selected: false,
            icon: ingredient.icon, // Keep the original icon value
            image: imageUri ? { uri: imageUri } : null,
          };
        });

        setIngredients(transformedIngredients);
      } else {
        setFetchingError(data.message?.join(', ') || 'Failed to fetch ingredients');
        setIngredients([]);
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setFetchingError('Network error. Please check your connection.');
      setIngredients([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const toggleIngredient = (id) => {
    setIngredients(ingredients.map(ingredient =>
      ingredient.id === id 
        ? { ...ingredient, selected: !ingredient.selected }
        : ingredient
    ));
  };

  const getSelectedIngredients = () => {
    return ingredients.filter(ingredient => ingredient.selected);
  };

  const handleNext = async () => {
    const selected = getSelectedIngredients();
    if (selected.length === 0) {
      Alert.alert('No ingredients selected', 'Please select at least one ingredient to continue.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Save selected ingredients to global context
      updateSelectedIngredients(selected);
      
      // Check if user is logged in before proceeding to filters
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert(
          "Login Required",
          "You need to login to filter recipes by your kitchen devices.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => setIsLoading(false)
            },
            {
              text: "Login",
              onPress: () => {
                setIsLoading(false);
                router.replace("/(auth)/sign-in");
              }
            }
          ]
        );
        return;
      }
      
      // Navigate to filter options page
      router.push("/recipe/specific/filter.options");
    } catch (error) {
      console.error('Error navigating to filters:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRetry = () => {
    fetchIngredients();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchIngredients();
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to render ingredient photo/icon
  const renderIngredientPhoto = (ingredient, isSelected = false) => {
    if (ingredient.image && ingredient.image.uri) {
      return (
        <Image 
          source={ingredient.image} 
          style={ingredientsStyles.ingredientImage}
          resizeMode="contain"
          onError={(e) => {
            console.log('Image load error:', e.nativeEvent.error);
            // Image failed to load - will show nothing
          }}
        />
      );
    } else {
      // Fallback if no image is available
      return (
        <View style={[ingredientsStyles.ingredientImage, ingredientsStyles.noImageContainer]}>
          <Ionicons 
            name="nutrition-outline" 
            size={30} 
            color={isSelected ? COLORS.primary : COLORS.textLight} 
          />
        </View>
      );
    }
  };

  if (isLoading && ingredients.length === 0) {
    return <LoadingSpinner message="Loading ingredients..." />;
  }

  if (fetchingError && ingredients.length === 0) {
    return (
      <View style={ingredientsStyles.container}>
        <View style={ingredientsStyles.header}>
          <TouchableOpacity 
            style={ingredientsStyles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={ingredientsStyles.title}>My Ingredients</Text>
          <View style={ingredientsStyles.backButtonPlaceholder} />
        </View>
        
        <View style={ingredientsStyles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.primary} />
          <Text style={ingredientsStyles.errorText}>{fetchingError}</Text>
          <TouchableOpacity 
            style={ingredientsStyles.retryButton}
            onPress={handleRetry}
          >
            <Text style={ingredientsStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const selectedCount = getSelectedIngredients().length;

  return (
    <KeyboardAvoidingView 
      style={ingredientsStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header with Back Button */}
      <View style={ingredientsStyles.header}>
        <TouchableOpacity 
          style={ingredientsStyles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={ingredientsStyles.title}>My Ingredients</Text>
        <View style={ingredientsStyles.backButtonPlaceholder} />
      </View>

      {/* Search Bar */}
      <View style={ingredientsStyles.searchContainer}>
        <TextInput
          style={ingredientsStyles.searchInput}
          placeholder="Search ingredients..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Selected Ingredients Count */}
      <View style={ingredientsStyles.selectedContainer}>
        <Text style={ingredientsStyles.selectedText}>
          Selected: {selectedCount} ingredient{selectedCount !== 1 ? 's' : ''}
        </Text>
        {selectedCount > 0 && (
          <TouchableOpacity 
            style={ingredientsStyles.clearSelectionButton}
            onPress={() => {
              setIngredients(ingredients.map(ing => ({ ...ing, selected: false })));
              clearSelectedIngredients();
            }}
          >
            <Text style={ingredientsStyles.clearSelectionText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info Banner */}
      <View style={ingredientsStyles.infoBanner}>
        <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
        <Text style={ingredientsStyles.infoText}>
          Select ingredients you have available. Recipes will be filtered to match your selections.
        </Text>
      </View>

      {/* Ingredients Grid */}
      <ScrollView 
        style={ingredientsStyles.ingredientsContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {filteredIngredients.length === 0 && !isLoading ? (
          <View style={ingredientsStyles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
            <Text style={ingredientsStyles.emptyText}>
              {searchQuery 
                ? `No ingredients found for "${searchQuery}"`
                : 'No ingredients available'
              }
            </Text>
          </View>
        ) : (
          <View style={ingredientsStyles.ingredientsGrid}>
            {filteredIngredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient.id}
                style={[
                  ingredientsStyles.ingredientCard,
                  ingredient.selected && ingredientsStyles.ingredientCardSelected,
                ]}
                onPress={() => toggleIngredient(ingredient.id)}
              >
                {/* Selection Checkmark */}
                {ingredient.selected && (
                  <View style={ingredientsStyles.selectionCheckmark}>
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  </View>
                )}
                
                {/* Ingredient Image */}
                {renderIngredientPhoto(ingredient, ingredient.selected)}
                
                {/* Ingredient Name */}
                <Text
                  style={[
                    ingredientsStyles.ingredientText,
                    ingredient.selected && ingredientsStyles.ingredientTextSelected,
                  ]}
                  numberOfLines={2}
                >
                  {ingredient.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Next Button */}
      <View style={ingredientsStyles.buttonContainer}>
        <TouchableOpacity 
          style={[
            ingredientsStyles.findButton,
            selectedCount === 0 && ingredientsStyles.findButtonDisabled
          ]} 
          onPress={handleNext}
          disabled={selectedCount === 0 || isLoading}
        >
          {isLoading ? (
            <View style={ingredientsStyles.loadingButtonContent}>
              <Text style={ingredientsStyles.findButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={ingredientsStyles.findButtonText}>
              Next: Filter Options ({selectedCount} selected)
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default IngredientsScreen;