import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { Text, View } from "react-native";

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Optionally, render a loading screen while checking authentication status
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    ); // or a loading spinner component
  }
  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/order-form" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
