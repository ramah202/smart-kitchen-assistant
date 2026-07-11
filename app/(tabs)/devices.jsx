
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from "../../constants/colors";
import { devicesStyles } from "../../assets/styles/devices.styles";
import { useRouter } from "expo-router";
import API_BASE_URL from "../../services/apiConfig";

const DevicesScreen = ({ navigation }) => {
  const router = useRouter();
  const [allDevices, setAllDevices] = useState([]);
  const [userDevices, setUserDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load all devices and user devices on component mount
  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setIsLoading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!userToken) {
        Alert.alert("Error", "User not authenticated");
        router.replace("/(auth)/sign-in");
        return;
      }

      // Fetch all available devices
      const devicesResponse = await fetch(`${API_BASE_URL}/devices`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      const devicesResult = await devicesResponse.json();
      
      if (!devicesResult.success) {
        Alert.alert("Error", devicesResult.message?.[0] || "Failed to load devices");
        return;
      }

      // Fetch user's selected devices
      const userDevicesResponse = await fetch(`${API_BASE_URL}/user/my-devices`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      const userDevicesResult = await userDevicesResponse.json();

      // Transform all devices to include isActive status and proper image URL
const transformedDevices = devicesResult.data.map(device => {
  console.log("RAW device record from backend:", device);
  console.log("FINAL image URL:", device.icon);  // <-- check this output

  return {
    id: device.id.toString(),
    name: device.name,
    icon: device.icon,
    image: device.icon ? { uri: device.icon } : null,
    isActive: userDevicesResult.success 
      ? userDevicesResult.data.some(userDevice => userDevice.id === device.id)
      : false
  };
});



      setAllDevices(transformedDevices);
      setUserDevices(transformedDevices);

    } catch (error) {
      console.log("Error loading devices:", error);
      Alert.alert("Error", "Failed to load devices");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter devices based on search
  const filteredDevices = userDevices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDevices = filteredDevices.filter(device => device.isActive);
  const inactiveDevices = filteredDevices.filter(device => !device.isActive);

  const toggleDeviceStatus = async (deviceId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const device = userDevices.find(d => d.id === deviceId);
      
      if (device.isActive) {
        // Remove device from user's devices
        const response = await fetch(`${API_BASE_URL}/user/my-devices/${deviceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        
        if (result.success) {
          const updatedDevices = userDevices.map(device => 
            device.id === deviceId 
              ? { ...device, isActive: false }
              : device
          );
          setUserDevices(updatedDevices);
          setHasChanges(true);
        } else {
          Alert.alert("Error", result.message?.[0] || "Failed to remove device");
        }
      } else {
        // Add device to user's devices
        const response = await fetch(`${API_BASE_URL}/user/my-devices`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_device: parseInt(deviceId)
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          const updatedDevices = userDevices.map(device => 
            device.id === deviceId 
              ? { ...device, isActive: true }
              : device
          );
          setUserDevices(updatedDevices);
          setHasChanges(true);
        } else {
          Alert.alert("Error", result.message?.[0] || "Failed to add device");
        }
      }
    } catch (error) {
      console.log("Error toggling device status:", error);
      Alert.alert("Error", "Failed to update device");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const userToken = await AsyncStorage.getItem('userToken');
      
      if (!userToken) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      // Get current active devices
      const activeDeviceIds = userDevices.filter(d => d.isActive).map(d => d.id);
      
      // For now, we're saving immediately when toggling, so this is just for confirmation
      // You can add additional save logic here if needed
      
      Alert.alert("Success", "Your devices have been saved successfully!");
      setHasChanges(false);
      
    } catch (error) {
      console.log('Error saving devices:', error);
      Alert.alert('Error', 'Failed to save devices. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackPress = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Leave', 
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  // Helper function to render image properly
  const renderDeviceImage = (imageSource, isInactive = false) => {
    const imageStyle = isInactive 
      ? [devicesStyles.deviceImage, devicesStyles.inactiveDeviceImage]
      : devicesStyles.deviceImage;

    return (
      <Image 
        source={imageSource}
        style={imageStyle}
        resizeMode="cover"
        onError={(error) => {
          console.log('Image loading error:', error);
          // If image fails to load, it will show nothing or you can add a fallback
        }}
      />
    );
  };

  // Helper function to render device photo/icon
  const renderDevicePhoto = (device, isInactive = false) => {
    if (device.image && device.image.uri) {
      return renderDeviceImage(device.image, isInactive);
    } else {
      // Fallback if no image is available
      return (
        <View style={[devicesStyles.deviceImage, devicesStyles.noImageContainer]}>
          <Ionicons 
            name="image-outline" 
            size={32} 
            color={isInactive ? COLORS.textLight : COLORS.primary} 
          />
          <Text style={[
            devicesStyles.noImageText,
            isInactive && devicesStyles.noImageTextInactive
          ]}>
            No Photo
          </Text>
        </View>
      );
    }
  };

  if (isLoading) {
    return (
      <View style={devicesStyles.container}>
        <View style={devicesStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={devicesStyles.loadingText}>Loading devices...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={devicesStyles.container}>
      {/* Header */}
      <View style={devicesStyles.header}>
        <TouchableOpacity 
          style={devicesStyles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={devicesStyles.headerTitle}>My Kitchen Devices</Text>
        <View style={devicesStyles.headerRight} />
      </View>

      <ScrollView style={devicesStyles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={devicesStyles.searchSection}>
          <View style={devicesStyles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textLight} style={devicesStyles.searchIcon} />
            <TextInput
              style={devicesStyles.searchInput}
              placeholder="Search devices..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={devicesStyles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Active Devices Section */}
        <View style={devicesStyles.section}>
          <View style={devicesStyles.sectionHeader}>
            <Text style={devicesStyles.sectionTitle}>
              Active Devices ({activeDevices.length})
            </Text>
            <Text style={devicesStyles.sectionSubtitle}>
              Tap to deactivate
            </Text>
          </View>
          
          {activeDevices.length > 0 ? (
            <View style={devicesStyles.devicesGrid}>
              {activeDevices.map(device => (
                <TouchableOpacity 
                  key={device.id} 
                  style={devicesStyles.deviceCard}
                  onPress={() => toggleDeviceStatus(device.id)}
                >
                  {renderDevicePhoto(device, false)}
                  <View style={devicesStyles.deviceInfo}>
                    <Text style={devicesStyles.deviceName}>{device.name}</Text>
                  </View>
                  <View style={[devicesStyles.activeIndicator, { backgroundColor: COLORS.primary }]} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={devicesStyles.emptyText}>No active devices found</Text>
          )}
        </View>

        {/* Available Devices Section */}
        <View style={devicesStyles.section}>
          <View style={devicesStyles.sectionHeader}>
            <Text style={devicesStyles.sectionTitle}>
              Available Devices ({inactiveDevices.length})
            </Text>
            <Text style={devicesStyles.sectionSubtitle}>
              Tap to activate
            </Text>
          </View>
          
          {inactiveDevices.length > 0 ? (
            <View style={devicesStyles.devicesGrid}>
              {inactiveDevices.map(device => (
                <TouchableOpacity 
                  key={device.id} 
                  style={devicesStyles.deviceCard}
                  onPress={() => toggleDeviceStatus(device.id)}
                >
                  {renderDevicePhoto(device, true)}
                  <View style={devicesStyles.deviceInfo}>
                    <Text style={[devicesStyles.deviceName, devicesStyles.inactiveDeviceName]}>
                      {device.name}
                    </Text>
                  </View>
                  <View style={[devicesStyles.activeIndicator, { backgroundColor: COLORS.background }]} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={devicesStyles.emptyText}>
              {searchQuery ? 'No devices found' : 'All devices are active'}
            </Text>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            devicesStyles.saveButton,
            (!hasChanges || isSaving) && devicesStyles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={devicesStyles.saveButtonText}>
              {hasChanges ? 'SAVE CHANGES' : 'NO CHANGES'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DevicesScreen;