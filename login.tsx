import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      router.replace("/");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        "Invalid email or password. For demo, use john@example.com / password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2070&auto=format&fit=crop" }}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to ShopWave</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

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

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={<Lock size={20} color={Colors.textLight} />}
            rightIcon={
              <TouchableOpacity onPress={toggleShowPassword}>
                {showPassword ? (
                  <EyeOff size={20} color={Colors.textLight} />
                ) : (
                  <Eye size={20} color={Colors.textLight} />
                )}
              </TouchableOpacity>
            }
            testID="password-input"
          />

          <Link href="/auth/forgot-password" asChild>
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Link>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
            size="large"
            fullWidth
            testID="login-button"
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.demoInfoContainer}>
          <Text style={styles.demoInfoTitle}>Demo Credentials</Text>
          <Text style={styles.demoInfoText}>Email: john@example.com</Text>
          <Text style={styles.demoInfoText}>Password: password</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    padding: 24,
    paddingTop: 48,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 24,
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
  },
  formContainer: {
    padding: 24,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
  },
  loginButton: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  registerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  demoInfoContainer: {
    margin: 24,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  demoInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  demoInfoText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
});