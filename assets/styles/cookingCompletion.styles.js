import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";

const { width, height } = Dimensions.get('window');
export const cookingCompletionStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  
  congratulationsText: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  subtitleText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    opacity: 0.8,
  },
  
  decorativeCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  
  circle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: COLORS.primary + '10',
  },
  
  circle1: {
    width: 200,
    height: 200,
    top: '10%',
    left: '-10%',
  },
  
  circle2: {
    width: 150,
    height: 150,
    bottom: '20%',
    right: '-5%',
  },
  
  circle3: {
    width: 100,
    height: 100,
    top: '40%',
    right: '15%',
  },
  
  buttonsContainer: {
    width: '100%',
    marginTop: 40,
  },
  
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 12,
  },
  
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 12,
  },
  
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  
  messageText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
  },
});