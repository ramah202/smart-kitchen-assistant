import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFilter } from '../../context/FilterContext';
import { useIngredients } from '../../context/IngredientsContext';
import { filterStyles } from '../../../assets/styles/filter.styles';
import { COLORS } from "../../../constants/colors";
import LoadingSpinner from '../../../components/LoadingSpinner';
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../../services/apiConfig";

const FilterOptions = () => {
  const router = useRouter();
  const { filters, updateFilters } = useFilter();
  const { selectedIngredients } = useIngredients();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingError, setFetchingError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for all filter options from backend
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [moods, setMoods] = useState([]);
  const [mealTimes, setMealTimes] = useState([]);
  const [userHasDevices, setUserHasDevices] = useState(true); // Check if user has devices

  // Time options (must match backend format)
  const timeOptions = [
    { id: '15', name: '15 min or less' },
    { id: '30', name: '30 min or less' },
    { id: '45', name: '45 min or less' },
    { id: '60', name: '60 min or less' },
    { id: 'gt_60', name: '60+ min' },
  ];

  // Fetch all filter data from backend
  useEffect(() => {
    fetchAllFilterData();
  }, []);

  // Check if user has kitchen devices
  const checkUserDevices = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/my-devices`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data.success && data.data && data.data.length > 0;
    } catch (error) {
      console.error('Error checking user devices:', error);
      return false;
    }
  };

  const fetchAllFilterData = async () => {
    try {
      setIsLoading(true);
      setFetchingError(null);

      // Get token first to check devices
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert(
          "Login Required",
          "Please login to filter recipes.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setIsLoading(false);
                router.back();
              }
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

      // Check if user has devices
      const hasDevices = await checkUserDevices(token);
      setUserHasDevices(hasDevices);

      if (!hasDevices) {
        Alert.alert(
          "No Kitchen Devices",
          "You haven't added any kitchen devices to your profile. Recipes will be filtered without device compatibility.",
          [{ text: "OK" }]
        );
      }

      // Fetch categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/categories/`);
      const categoriesData = await categoriesResponse.json();
      
      if (categoriesData.success) {
        const transformedCategories = categoriesData.data.map(category => {
          let imageUri = null;
          if (category.icon) {
            if (category.icon.startsWith('http://') || category.icon.startsWith('https://')) {
              imageUri = category.icon;
            } else {
              let baseUrl = API_BASE_URL;
              if (baseUrl.endsWith('/api')) {
                baseUrl = baseUrl.replace('/api', '');
              }
              baseUrl = baseUrl.replace(/\/$/, '');
              
              const iconPath = category.icon.startsWith('uploads/') 
                ? category.icon 
                : `uploads/${category.icon}`;
              
              imageUri = `${baseUrl}/${iconPath}`;
            }
          }
          
          return {
            id: category.id,
            name: category.name,
            icon: category.icon,
            image: imageUri ? { uri: imageUri } : null,
          };
        });
        setCategories(transformedCategories);
      } else {
        console.error('Failed to fetch categories:', categoriesData.message);
      }

      // Fetch areas
      const areasResponse = await fetch(`${API_BASE_URL}/areas/`);
      const areasData = await areasResponse.json();
      
      if (areasData.success) {
        const transformedAreas = areasData.data.map(area => ({
          id: area.id,
          name: area.name,
        }));
        setAreas(transformedAreas);
      } else {
        console.error('Failed to fetch areas:', areasData.message);
      }

      // Fetch moods
      try {
        const moodsResponse = await fetch(`${API_BASE_URL}/moods/`);
        const moodsData = await moodsResponse.json();
        
        if (moodsData.success) {
          const transformedMoods = moodsData.data.map(mood => {
            let imageUri = null;
            if (mood.icon) {
              if (mood.icon.startsWith('http://') || mood.icon.startsWith('https://')) {
                imageUri = mood.icon;
              } else {
                let baseUrl = API_BASE_URL;
                if (baseUrl.endsWith('/api')) {
                  baseUrl = baseUrl.replace('/api', '');
                }
                baseUrl = baseUrl.replace(/\/$/, '');
                
                const iconPath = mood.icon.startsWith('uploads/') 
                  ? mood.icon 
                  : `uploads/${mood.icon}`;
                
                imageUri = `${baseUrl}/${iconPath}`;
              }
            }
            
            return {
              id: mood.id,
              name: mood.name,
              icon: mood.icon,
              image: imageUri ? { uri: imageUri } : null,
            };
          });
          setMoods(transformedMoods);
        }
      } catch (error) {
        console.log('Moods endpoint not available:', error);
      }

      // Fetch meal times
      try {
        const mealTimesResponse = await fetch(`${API_BASE_URL}/mealtimes/`);
        const mealTimesData = await mealTimesResponse.json();
        
        if (mealTimesData.success) {
          const transformedMealTimes = mealTimesData.data.map(mealTime => ({
            id: mealTime.id,
            name: mealTime.name,
          }));
          setMealTimes(transformedMealTimes);
        }
      } catch (error) {
        console.log('Meal times endpoint not available:', error);
      }

    } catch (error) {
      console.error('Error fetching filter data:', error);
      setFetchingError('Failed to load filter options. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle selection for single selections (category, time, area)
  const toggleSingleSelection = (type, id) => {
    const currentSelection = filters[type];
    
    // Toggle: if already selected, clear it; otherwise select new one
    updateFilters({ [type]: currentSelection === id ? null : id });
  };

  // Toggle selection for array selections (moods, mealTime)
  const toggleArraySelection = (type, id) => {
    const currentSelection = filters[type] || [];
    const isSelected = currentSelection.includes(id);
    
    if (isSelected) {
      // Remove from array
      updateFilters({ [type]: currentSelection.filter(itemId => itemId !== id) });
    } else {
      // Add to array
      updateFilters({ [type]: [...currentSelection, id] });
    }
  };

  // Unified toggle function that handles both types
  const toggleSelection = (type, id) => {
    // Check if the filter type is supposed to be an array (moods, mealTime)
    const isArrayType = type === 'moods' || type === 'mealTime';
    
    if (isArrayType) {
      toggleArraySelection(type, id);
    } else {
      toggleSingleSelection(type, id);
    }
  };

  const isSelected = (type, id) => {
    const currentSelection = filters[type];
    
    if (currentSelection === null || currentSelection === undefined) {
      return false;
    }
    
    // Check if type is array or single value
    if (Array.isArray(currentSelection)) {
      return currentSelection.includes(id);
    } else {
      return currentSelection === id;
    }
  };

  // Handle Apply Filters with Backend API Call
  const handleApplyFilters = async () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('No Ingredients Selected', 'Please go back and select some ingredients first.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get user token for authentication
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert("Session Expired", "Please login again.");
        router.replace("/(auth)/sign-in");
        return;
      }

      // Always use devices filter (useMyDevices: true)
      // Backend will handle the case when user has no devices
      const filterData = {
        useMyDevices: true, // ALWAYS TRUE
        ingredientIds: selectedIngredients.map(ing => ing.id),
        categoryIds: filters.category ? [filters.category] : [],
        mealTimeIds: filters.mealTime || [],
        areaIds: filters.area ? [filters.area] : [],
        moodIds: filters.moods || [],
        timeRange: filters.time || "", // String from timeOptions
      };

      console.log('Sending filter data to backend:', JSON.stringify(filterData, null, 2));
      
      // Call the backend filter endpoint
      const response = await fetch(`${API_BASE_URL}/recipes/filter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterData),
      });

      const data = await response.json();
      
      console.log('Backend response:', data);
      
      if (data.success) {
        // Prepare filter summary for display
        const timeLabel = timeOptions.find(t => t.id === filters.time)?.name || null;
        const categoryLabel = filters.category ? categories.find(c => c.id === filters.category)?.name : null;
        const areaLabel = filters.area ? areas.find(a => a.id === filters.area)?.name : null;
        
        // Navigate to results page with filtered recipes
        router.push({
          pathname: "/recipe/specific/recipes.list",
          params: {
            filteredRecipes: JSON.stringify(data.data),
            filterApplied: 'true',
            filterSummary: JSON.stringify({
              ingredients: selectedIngredients.length,
              category: categoryLabel,
              time: timeLabel,
              area: areaLabel,
              moods: filters.moods ? filters.moods.length : 0,
              mealTime: filters.mealTime ? filters.mealTime.length : 0,
              devices: userHasDevices ? 'With my devices' : 'No devices available'
            })
          }
        });
      } else {
        // Handle specific backend error messages
        const errorMessage = data.message?.join(', ') || 'No recipes match your filter criteria.';
        
        if (errorMessage.includes('No devices found') || errorMessage.includes('No recipe-device relations')) {
          Alert.alert(
            'Device Compatibility', 
            'No recipes fully compatible with your kitchen devices. Try adjusting other filters or add more devices to your profile.',
            [{ text: 'OK', onPress: () => setIsSubmitting(false) }]
          );
        } else {
          Alert.alert(
            'No Recipes Found', 
            errorMessage,
            [{ text: 'OK', onPress: () => setIsSubmitting(false) }]
          );
        }
      }
    } catch (error) {
      console.error('Filter API error:', error);
      Alert.alert('Error', 'Failed to filter recipes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleClearFilters = () => {
    updateFilters({
      category: null,
      time: null,
      area: null,
      moods: [],
      mealTime: [],
    });
  };

  const handleRetry = () => {
    fetchAllFilterData();
  };

  const renderImageOrIcon = (item, type) => {
    // For categories and moods with images from backend
    if ((type === 'category' || type === 'mood') && item.image && item.image.uri) {
      return (
        <View style={{ alignItems: 'center' }}>
          <Image 
            source={item.image} 
            style={filterStyles.optionImage}
            resizeMode="contain"
            onError={(e) => {
              console.log('Image load error for', item.name, ':', e.nativeEvent.error);
            }}
          />
        </View>
      );
    }
    
    // For areas (globe icon)
    if (type === 'area') {
      return (
        <View style={filterStyles.placeholderImage}>
          <Ionicons name="globe-outline" size={24} color={COLORS.textLight} />
        </View>
      );
    }
    
    // For time (clock icon)
    if (type === 'time') {
      return (
        <View style={filterStyles.placeholderImage}>
          <Ionicons name="time-outline" size={24} color={COLORS.textLight} />
        </View>
      );
    }
    
    // For meal times (meal icons based on name)
    if (type === 'mealTime') {
      let iconName = 'fast-food-outline';
      if (item.name.toLowerCase().includes('breakfast')) iconName = 'cafe-outline';
      if (item.name.toLowerCase().includes('lunch')) iconName = 'restaurant-outline';
      if (item.name.toLowerCase().includes('dinner')) iconName = 'moon-outline';
      if (item.name.toLowerCase().includes('snack')) iconName = 'cafe-outline';
      
      return (
        <View style={filterStyles.placeholderImage}>
          <Ionicons name={iconName} size={24} color={COLORS.textLight} />
        </View>
      );
    }
    
    // Default placeholder - show if image fails
    return (
      <View style={filterStyles.placeholderImage}>
        <Ionicons name="image-outline" size={24} color={COLORS.textLight} />
      </View>
    );
  };

  if (isLoading && (categories.length === 0 && areas.length === 0 && moods.length === 0 && mealTimes.length === 0)) {
    return <LoadingSpinner message="Loading filter options..." />;
  }

  if (fetchingError && (categories.length === 0 && areas.length === 0 && moods.length === 0 && mealTimes.length === 0)) {
    return (
      <View style={filterStyles.container}>
        <View style={filterStyles.header}>
          <TouchableOpacity 
            style={filterStyles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={filterStyles.title}>Filter your search</Text>
          <View style={filterStyles.backButtonPlaceholder} />
        </View>
        
        <View style={filterStyles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.primary} />
          <Text style={filterStyles.errorText}>{fetchingError}</Text>
          <TouchableOpacity 
            style={filterStyles.retryButton}
            onPress={handleRetry}
          >
            <Text style={filterStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const hasActiveFilters = 
    filters.category || 
    filters.time || 
    filters.area || 
    (filters.moods && filters.moods.length > 0) || 
    (filters.mealTime && filters.mealTime.length > 0);

  return (
    <View style={filterStyles.container}>
      {/* Header with Back Button */}
      <View style={filterStyles.header}>
        <TouchableOpacity 
          style={filterStyles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={filterStyles.title}>Filter your search</Text>
        <View style={filterStyles.headerRight}>
          {hasActiveFilters && (
            <TouchableOpacity 
              style={filterStyles.clearButton}
              onPress={handleClearFilters}
            >
              <Text style={filterStyles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={filterStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && (categories.length > 0 || areas.length > 0 || moods.length > 0 || mealTimes.length > 0)}
            onRefresh={fetchAllFilterData}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Selected Ingredients Summary */}
        <View style={filterStyles.selectedIngredientsSection}>
          <Text style={filterStyles.selectedIngredientsTitle}>
            Filtering with {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={filterStyles.selectedIngredientsScroll}>
            {selectedIngredients.map(ingredient => (
              <View key={ingredient.id} style={filterStyles.selectedIngredientChip}>
                <Text style={filterStyles.selectedIngredientText}>{ingredient.name}</Text>
              </View>
            ))}
          </ScrollView>
          
          {/* Device Compatibility Note */}
          <View style={filterStyles.deviceNote}>
            <Ionicons name="hardware-chip-outline" size={16} color={COLORS.primary} />
            <Text style={filterStyles.deviceNoteText}>
              {userHasDevices 
                ? "Recipes will be filtered to match your kitchen devices" 
                : "No kitchen devices found in your profile"
              }
            </Text>
          </View>
        </View>

        {/* CATEGORIES Section - Single Selection */}
        <View style={filterStyles.section}>
          <Text style={filterStyles.sectionTitle}>CATEGORIES (Choose One)</Text>
          {categories.length === 0 ? (
            <Text style={filterStyles.emptySectionText}>No categories available</Text>
          ) : (
            <View style={filterStyles.optionsGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    filterStyles.optionButton,
                    isSelected('category', category.id) && filterStyles.optionButtonSelected,
                  ]}
                  onPress={() => toggleSelection('category', category.id)}
                >
                  {renderImageOrIcon(category, 'category')}
                  <Text style={[
                    filterStyles.optionText,
                    isSelected('category', category.id) && filterStyles.optionTextSelected,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* TIME Section - Single Selection */}
        <View style={filterStyles.section}>
          <Text style={filterStyles.sectionTitle}>COOKING TIME (Choose One)</Text>
          <View style={filterStyles.optionsGrid}>
            {timeOptions.map((time) => (
              <TouchableOpacity
                key={time.id}
                style={[
                  filterStyles.optionButton,
                  isSelected('time', time.id) && filterStyles.optionButtonSelected,
                ]}
                onPress={() => toggleSelection('time', time.id)}
              >
                {renderImageOrIcon(time, 'time')}
                <Text style={[
                  filterStyles.optionText,
                  isSelected('time', time.id) && filterStyles.optionTextSelected,
                ]}>
                  {time.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AREA Section - Single Selection */}
        <View style={filterStyles.section}>
          <Text style={filterStyles.sectionTitle}>CUISINE AREA (Choose One)</Text>
          {areas.length === 0 ? (
            <Text style={filterStyles.emptySectionText}>No areas available</Text>
          ) : (
            <View style={filterStyles.optionsGrid}>
              {areas.map((area) => (
                <TouchableOpacity
                  key={area.id}
                  style={[
                    filterStyles.optionButton,
                    isSelected('area', area.id) && filterStyles.optionButtonSelected,
                  ]}
                  onPress={() => toggleSelection('area', area.id)}
                >
                  {renderImageOrIcon(area, 'area')}
                  <Text style={[
                    filterStyles.optionText,
                    isSelected('area', area.id) && filterStyles.optionTextSelected,
                  ]}>
                    {area.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* MOODS Section - Multiple Selection */}
        {moods.length > 0 && (
          <View style={filterStyles.section}>
            <Text style={filterStyles.sectionTitle}>MOODS (Choose Multiple)</Text>
            <View style={filterStyles.optionsGrid}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    filterStyles.optionButton,
                    isSelected('moods', mood.id) && filterStyles.optionButtonSelected,
                  ]}
                  onPress={() => toggleSelection('moods', mood.id)}
                >
                  {renderImageOrIcon(mood, 'mood')}
                  <Text style={[
                    filterStyles.optionText,
                    isSelected('moods', mood.id) && filterStyles.optionTextSelected,
                  ]}>
                    {mood.name}
                  </Text>
                  {isSelected('moods', mood.id) && (
                    <View style={filterStyles.multipleSelectionIndicator}>
                      <Ionicons name="checkmark" size={12} color={COLORS.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* MEAL TIME Section - Multiple Selection */}
        {mealTimes.length > 0 && (
          <View style={filterStyles.section}>
            <Text style={filterStyles.sectionTitle}>MEAL TIME (Choose Multiple)</Text>
            <View style={filterStyles.optionsGrid}>
              {mealTimes.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={[
                    filterStyles.optionButton,
                    isSelected('mealTime', meal.id) && filterStyles.optionButtonSelected,
                  ]}
                  onPress={() => toggleSelection('mealTime', meal.id)}
                >
                  {renderImageOrIcon(meal, 'mealTime')}
                  <Text style={[
                    filterStyles.optionText,
                    isSelected('mealTime', meal.id) && filterStyles.optionTextSelected,
                  ]}>
                    {meal.name}
                  </Text>
                  {isSelected('mealTime', meal.id) && (
                    <View style={filterStyles.multipleSelectionIndicator}>
                      <Ionicons name="checkmark" size={12} color={COLORS.white} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* FILTER Button */}
      <View style={filterStyles.buttonContainer}>
        <TouchableOpacity 
          style={[
            filterStyles.filterButton,
            (selectedIngredients.length === 0 || isSubmitting) && filterStyles.filterButtonDisabled
          ]}
          onPress={handleApplyFilters}
          disabled={selectedIngredients.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={filterStyles.filterButtonText}>
              {selectedIngredients.length === 0 
                ? 'SELECT INGREDIENTS FIRST' 
                : `FIND RECIPES (${selectedIngredients.length} ingredients)`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterOptions;