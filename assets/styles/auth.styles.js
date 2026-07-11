import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { height } = Dimensions.get("window");

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  imageContainer: {
    height: height * 0.3,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 320,
    height: 320,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  textInput: {
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
  },
  linkContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  linkText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  // Add to your existing auth.styles.js
optionsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  marginTop: 10,
},
rememberMeContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
checkbox: {
  width: 18,
  height: 18,
  borderWidth: 2,
  borderColor: COLORS.border,
  borderRadius: 4,
  marginRight: 8,
  justifyContent: 'center',
  alignItems: 'center',
},
checkboxChecked: {
  backgroundColor: COLORS.primary,
  borderColor: COLORS.primary,
},
rememberMeText: {
  fontSize: 14,
  color: COLORS.text,
  fontWeight: '500',
},
forgotPasswordText: {
  fontSize: 14,
  color: COLORS.primary,
  fontWeight: '600',
},
// Add to auth.styles.js
passwordRequirements: {
  marginBottom: 20,
  padding: 12,
  backgroundColor: `${COLORS.background}90`,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: COLORS.border,
},
requirementsTitle: {
  fontSize: 12,
  fontWeight: "600",
  color: COLORS.text,
  marginBottom: 8,
},
requirementItem: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 4,
},
requirementText: {
  fontSize: 12,
  color: COLORS.textLight,
  marginLeft: 6,
},
requirementMet: {
  color: COLORS.primary,
  fontWeight: "500",
},
// Add to auth.styles.js
emailText: {
  fontWeight: "600",
  color: COLORS.primary,
},
resendContainer: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20,
  flexWrap: "wrap",
},
resendText: {
  fontSize: 14,
  color: COLORS.textLight,
  textAlign: "center",
},
resendButton: {
  fontSize: 14,
  color: COLORS.primary,
  fontWeight: "600",
  textAlign: "center",
},
resendButtonDisabled: {
  color: COLORS.textLight,
  opacity: 0.6,
},
attemptsContainer: {
  alignItems: "center",
  marginBottom: 15,
  padding: 8,
  backgroundColor: `${COLORS.background}90`,
  borderRadius: 6,
},
attemptsText: {
  fontSize: 12,
  color: COLORS.textLight,
  fontWeight: "500",
},
helpContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  helpText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 16,
  },
});