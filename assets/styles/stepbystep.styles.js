import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';


const { width, height } = Dimensions.get('window');

export const stepByStepStyles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  timerButtonActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  
  // Progress Section
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  
  stepNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  
  stepTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  
  // Content Section
  scrollView: {
    flex: 1,
  },
  
  contentContainer: {
    padding: 20,
  },
  
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
    lineHeight: 34,
  },
  
  // Media Container
  mediaContainer: {
    width: '100%',
    marginBottom: 20,
  },
  
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
  },
  
  stepImage: {
    width: '100%',
    height: '100%',
  },
  
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  
  noMediaContainer: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  
  noMediaText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 10,
  },
  
  descriptionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    textAlign: 'center',
  },
  
  // Navigation Buttons
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 52,
  },
  
  previousButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
     borderWidth: 1,
     minHeight: 52,
  },
  
  nextButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
      flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
     borderWidth: 1,
     minHeight: 52,
  },
  
  finishButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    borderColor: '#388E3C',
    minHeight: 52,
  },
  
  navButtonDisabled: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
  },
  
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: 8,
  },
  
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginHorizontal: 8,
  },
  
  finishButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginHorizontal: 8,
  },
  
  navButtonTextDisabled: {
    color: COLORS.textLight,
  },
  // Add these styles to your existing stepByStepStyles object:

errorContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 40,
},

errorText: {
  fontSize: 16,
  color: COLORS.text,
  textAlign: 'center',
  marginTop: 20,
  marginBottom: 30,
},

backToRecipeButton: {
  backgroundColor: COLORS.primary,
  paddingHorizontal: 24,
  paddingVertical: 12,
  borderRadius: 12,
},

backToRecipeButtonText: {
  color: COLORS.white,
  fontSize: 16,
  fontWeight: '600',
},

stepInfoContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: COLORS.white,
  borderRadius: 12,
  padding: 16,
  marginTop: 16,
  borderWidth: 1,
  borderColor: COLORS.border,
},

stepInfoItem: {
  flexDirection: 'row',
  alignItems: 'center',
},

stepInfoText: {
  fontSize: 14,
  color: COLORS.text,
  marginLeft: 8,
},
// Add these styles to your existing stepByStepStyles object:

youtubePlayerContainer: {
  width: '100%',
  marginBottom: 20,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '#000',
  borderWidth: 1,
  borderColor: '#333',
},

videoHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  backgroundColor: COLORS.background,
  borderBottomWidth: 1,
  borderBottomColor: '#333',
},

videoIcon: {
  width: 28,
  height: 28,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
},

videoTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: 'white',
  flex: 1,
},

videoControlsHeader: {
  marginLeft: 'auto',
},

videoControlButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FF0000',
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 16,
},

videoControlText: {
  fontSize: 12,
  fontWeight: '600',
  color: COLORS.white,
  marginLeft: 4,
},

youtubeWebView: {
  borderRadius: 0,
},

videoControls: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingVertical: 12,
  paddingHorizontal: 20,
  backgroundColor: COLORS.background,
  borderTopWidth: 1,
  borderTopColor: '#333',
},

videoControl: {
  alignItems: 'center',
  padding: 8,
  minWidth: 80,
},

videoControlLabel: {
  fontSize: 12,
  color: COLORS.border,
  marginTop: 4,
  textAlign: 'center',
},
});
