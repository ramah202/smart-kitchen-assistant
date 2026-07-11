/* ** import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { recipeCardStyles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

const RecipeCard = ({ recipe }) => {
  const router = useRouter();

  // Check if image is local (object with uri) or remote (string)
  const imageSource = typeof recipe.image === 'string' 
    ? { uri: recipe.image } 
    : recipe.image;

  return (
    <TouchableOpacity
      style={recipeCardStyles.container}
      activeOpacity={0.9}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
    >
      <View style={recipeCardStyles.imageContainer}>
        <Image
          source={imageSource}
          style={recipeCardStyles.image}
          contentFit="cover"
          transition={500}
        />
      </View>

      <View style={recipeCardStyles.content}>
        <Text style={recipeCardStyles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        
        <Text style={recipeCardStyles.description} numberOfLines={1}>
          {recipe.description}
        </Text>

        <View style={recipeCardStyles.metaContainer}>
          <View style={recipeCardStyles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
            <Text style={recipeCardStyles.metaText}>{recipe.cookTime}</Text>
          </View>
          
          <View style={recipeCardStyles.metaItem}>
            <Ionicons name="pricetag-outline" size={14} color={COLORS.textLight} />
            <Text style={recipeCardStyles.metaText}>{recipe.price}</Text>
          </View>
        </View>

        <View style={recipeCardStyles.tagsContainer}>
          {recipe.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={recipeCardStyles.tag}>
              <Text style={recipeCardStyles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;*/
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { recipeCardStyles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";
import { useFavorites } from "../context/FavoritesContext"; // Add this

const RecipeCard = ({ recipe, onPress }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites(); // Use context

  // Initialize favorite state
  useEffect(() => {
    // The isFavorite function from context will give us the correct state
  }, [recipe?.id]);

  // Handle favorite button press
  const handleFavoritePress = async (e) => {
    e.stopPropagation();
    if (isLoading || !recipe?.id) return;
    
    setIsLoading(true);
    
    try {
      // Check if user is logged in
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Login Required", "Please login to save recipes to favorites", [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router?.push("/(auth)/sign-in") }
        ]);
        setIsLoading(false);
        return;
      }
      
      // Use global toggle function
      const success = await toggleFavorite(recipe.id);
      
      if (!success) {
        Alert.alert("Error", "Failed to update favorite");
      }
      // No need to update isFavorite state - context will handle it
      
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!recipe) return null;

  // Handle image source
  const getImageSource = () => {
    if (!recipe.image) return null;
    
    if (typeof recipe.image === 'string') {
      return { uri: recipe.image };
    } else if (recipe.image.uri) {
      return { uri: recipe.image.uri };
    } else if (typeof recipe.image === 'number') {
      return recipe.image;
    }
    
    return null;
  };

  const imageSource = getImageSource();
  const isFav = isFavorite(recipe.id);

  return (
    <TouchableOpacity
      style={recipeCardStyles.container}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Recipe Image with Favorite Button */}
      <View style={recipeCardStyles.imageContainer}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={recipeCardStyles.image}
            contentFit="cover"
            transition={500}
          />
        ) : (
          <View style={[recipeCardStyles.image, { 
            backgroundColor: COLORS.border,
            justifyContent: 'center',
            alignItems: 'center'
          }]}>
            <Ionicons name="fast-food-outline" size={40} color={COLORS.textLight} />
            <Text style={{ fontSize: 12, color: COLORS.textLight, marginTop: 8 }}>
              No Image
            </Text>
          </View>
        )}
        
        {/* Favorite Button */}
        <TouchableOpacity
          style={recipeCardStyles.favoriteButton}
          onPress={handleFavoritePress}
          disabled={isLoading}
        >
          <View style={[
            recipeCardStyles.favoriteButtonInner,
            isFav && recipeCardStyles.favoriteButtonActive
          ]}>
            <Ionicons
              name={isLoading ? "hourglass" : isFav ? "heart" : "heart-outline"}
              size={16}
              color={isFav ? COLORS.white : COLORS.text}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Recipe Content */}
      <View style={recipeCardStyles.content}>
        <Text style={recipeCardStyles.title} numberOfLines={1}>
          {recipe.title || 'Untitled Recipe'}
        </Text>
        
        <Text style={recipeCardStyles.description} numberOfLines={1}>
          {recipe.difficulty || 'Medium'}
        </Text>

        <View style={recipeCardStyles.metaContainer}>
          <View style={recipeCardStyles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
            <Text style={recipeCardStyles.metaText}>
              {recipe.cookTime || '30 min'}
            </Text>
          </View>
          
          <View style={recipeCardStyles.metaItem}>
            <Ionicons name="flame-outline" size={14} color={COLORS.textLight} />
            <Text style={recipeCardStyles.metaText}>
              {recipe.calories || '0 cal'}
            </Text>
          </View>
        </View>

        {recipe.category && (
          <View style={recipeCardStyles.tagsContainer}>
            <View style={recipeCardStyles.tag}>
              <Text style={recipeCardStyles.tagText}>
                {recipe.category.length > 15 ? `${recipe.category.substring(0, 15)}...` : recipe.category}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;


//components->RecipeCard.jsx
/*import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { recipeCardStyles } from "../assets/styles/home.styles";

export default function RecipeCard({ recipe }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={recipeCardStyles.container}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      activeOpacity={0.8}
    >
      <View style={recipeCardStyles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={recipeCardStyles.image}
          contentFit="cover"
          transition={300}
        />
      </View>

      <View style={recipeCardStyles.content}>
        <Text style={recipeCardStyles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        {recipe.description && (
          <Text style={recipeCardStyles.description} numberOfLines={2}>
            {recipe.description}
          </Text>
        )}

        <View style={recipeCardStyles.footer}>
          {recipe.cookTime && (
            <View style={recipeCardStyles.timeContainer}>
              <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
              <Text style={recipeCardStyles.timeText}>{recipe.cookTime}</Text>
            </View>
          )}
          {recipe.servings && (
            <View style={recipeCardStyles.servingsContainer}>
              <Ionicons name="people-outline" size={14} color={COLORS.textLight} />
              <Text style={recipeCardStyles.servingsText}>{recipe.servings}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}*/