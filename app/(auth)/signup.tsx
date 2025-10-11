import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { API_CONFIG, getApiUrl } from "../../config/api";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default to user
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // In a real app, you would send this data to your backend for user registration.
    // Example:
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS + "/register"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message || "Account created successfully!");
        router.push("/login");
      } else {
        Alert.alert("Error", data.message || "Failed to create account.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "An error occurred during signup.");
    }
    console.log("Signup Data:", { name, email, password, role });
  };

  return (
    <Animated.View style={[styles.container]}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Create Account</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#A0A0A0"
      />
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
      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Select Role</Text>
        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "user" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("user")}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "user" && styles.roleButtonTextActive,
              ]}
            >
              User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "admin" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("admin")}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "admin" && styles.roleButtonTextActive,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View style={[styles.buttonContainer]}>
        <Button title="Sign Up" onPress={handleSignup} color="#50E3C2" />
      </Animated.View>
      <View style={styles.linkContainer}>
        <Button
          title="Already have an account? Login"
          onPress={() => router.push("/login")}
          color="#4A90E2"
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
    borderRadius: 15, // Rounded corners for modern look [web:3][web:21]
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
    elevation: 3, // Subtle shadow for depth and lift effect [web:2][web:7]
  },
  roleContainer: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 12,
    textAlign: "center",
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  roleButtonActive: {
    backgroundColor: "#50E3C2",
    borderColor: "#50E3C2",
  },
  roleButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  roleButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  linkContainer: {
    width: "100%",
  },
});

export default SignupScreen;
