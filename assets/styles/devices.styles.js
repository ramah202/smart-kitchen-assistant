import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";
const { width } = Dimensions.get('window');

export const devicesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
     flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
   fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  
  // Search Section
  searchSection: {
    marginBottom: 30,
  },
  searchContainer: {
       flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  clearButton: {
    padding: 4,
  },
  
  // Sections
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  
  // Devices Grid
  devicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // Device Card
  deviceCard: {
    width: (width - 50) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
// For proportional scaling that maintains aspect ratio:
deviceImage: {
  width: '100%',
  height: undefined,
 // height: 120, 
  aspectRatio: 1, // This makes it square
  borderRadius: 8,
  marginBottom: 8,
  //backgroundColor: COLORS.background, // Add background to see boundaries
},
  inactiveDeviceImage: {
    opacity: 0.6,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  inactiveDeviceName: {
    color: COLORS.textLight,
  },
  deviceType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceTypeText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  
  // Active Indicator
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  
  // Empty State
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: 20,
  },
  
  // Save Button
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textLight,
    shadowColor: COLORS.textLight,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Add these to your existing devices.styles.js
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
loadingText: {
  marginTop: 16,
  fontSize: 16,
  color: COLORS.textLight,
},
deviceIconContainer: {
  marginTop: 4,
},
// Add these to your existing devices.styles.js
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
loadingText: {
  marginTop: 16,
  fontSize: 16,
  color: COLORS.textLight,
},
noImageContainer: {
  backgroundColor: COLORS.background,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: COLORS.border,
  borderStyle: 'dashed',
},
noImageText: {
  marginTop: 8,
  fontSize: 12,
  color: COLORS.primary,
  textAlign: 'center',
},
noImageTextInactive: {
  color: COLORS.textLight,
},
});


