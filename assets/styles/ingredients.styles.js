import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";
const { width } = Dimensions.get('window');

export const ingredientsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
  backButtonPlaceholder: {
    width: 40, // Same as back button for balance
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },
  searchContainer: {
    marginBottom: 20,
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
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  selectedContainer: {
    marginBottom: 16,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  ingredientsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ingredientCard: {
    width: (width - 60) / 2,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  ingredientCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },

 ingredientAllergy: {
    borderColor: '#FF4444',
  },

  ingredientImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  ingredientTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  allergyText: {
    color: '#FF4444',
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  findButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  findButtonDisabled: {
    backgroundColor: COLORS.textLight,
    shadowColor: COLORS.textLight,
  },
  findButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Add these to your existing ingredientsStyles

emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 40,
  minHeight: 200,
},

emptyText: {
  fontSize: 16,
  color: COLORS.textLight,
  textAlign: 'center',
  marginTop: 16,
},

placeholderImage: {
  width: 50,
  height: 50,
  marginBottom: 8,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: COLORS.background,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: COLORS.border,
},
// Add these styles to your existing ingredients.styles.js

clearSelectionButton: {
  backgroundColor: COLORS.background,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: COLORS.border,
},

clearSelectionText: {
  fontSize: 12,
  color: COLORS.textLight,
  fontWeight: '500',
},

infoBanner: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.primary + '10',
  padding: 12,
  marginHorizontal: 20,
  marginTop: 12,
  marginBottom: 16,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: COLORS.primary + '20',
},

infoText: {
  fontSize: 14,
  color: COLORS.primary,
  marginLeft: 8,
  flex: 1,
  lineHeight: 18,
},

selectionCheckmark: {
  position: 'absolute',
  top: 8,
  right: 8,
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: COLORS.primary,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
  borderWidth: 2,
  borderColor: COLORS.white,
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},

loadingButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
});