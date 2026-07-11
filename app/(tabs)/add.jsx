import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "../../constants/colors";
import { addStyles } from "../../assets/styles/add.styles";
import { useRouter } from "expo-router";

const AddScreen = () => {
  const router = useRouter();

  const handleRandomRecipe = () => {
    router.push('../recipe/random/index1');
  };

  const handleSpecificRecipe = () => {
    router.push('../recipe/specific/ingredients');
  };

  return (
    <View style={addStyles.container}>
      {/* Header */}
      <View style={addStyles.header}>
        <TouchableOpacity 
          style={addStyles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={addStyles.headerTitle}>Add Recipe</Text>
        <View style={addStyles.headerRight} />
      </View>

      <ScrollView style={addStyles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Image Section */}
        <View style={addStyles.heroSection}>
          <Image 
            source={require("../../assets/images/rose-garden.jpg")} // Replace with your actual image path
            style={addStyles.heroImage}
            resizeMode="cover"
          />
          <View style={addStyles.heroOverlay}>
            <Text style={addStyles.heroTitle}>Discover Your Next Meal</Text>
            <Text style={addStyles.heroSubtitle}>
              Find perfect recipes based on what you have
            </Text>
          </View>
        </View>

        {/* Options Section */}
        <View style={addStyles.optionsSection}>
          <Text style={addStyles.sectionTitle}>Choose Your Method</Text>
              {/* Specific Recipes Card */}
          <TouchableOpacity 
            style={addStyles.recipeCard}
            onPress={handleSpecificRecipe}
          >
            <View style={addStyles.cardContent}>
              <View style={addStyles.iconContainer}>
                <Ionicons name="search" size={32} color={COLORS.primary} />
              </View>
              <View style={addStyles.textContainer}>
                <Text style={addStyles.cardTitle}>SPECIFIC RECIPES</Text>
                <Text style={addStyles.cardDescription}>
                  Search for specific recipes by ingredients, cooking time, or dietary preferences
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
            </View>
          </TouchableOpacity>
          
          {/* Random Recipe Card */}
          <TouchableOpacity 
            style={addStyles.recipeCard}
            onPress={handleRandomRecipe}
          >
            <View style={addStyles.cardContent}>
              <View style={addStyles.iconContainer}>
                <Ionicons name="shuffle" size={32} color={COLORS.primary} />
              </View>
              <View style={addStyles.textContainer}>
                <Text style={addStyles.cardTitle}>RANDOM RECIPE</Text>
                <Text style={addStyles.cardDescription}>
                  Get inspired with a randomly selected recipe based on your available devices
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
            </View>
          </TouchableOpacity>

      
        </View>

        {/* Info Section */}
        <View style={addStyles.infoSection}>
          <View style={addStyles.infoCard}>
            <Ionicons name="information-circle" size={24} color={COLORS.primary} />
            <View style={addStyles.infoTextContainer}>
              {/*<Text style={addStyles.infoTitle}>How it works</Text>*/}
              <Text style={addStyles.infoText}>
                Our APP analyzes your available kitchen devices and ingredients to suggest the perfect recipes for you
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default AddScreen;