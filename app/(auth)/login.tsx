import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { API_CONFIG, getApiUrl } from "../../config/api";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    // In a real app, you would send this data to your backend for authentication.
    // Example:
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS + "/login"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message || "Logged in successfully!");
        login({ ...data.user, token: data.token });
        router.push("/order-form");
      } else {
        Alert.alert("Error", data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login.");
    }
    console.log("Login Data:", { email, password });
  };

  return (
    <Animated.View style={[styles.container]}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Welcome Back</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#A0A0A0"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#A0A0A0"
      />
      <Animated.View style={[styles.buttonContainer]}>
        <Button title="Login" onPress={handleLogin} color="#4A90E2" />
      </Animated.View>
      <View style={styles.linkContainer}>
        <Button
          title="Forgot Password?"
          onPress={() => router.push("/forgot-password")}
          color="#9013FE"
        />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => router.push("/signup")}
          color="#50E3C2"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F9FF", // Light blue-tinted background for a fresh feel [web:6][web:16]
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2E3A59", // Deep indigo for sophistication [web:6]
    textAlign: "center",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    height: 55,
    borderColor: "#DDE2E6",
    borderWidth: 1,
    borderRadius: 15, // Rounded corners for modern look [web:1][web:4]
    paddingHorizontal: 18,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Subtle shadow for depth and lift effect [web:1][web:7]
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  linkContainer: {
    width: "100%",
  },
});

export default LoginScreen;
