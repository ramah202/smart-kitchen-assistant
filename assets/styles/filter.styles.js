/*import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get('window');

export const filterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  optionImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 20,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  timeButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  timeButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  timeTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  filterButtonDisabled: {
    backgroundColor: COLORS.textLight,
    shadowColor: COLORS.textLight,
  },
  filterButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});*/
import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get('window');

export const filterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },

  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  emptySectionText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  optionImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 20,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  filterButtonDisabled: {
    backgroundColor: COLORS.textLight,
    shadowColor: COLORS.textLight,
  },
  filterButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Error handling styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  // Add this to see image borders for debugging
  // Add these to your existing filter.styles.js

selectedIngredientsSection: {
  paddingHorizontal: 20,
  paddingVertical: 16,
  backgroundColor: COLORS.white,
  marginBottom: 12,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.border,
},

selectedIngredientsTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: COLORS.text,
  marginBottom: 12,
},

selectedIngredientsScroll: {
  flexDirection: 'row',
  marginBottom: 12,
},

selectedIngredientChip: {
  backgroundColor: COLORS.primary + '15',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 16,
  marginRight: 8,
  borderWidth: 1,
  borderColor: COLORS.primary + '30',
},

selectedIngredientText: {
  fontSize: 12,
  color: COLORS.primary,
  fontWeight: '500',
},

deviceNote: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.primary + '10',
  padding: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: COLORS.primary + '20',
},

deviceNoteText: {
  fontSize: 14,
  color: COLORS.primary,
  marginLeft: 8,
  flex: 1,
},

multipleSelectionIndicator: {
  position: 'absolute',
  top: -5,
  right: -5,
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: COLORS.primary,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: COLORS.white,
  zIndex: 1,
},

});