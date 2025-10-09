import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isAuthenticated } = useAuth();

  // Redirect based on authentication status
  // if (isAuthenticated) {
    return <Redirect href="/(tabs)/order-form" />;
  // } else {
  //   return <Redirect href="/(auth)/login" />;
  // }
}
