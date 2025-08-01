import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { Link, useRouter } from "expo-router";
import { ArrowLeft, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
        <ArrowLeft size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password
          </Text>
        </View>

        {!isSubmitted ? (
          <View style={styles.formContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={Colors.textLight} />}
              testID="email-input"
            />

            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitButton}
              size="large"
              fullWidth
              testID="submit-button"
            />

            <Link href="/auth/login" asChild>
              <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.loginText}>Back to Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successCard}>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We've sent password reset instructions to:
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.successNote}>
                If you don't see the email, check your spam folder
              </Text>
            </View>

            <Button
              title="Back to Login"
              onPress={handleBackToLogin}
              style={styles.backToLoginButton}
              size="large"
              fullWidth
              testID="back-to-login-button"
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  loginContainer: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  successContainer: {
    width: "100%",
    alignItems: "center",
  },
  successCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.primary,
    marginBottom: 16,
  },
  successNote: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: "center",
  },
  backToLoginButton: {
    width: "100%",
  },
});