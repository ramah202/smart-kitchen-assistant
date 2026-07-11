import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { cookingCompletionStyles } from '../../assets/styles/cookingCompletion.styles';
import { COLORS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const CookingCompletionScreen = () => {
  const handleBackToRecipe = () => {
    router.back(); // Go back to the recipe detail page
  };

  const handleBackToHome = () => {
    router.push('/'); // Navigate to home screen
  };

  return (
    <SafeAreaView style={cookingCompletionStyles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.white]}
        style={cookingCompletionStyles.gradientBackground}
      >
        
        {/* Celebration Icon/Image */}
        <View style={cookingCompletionStyles.celebrationContainer}>
          <View style={cookingCompletionStyles.iconCircle}>
            <Ionicons name="trophy" size={80} color={COLORS.primary} />
          </View>
          
          <Text style={cookingCompletionStyles.congratulationsText}>
            Congratulations!
          </Text>
          
          <Text style={cookingCompletionStyles.subtitleText}>
            You successfully made your Food
          </Text>
        </View>

        {/* Decorative Elements */}
        <View style={cookingCompletionStyles.decorativeCircles}>
          <View style={[cookingCompletionStyles.circle, cookingCompletionStyles.circle1]} />
          <View style={[cookingCompletionStyles.circle, cookingCompletionStyles.circle2]} />
          <View style={[cookingCompletionStyles.circle, cookingCompletionStyles.circle3]} />
        </View>

        {/* Action Buttons */}
        <View style={cookingCompletionStyles.buttonsContainer}>
          <TouchableOpacity
            style={cookingCompletionStyles.primaryButton}
            onPress={handleBackToRecipe}
          >
            <LinearGradient
              colors={[COLORS.primary, "#FF8E53"]}
              style={cookingCompletionStyles.buttonGradient}
            >
              <Ionicons name="restaurant" size={24} color={COLORS.white} />
              <Text style={cookingCompletionStyles.primaryButtonText}>
                View Recipe Again
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={cookingCompletionStyles.secondaryButton}
            onPress={handleBackToHome}
          >
            <Ionicons name="home-outline" size={24} color={COLORS.primary} />
            <Text style={cookingCompletionStyles.secondaryButtonText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>

        {/* Completion Message */}
        <View style={cookingCompletionStyles.messageContainer}>
          <Ionicons name="heart" size={20} color="#FF5C00" />
          <Text style={cookingCompletionStyles.messageText}>
            Enjoy your delicious meal.
          </Text>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
};

export default CookingCompletionScreen;