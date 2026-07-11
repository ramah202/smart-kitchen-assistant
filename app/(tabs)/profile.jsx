import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { profileStyles } from "../../assets/styles/profile.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../services/apiConfig";

const ProfileScreen = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
  });

  const [tempData, setTempData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Add show/hide password states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/(auth)/sign-in");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        const user = data.data;
        const updatedUserData = {
          name: user.name || "",
          surname: user.surname || "",
          email: user.email || "",
        };
        
        setUserData(updatedUserData);
        setTempData(updatedUserData);
        
        // Store user info for quick access if needed
        await AsyncStorage.setItem('userName', user.name);
        await AsyncStorage.setItem('userEmail', user.email);
        
      } else {
        // If token is invalid, redirect to login
        if (data.message?.includes("not authenticated") || response.status === 401) {
          await AsyncStorage.removeItem('userToken');
          Alert.alert("Session Expired", "Please login again");
          router.replace("/(auth)/sign-in");
        } else {
          Alert.alert("Error", data.message?.join(', ') || "Failed to load profile");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/(auth)/sign-in");
        return;
      }

      // Check if anything actually changed
      const hasChanges = 
        tempData.name !== userData.name ||
        tempData.surname !== userData.surname ||
        tempData.email !== userData.email;

      if (!hasChanges) {
        setIsEditing(false);
        Alert.alert("Info", "No changes were made");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tempData.name,
          surname: tempData.surname,
          email: tempData.email,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const updatedUser = data.data;
        const updatedUserData = {
          name: updatedUser.name,
          surname: updatedUser.surname,
          email: updatedUser.email,
        };
        
        setUserData(updatedUserData);
        setTempData(updatedUserData);
        
        // Update stored user info
        await AsyncStorage.setItem('userName', updatedUser.name);
        await AsyncStorage.setItem('userEmail', updatedUser.email);
        
        setIsEditing(false);
        Alert.alert("Success", data.message?.join(', ') || "Profile updated successfully!");
      } else {
        Alert.alert("Error", data.message?.join(', ') || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePassword = async () => {
    if (isSaving) return;
    
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    setIsSaving(true);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/(auth)/sign-in");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordData.newPassword,
          password_confirmation: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert("Success", data.message?.join(', ') || "Password changed successfully!");
        setPasswordData({
          newPassword: "",
          confirmPassword: ""
        });
        setIsChangingPassword(false);
      } else {
        Alert.alert("Error", data.message?.join(', ') || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Failed to change password. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // UPDATED LOGOUT FUNCTION - Matching favorites.jsx
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { 
        text: "Cancel", 
        style: "cancel" 
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear all user data from AsyncStorage
            await AsyncStorage.multiRemove([
              'userToken',
              'userId',
              'userEmail',
              'userName'
            ]);
            
            // Navigate to sign-in page
            router.replace("/(auth)/sign-in");
            
          } catch (error) {
            console.log("Error during logout:", error);
            // Even if there's an error, still try to navigate
            router.replace("/(auth)/sign-in");
          }
        },
      },
    ]);
  };

  // DELETE ACCOUNT FUNCTION - Updated to use backend API
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This is a permanent action that cannot be undone. All your data will be lost forever. Are you sure you want to proceed?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => setIsDeletingAccount(true)
        }
      ]
    );
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.toLowerCase() !== "delete my account") {
      Alert.alert("Error", "Please type 'delete my account' exactly as shown to confirm.");
      return;
    }

    setIsSaving(true);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/(auth)/sign-in");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Clear local storage
        await AsyncStorage.multiRemove([
          'userToken',
          'userId',
          'userEmail',
          'userName'
        ]);

        // Show success message and navigate
        Alert.alert(
          "Account Deleted",
          data.message?.join(', ') || "Your account has been permanently deleted.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/(auth)/sign-in");
              }
            }
          ]
        );
      } else {
        Alert.alert("Error", data.message?.join(', ') || "Failed to delete account");
      }
    } catch (error) {
      console.log("Error deleting account:", error);
      Alert.alert("Error", "Failed to delete account. Please try again.");
    } finally {
      setIsSaving(false);
      setIsDeletingAccount(false);
      setDeleteConfirmation("");
    }
  };

  const handleCancelDelete = () => {
    setIsDeletingAccount(false);
    setDeleteConfirmation("");
  };

  if (isLoading) {
    return (
      <View style={profileStyles.container}>
        <View style={profileStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={profileStyles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={profileStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={profileStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={profileStyles.scrollContent}
        >
          {/* HEADER WITH BACK BUTTON */}
          <View style={profileStyles.header}>
            <TouchableOpacity 
              style={profileStyles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={profileStyles.headerTitle}>Profile</Text>
            <View style={profileStyles.headerPlaceholder} />
          </View>

          {/* PROFILE IMAGE SECTION */}
          <View style={profileStyles.profileImageSection}>
            <View style={profileStyles.profileImageContainer}>
              <Image
                source={require("../../assets/images/user-profile.jpg")}
                style={profileStyles.profileImage}
                contentFit="cover"
              />
           
            </View>
            <Text style={profileStyles.userName}>{userData.name} {userData.surname}</Text>
            <Text style={profileStyles.userEmail}>{userData.email}</Text>
          </View>

          {/* PERSONAL INFO SECTION */}
          <View style={profileStyles.infoSection}>
            <View style={profileStyles.sectionHeader}>
              <Text style={profileStyles.sectionTitle}>Personal Info</Text>
              <TouchableOpacity 
                style={profileStyles.editButton}
                onPress={() => isEditing ? handleCancel() : setIsEditing(true)}
                disabled={isSaving}
              >
                <Text style={profileStyles.editButtonText}>
                  {isEditing ? "CANCEL" : "EDIT"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* INFO FIELDS */}
            <View style={profileStyles.infoFields}>
              {/* FIRST NAME */}
              <View style={profileStyles.fieldContainer}>
                <Text style={profileStyles.fieldLabel}>FIRST NAME</Text>
                {isEditing ? (
                  <TextInput
                    style={profileStyles.textInput}
                    value={tempData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    placeholder="Enter your first name"
                    editable={!isSaving}
                  />
                ) : (
                  <Text style={profileStyles.fieldValue}>
                    {userData.name || "Not set"}
                  </Text>
                )}
              </View>

              {/* LAST NAME */}
              <View style={profileStyles.fieldContainer}>
                <Text style={profileStyles.fieldLabel}>LAST NAME</Text>
                {isEditing ? (
                  <TextInput
                    style={profileStyles.textInput}
                    value={tempData.surname}
                    onChangeText={(text) => handleInputChange('surname', text)}
                    placeholder="Enter your last name"
                    editable={!isSaving}
                  />
                ) : (
                  <Text style={profileStyles.fieldValue}>
                    {userData.surname || "Not set"}
                  </Text>
                )}
              </View>

              {/* EMAIL */}
              <View style={profileStyles.fieldContainer}>
                <Text style={profileStyles.fieldLabel}>EMAIL</Text>
                {isEditing ? (
                  <TextInput
                    style={profileStyles.textInput}
                    value={tempData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isSaving}
                  />
                ) : (
                  <Text style={profileStyles.fieldValue}>
                    {userData.email || "Not set"}
                  </Text>
                )}
              </View>
            </View>

            {/* SAVE BUTTON (Visible only when editing) */}
            {isEditing && (
              <TouchableOpacity 
                style={[
                  profileStyles.saveButton,
                  isSaving && profileStyles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={profileStyles.saveButtonText}>SAVE CHANGES</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* CHANGE PASSWORD SECTION */}
          <View style={profileStyles.infoSection}>
            <View style={profileStyles.sectionHeader}>
              <Text style={profileStyles.sectionTitle}>Change Password</Text>
              <TouchableOpacity 
                style={profileStyles.editButton}
                onPress={() => setIsChangingPassword(!isChangingPassword)}
                disabled={isSaving}
              >
                <Text style={profileStyles.editButtonText}>
                  {isChangingPassword ? "CANCEL" : "CHANGE"}
                </Text>
              </TouchableOpacity>
            </View>

            {isChangingPassword && (
              <View style={profileStyles.infoFields}>
                {/* NEW PASSWORD */}
                <View style={profileStyles.fieldContainer}>
                  <Text style={profileStyles.fieldLabel}>NEW PASSWORD</Text>
                  <View style={profileStyles.passwordInputContainer}>
                    <TextInput
                      style={profileStyles.passwordInput}
                      value={passwordData.newPassword}
                      onChangeText={(text) => handlePasswordChange('newPassword', text)}
                      placeholder="Enter new password"
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                      editable={!isSaving}
                    />
                    <TouchableOpacity 
                      style={profileStyles.eyeButton}
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Ionicons 
                        name={showNewPassword ? "eye-outline" : "eye-off-outline"} 
                        size={20} 
                        color={COLORS.textLight} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* CONFIRM PASSWORD */}
                <View style={profileStyles.fieldContainer}>
                  <Text style={profileStyles.fieldLabel}>CONFIRM PASSWORD</Text>
                  <View style={profileStyles.passwordInputContainer}>
                    <TextInput
                      style={profileStyles.passwordInput}
                      value={passwordData.confirmPassword}
                      onChangeText={(text) => handlePasswordChange('confirmPassword', text)}
                      placeholder="Confirm new password"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      editable={!isSaving}
                    />
                    <TouchableOpacity 
                      style={profileStyles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons 
                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                        size={20} 
                        color={COLORS.textLight} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* PASSWORD REQUIREMENTS */}
                <View style={profileStyles.passwordRequirements}>
                  <Text style={profileStyles.requirementsTitle}>Password must contain:</Text>
                  <View style={profileStyles.requirementItem}>
                    <Ionicons 
                      name={passwordData.newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                      size={14} 
                      color={passwordData.newPassword.length >= 6 ? COLORS.primary : COLORS.textLight} 
                    />
                    <Text style={[
                      profileStyles.requirementText,
                      passwordData.newPassword.length >= 6 && profileStyles.requirementMet
                    ]}>
                      At least 6 characters
                    </Text>
                  </View>
                  <View style={profileStyles.requirementItem}>
                    <Ionicons 
                      name={passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword !== "" ? "checkmark-circle" : "ellipse-outline"} 
                      size={14} 
                      color={passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword !== "" ? COLORS.primary : COLORS.textLight} 
                    />
                    <Text style={[
                      profileStyles.requirementText,
                      passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword !== "" && profileStyles.requirementMet
                    ]}>
                      Passwords match
                    </Text>
                  </View>
                </View>

                {/* SAVE PASSWORD BUTTON */}
                <TouchableOpacity 
                  style={[
                    profileStyles.saveButton,
                    isSaving && profileStyles.saveButtonDisabled
                  ]}
                  onPress={handleSavePassword}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={profileStyles.saveButtonText}>UPDATE PASSWORD</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* LOGOUT SECTION */}
          <View style={profileStyles.logoutSection}>
            <TouchableOpacity 
              style={profileStyles.logoutButton}
              onPress={handleLogout}
              disabled={isSaving}
            >
              <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
              <Text style={profileStyles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>

          {/* DELETE ACCOUNT SECTION */}
          <View style={profileStyles.dangerSection}>
            <View style={profileStyles.sectionHeader}>
              <Text style={profileStyles.dangerTitle}>Danger Zone</Text>
            </View>

            {!isDeletingAccount ? (
              <TouchableOpacity 
                style={profileStyles.deleteAccountButton}
                onPress={handleDeleteAccount}
                disabled={isSaving}
              >
                <Ionicons name="warning-outline" size={22} color="#FF3B30" />
                <Text style={profileStyles.deleteAccountText}>Delete Account</Text>
              </TouchableOpacity>
            ) : (
              <View style={profileStyles.deleteConfirmation}>
                <Text style={profileStyles.deleteWarning}>
                  ⚠️ This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </Text>
                
                <View style={profileStyles.fieldContainer}>
                  <Text style={profileStyles.fieldLabel}>
                    Type "delete my account" to confirm
                  </Text>
                  <TextInput
                    style={profileStyles.textInput}
                    value={deleteConfirmation}
                    onChangeText={setDeleteConfirmation}
                    placeholder="delete my account"
                    autoCapitalize="none"
                    editable={!isSaving}
                  />
                </View>

                <View style={profileStyles.deleteActions}>
                  <TouchableOpacity 
                    style={profileStyles.cancelDeleteButton}
                    onPress={handleCancelDelete}
                    disabled={isSaving}
                  >
                    <Text style={profileStyles.cancelDeleteText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      profileStyles.confirmDeleteButton,
                      deleteConfirmation.toLowerCase() !== "delete my account" && 
                      profileStyles.confirmDeleteButtonDisabled,
                      isSaving && profileStyles.confirmDeleteButtonDisabled
                    ]}
                    onPress={handleConfirmDelete}
                    disabled={deleteConfirmation.toLowerCase() !== "delete my account" || isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <Text style={profileStyles.confirmDeleteText}>
                        Permanently Delete Account
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileScreen;