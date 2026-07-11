import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.background, 
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 500,
    backgroundColor: COLORS.primary, 
    opacity: 0.08,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -50,
    opacity: 0.05,
  },
  circle3: {
    width: 150,
    height: 150,
    top: '40%',
    left: '60%',
    opacity: 0.03,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.background, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary, 
    shadowColor: COLORS.primary, 
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 2,
  },
  logoGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primary, 
    position: 'absolute',
    opacity: 0.1,
    zIndex: 1,
  },
  logo: {
    fontSize: 50,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text, 
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(106, 27, 154, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight, 
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 16,
    transform: [{ scale: 1.2 }],
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textLight, 
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
    opacity: 0.8,
  },
});