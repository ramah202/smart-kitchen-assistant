
import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import API_BASE_URL from "../../services/apiConfig";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validation
    if (!name || !surname || !email || !password || !password_confirmation) {
      Alert.alert("Error", "Please enter all fields.");
      return;
    }

    if (password !== password_confirmation) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Prepare user data for API - matching backend exactly
      const userData = {
        name: name,
        surname: surname,
        email: email,
        password: password,
        password_confirmation: password_confirmation
      };

      console.log('Sending request to:', `${API_BASE_URL}/user/register`);
      
      // Call your backend API
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log('Backend response:', result);

      // Check if success is true in the response
      if (result.success) {
        // Success - show success message from backend
        const successMessage = Array.isArray(result.message) 
          ? result.message.join(', ') 
          : result.message || "Account created successfully!";
        
        Alert.alert("Success", successMessage, [
          {
            text: "OK",
            onPress: () => {
              // Clear form
              setName("");
              setSurname("");
              setEmail("");
              setPassword("");
              setPasswordConfirmation("");
              // Navigate to sign-in page
              router.push("/(auth)/sign-in");
            }
          }
        ]);
        
      } else {
        // Error from backend - use the message from backend
        const errorMessage = Array.isArray(result.message) 
          ? result.message.join(', ') 
          : result.message || "Failed to create account. Please try again.";
        
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert("Error", "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          {/* Title */}
          <Text style={authStyles.title}>Create an Account</Text>
          <Text style={authStyles.subtitle}>Join us to get started!</Text>

          <View style={authStyles.formContainer}>
            {/* Name Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Name"
                placeholderTextColor={COLORS.textLight}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Surname Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Surname"
                placeholderTextColor={COLORS.textLight}
                value={surname}
                onChangeText={setSurname}
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
            </View>

            {/* Password Confirmation Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.textLight}
                value={password_confirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={authStyles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
            </View>

            {/* Password Requirements */}
            <View style={authStyles.passwordRequirements}>
              <Text style={authStyles.requirementsTitle}>Password must contain:</Text>
              <View style={authStyles.requirementItem}>
                <Ionicons 
                  name={password.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                  size={14} 
                  color={password.length >= 6 ? COLORS.primary : COLORS.textLight} 
                />
                <Text style={[
                  authStyles.requirementText,
                  password.length >= 6 && authStyles.requirementMet
                ]}>
                  At least 6 characters
                </Text>
              </View>
              <View style={authStyles.requirementItem}>
                <Ionicons 
                  name={password === password_confirmation && password !== "" ? "checkmark-circle" : "ellipse-outline"} 
                  size={14} 
                  color={password === password_confirmation && password !== "" ? COLORS.primary : COLORS.textLight} 
                />
                <Text style={[
                  authStyles.requirementText,
                  password === password_confirmation && password !== "" && authStyles.requirementMet
                ]}>
                  Passwords match
                </Text>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Text style={authStyles.linkText}>
                Already have an account?{" "}
                <Text style={authStyles.link}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUp;

