import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get('window');

export const randomRecipeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  
  headerContent: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  
  // Recipe Card
  recipeCard: {
    backgroundColor: COLORS.white,
    margin: 20,
    marginTop: 25,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  
  recipeImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  
  recipeContent: {
    padding: 20,
  },
  
  // Title Row
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  recipeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  
  difficultyBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  
  // Meta Info
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '48%',
  },
  
  metaText: {
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  
  // Tap Message
  tapMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 10,
  },
  
  tapMessageText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  
  // Another Recipe Button
  anotherRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  anotherRecipeButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  
  // Refresh Instruction
  refreshInstruction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  
  refreshInstructionText: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.textLight,
  },
  
  // Empty State (if no recipe)
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 20,
  },
  // Add these to your existing randomRecipeStyles object:

infoCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.primary + '15',
  padding: 16,
  borderRadius: 12,
  marginHorizontal: 20,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: COLORS.primary + '30',
},

infoText: {
  flex: 1,
  marginLeft: 12,
  fontSize: 14,
  color: COLORS.text,
  lineHeight: 20,
},

deviceIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.primary + '10',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 20,
  alignSelf: 'flex-start',
  marginTop: 8,
},

deviceIndicatorText: {
  fontSize: 12,
  color: COLORS.primary,
  fontWeight: '500',
  marginLeft: 6,
},
});