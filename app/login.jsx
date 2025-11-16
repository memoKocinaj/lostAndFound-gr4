import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    phoneNumber: false,
  });
  const [focused, setFocused] = useState({
    email: false,
    password: false,
    phoneNumber: false,
  });

  const { signIn, signUp } = useAuth();
  const theme = useTheme();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password, isLoginMode = true) => {
    if (!password) return "Password is required";

    if (!isLoginMode) {
      if (password.length < 8) return "Password must be at least 8 characters";
      if (!/(?=.*[a-z])/.test(password))
        return "Password must contain at least one lowercase letter";
      if (!/(?=.*[A-Z])/.test(password))
        return "Password must contain at least one uppercase letter";
      if (!/(?=.*\d)/.test(password))
        return "Password must contain at least one number";
    }

    return "";
  };

  const validatePhone = (phone) => {
    if (!isLogin && !phone) return "Phone number is required";
    if (
      !isLogin &&
      phone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ""))
    ) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (touched.password) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(text, isLogin),
      }));
    }
  };

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    if (touched.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: validatePhone(text) }));
    }
  };

  const handleFocus = (field) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocused((prev) => ({ ...prev, [field]: false }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    switch (field) {
      case "email":
        setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(password, isLogin),
        }));
        break;
      case "phoneNumber":
        setErrors((prev) => ({
          ...prev,
          phoneNumber: validatePhone(phoneNumber),
        }));
        break;
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password, isLogin),
      phoneNumber: validatePhone(phoneNumber),
    };

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
      phoneNumber: true,
    });

    return !newErrors.email && !newErrors.password && !newErrors.phoneNumber;
  };

  const handleAuth = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        router.replace("/");
      } else {
        await signUp(email, password, phoneNumber);
        router.replace("/");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Authentication failed. Please check your credentials and try again."
      );
    }
    setLoading(false);
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setPhoneNumber("");
    setErrors({ email: "", password: "", phoneNumber: "" });
    setTouched({ email: false, password: false, phoneNumber: false });
    setFocused({ email: false, password: false, phoneNumber: false });
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email *"
              value={email}
              onChangeText={handleEmailChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              style={[
                styles.input,

                isLogin && touched.email && errors.email && styles.inputError,

                !isLogin && touched.email && errors.email && styles.inputError,
                !isLogin &&
                  touched.email &&
                  !errors.email &&
                  styles.inputSuccess,
              ]}
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {isLogin && touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            {!isLogin && touched.email && errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : !isLogin && touched.email && !errors.email ? (
              <Text style={styles.successText}>✓ Valid email format</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password *"
              value={password}
              onChangeText={handlePasswordChange}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              style={[
                styles.input,

                isLogin &&
                  touched.password &&
                  errors.password &&
                  styles.inputError,

                !isLogin &&
                  touched.password &&
                  errors.password &&
                  styles.inputError,
                !isLogin &&
                  touched.password &&
                  !errors.password &&
                  styles.inputSuccess,
              ]}
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry
            />
            {isLogin && touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            {!isLogin && touched.password && errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : !isLogin && touched.password && !errors.password ? (
              <Text style={styles.successText}>✓ Strong password</Text>
            ) : (
              !isLogin &&
              focused.password && (
                <Text style={styles.helperText}>
                  Must be 8+ characters with uppercase, lowercase, and number
                </Text>
              )
            )}
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Phone Number *"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                onFocus={() => handleFocus("phoneNumber")}
                onBlur={() => handleBlur("phoneNumber")}
                style={[
                  styles.input,
                  touched.phoneNumber &&
                    errors.phoneNumber &&
                    styles.inputError,
                  touched.phoneNumber &&
                    !errors.phoneNumber &&
                    styles.inputSuccess,
                ]}
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
              {touched.phoneNumber && errors.phoneNumber ? (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              ) : touched.phoneNumber && !errors.phoneNumber ? (
                <Text style={styles.successText}>✓ Valid phone number</Text>
              ) : (
                focused.phoneNumber && (
                  <Text style={styles.helperText}>
                    Used for contact when your items are found
                  </Text>
                )
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.authButton,
              (Object.values(errors).some((error) => error) ||
                !email ||
                !password ||
                (!isLogin && !phoneNumber)) &&
                styles.authButtonDisabled,
            ]}
            onPress={handleAuth}
            disabled={
              loading ||
              Object.values(errors).some((error) => error) ||
              !email ||
              !password ||
              (!isLogin && !phoneNumber)
            }
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.authButtonText}>
                {isLogin ? "Sign In" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSwitchMode}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>

          <Link href="/" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 40,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
    },
    inputError: {
      borderColor: theme.colors.danger,
      backgroundColor: `${theme.colors.danger}15`,
    },
    inputSuccess: {
      borderColor: theme.colors.success,
      backgroundColor: `${theme.colors.success}15`,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.danger,
      marginTop: 4,
      marginLeft: 4,
    },
    successText: {
      fontSize: 12,
      color: theme.colors.success,
      marginTop: 4,
      marginLeft: 4,
    },
    helperText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
      marginLeft: 4,
      fontStyle: "italic",
    },
    authButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    authButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
      opacity: 0.6,
    },
    authButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    switchButton: {
      alignItems: "center",
      padding: 16,
    },
    switchText: {
      color: theme.colors.primary,
      fontSize: 14,
    },
    backButton: {
      alignItems: "center",
      padding: 16,
      marginTop: 20,
    },
    backButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
  });
