import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Animated } from "react-native";
import { useRouter } from "expo-router";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Animation setup for fade-in effect
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    // Here you would typically send a reset password email to the backend
    console.log("Reset Password for:", email);
    Alert.alert("Success", "If an account with that email exists, a password reset link has been sent.");
    router.push("/login"); // Navigate back to Login after sending reset link
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Reset Password</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#A0A0A0"
      />
      <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
        <Button title="Reset Password" onPress={handleResetPassword} color="#FF9500" />
      </Animated.View>
      <View style={styles.linkContainer}>
        <Button
          title="Back to Login"
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
    borderRadius: 15, // Rounded corners for modern look [web:31][web:32]
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
    elevation: 3, // Subtle shadow for depth and lift effect [web:37][web:41]
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  linkContainer: {
    width: "100%",
  },
});

export default ForgotPasswordScreen;
