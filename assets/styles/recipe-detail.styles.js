/*import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";



export const recipeDetailStyles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
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
  
  // Counter
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  counterText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  
  // List Container
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 5,
  },
  
  // Recipe Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  
  // Area and Rating Container
  areaRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  areaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  areaText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  
  // Meta Information
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.textLight,
  },
  
  // Difficulty Badge
  difficultyBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Loader (مازال موجود للاحتياط)
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});*/
import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { height } = Dimensions.get("window");

export const recipeDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    height: height * 0.5,
    position: "relative",
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  headerImage: {
    width: "100%",
    height: "120%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  floatingButtons: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  titleSection: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  recipeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  locationText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contentSection: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: "center",
    fontWeight: "500",
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
  },
  countBadge: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  videoCard: {
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.card,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  webview: {
    flex: 1,
  },
  ingredientsGrid: {
    gap: 12,
  },
  ingredientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  ingredientNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  ingredientNumberText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },
  ingredientCheck: {
    opacity: 0.5,
  },
  instructionsContainer: {
    gap: 16,
  },
  instructionCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 16,
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  instructionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  completeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    gap: 10,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContent: {
    alignItems: "center",
    padding: 32,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 20,
    marginBottom: 12,
  },
  errorDescription: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    opacity: 0.9,
  },
  errorButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  errorButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },

// Add these to your existing recipeDetailStyles object:

viewAllStepsButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.background,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  marginLeft: 'auto',
  borderWidth: 1,
  borderColor: COLORS.border,
},

viewAllStepsText: {
  fontSize: 12,
  fontWeight: '600',
  color: COLORS.primary,
  marginRight: 4,
},

stepByStepButton: {
  marginTop: 16,
  borderRadius: 12,
  overflow: 'hidden',
  elevation: 3,
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},

stepButtonGradient: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 16,
  paddingHorizontal: 24,
},

stepButtonText: {
  fontSize: 16,
  fontWeight: '700',
  color: COLORS.white,
  marginLeft: 10,
},
// Add these styles to your existing recipeDetailStyles object:

videoCard: {
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: '#1a1a1a',
  marginTop: 12,
  borderWidth: 1,
  borderColor: '#333',
},

videoThumbnailContainer: {
  width: '100%',
  height: 200,
  position: 'relative',
},

videoThumbnail: {
  width: '100%',
  height: '100%',
},

videoOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},

playButton: {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 40,
  padding: 8,
  marginBottom: 12,
},

watchText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
  textShadowColor: 'rgba(0, 0, 0, 0.8)',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3,
},

videoPlaceholder: {
  width: '100%',
  height: 200,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000',
  padding: 20,
},

videoPlaceholderText: {
  color: 'white',
  fontSize: 18,
  fontWeight: '600',
  marginTop: 12,
  textAlign: 'center',
},

videoPlaceholderSubtext: {
  color: '#aaa',
  fontSize: 14,
  marginTop: 4,
  textAlign: 'center',
},

videoInfo: {
  padding: 16,
  backgroundColor: '#1a1a1a',
},

videoTitle: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 4,
},

videoDescription: {
  color: '#aaa',
  fontSize: 14,
},
// Add these styles to your existing recipeDetailStyles object:

youtubePlayerContainer: {
  borderRadius: 12,
  overflow: 'hidden',
  marginTop: 12,
  backgroundColor: '#000',
  borderWidth: 1,
  borderColor: '#333',
},

youtubeWebView: {
  borderRadius: 12,
},

videoControlButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FF0000',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  marginLeft: 'auto',
},

videoControlText: {
  fontSize: 12,
  fontWeight: '600',
  color: COLORS.white,
  marginLeft: 4,
},

videoControls: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingVertical: 12,
  paddingHorizontal: 20,
  backgroundColor: COLORS.background,
  borderTopWidth: 1,
  borderTopColor: COLORS.border,
},

videoControl: {
  alignItems: 'center',
  padding: 8,
  minWidth: 80,
},

videoControlLabel: {
  fontSize: 12,
  color: COLORS.text,
  marginTop: 4,
  textAlign: 'center',
},
// Add these styles to your existing recipeDetailStyles object:

instructionTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: COLORS.text,
  marginBottom: 8,
},

noStepsContainer: {
  alignItems: 'center',
  padding: 30,
  backgroundColor: COLORS.background,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: COLORS.border,
  borderStyle: 'dashed',
  marginTop: 10,
},

noStepsText: {
  fontSize: 14,
  color: COLORS.textLight,
  marginTop: 10,
  textAlign: 'center',
},

videoIndicator: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.primary + '15',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  marginRight: 8,
},

videoIndicatorText: {
  fontSize: 12,
  color: COLORS.primary,
  marginLeft: 4,
  fontWeight: '500',
},
// Add these to your existing recipeDetailStyles object:

noIngredientsContainer: {
  alignItems: 'center',
  padding: 40,
  backgroundColor: COLORS.background,
  borderRadius: 16,
  borderWidth: 2,
  borderColor: COLORS.border,
  borderStyle: 'dashed',
  marginTop: 10,
},

noIngredientsText: {
  fontSize: 16,
  color: COLORS.textLight,
  marginTop: 16,
  textAlign: 'center',
  fontWeight: '500',
},

noIngredientsIcon: {
  marginBottom: 12,
},


});
