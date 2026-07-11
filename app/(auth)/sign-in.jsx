
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from "../../services/apiConfig";

const SignInScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('rememberedEmail');
      const savedPassword = await AsyncStorage.getItem('rememberedPassword');
      const rememberMeStatus = await AsyncStorage.getItem('rememberMe');
      
      if (savedEmail && savedPassword && rememberMeStatus === 'true') {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
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
      // Prepare login data
      const loginData = {
        email: email,
        password: password
      };

      console.log('Sending login request to:', `${API_BASE_URL}/user/login`);
      
      // Call your backend API
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log('Backend login response:', result);

      // Check if success is true in the response
      if (result.success) {
        // Save user token and data
        if (result.data && result.data.token) {
          await AsyncStorage.setItem("userToken", result.data.token);
          
          // Save additional user data if available
          if (result.data.user) {
            await AsyncStorage.setItem("userId", result.data.user.id?.toString() || "");
            await AsyncStorage.setItem("userEmail", result.data.user.email || email);
            await AsyncStorage.setItem("userName", result.data.user.name || "");
          }
        } else if (result.token) {
          // If token is directly in result
          await AsyncStorage.setItem("userToken", result.token);
        }

        // Handle remember me functionality
        if (rememberMe) {
          await AsyncStorage.setItem("rememberedEmail", email);
          await AsyncStorage.setItem("rememberedPassword", password);
          await AsyncStorage.setItem("rememberMe", "true");
        } else {
          await AsyncStorage.multiRemove(['rememberedEmail', 'rememberedPassword', 'rememberMe']);
        }

        // Show success message from backend
        const successMessage = Array.isArray(result.message) 
          ? result.message.join(', ') 
          : result.message || "Signed in successfully!";
        
        Alert.alert("Success", successMessage, [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tabs)");
            },
          },
        ]);
      } else {
        // Error from backend - use the message from backend
        const errorMessage = Array.isArray(result.message) 
          ? result.message.join(', ') 
          : result.message || "Invalid email or password";
        
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        "Error", 
        "Network error. Please check your connection and try again."
      );
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
          <View style={authStyles.imageContainer}>
            <Image 
              source={require("../../assets/images/i1.png")} 
              style={authStyles.image} 
              contentFit="contain" 
            />
          </View>

          <Text style={authStyles.title}>Welcome Back</Text>

          {/* Form Container */}
          <View style={authStyles.formContainer}>
            {/* Email Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter email"
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
                placeholder="Enter password"
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

            {/* Options Row */}
            <View style={authStyles.optionsRow}>
              {/* Remember Me */}
              <TouchableOpacity 
                style={authStyles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[
                  authStyles.checkbox,
                  rememberMe && authStyles.checkboxChecked
                ]}>
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color={COLORS.white} />
                  )}
                </View>
                <Text style={authStyles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              {/* Forgot Password */}
             {/* <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={authStyles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>*/}
            </View>

            {/* Sign In Button */}
            <TouchableOpacity 
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity 
              style={authStyles.linkContainer}
              onPress={() => router.push("/(auth)/sign-up")}
            >
              <Text style={authStyles.linkText}>
                Don't have an account?{" "}
                <Text style={authStyles.link}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInScreen;
