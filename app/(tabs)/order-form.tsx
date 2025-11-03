import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { getApiUrl, API_CONFIG } from "../../config/api";
import Animated, { FadeIn } from "react-native-reanimated"; // For better animations; install if needed, or use built-in Animated

const OrderFormScreen = () => {
  const [customerName, setCustomerName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  console.log("user", user);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  const handleSubmitOrder = async () => {
    if (!customerName || !address || !phoneNumber || !price) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Customer Name, Address, Phone Number, Price)."
      );
      return;
    }

    if (images.length === 0) {
      Alert.alert("Error", "Please add at least one image.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", customerName);
      formData.append("address", address);
      formData.append("details", details);
      formData.append("phoneNumber", phoneNumber);
      formData.append("price", parseFloat(price).toString());

      images.forEach((imageUri, index) => {
        formData.append("images", {
          uri: imageUri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        } as any);
      });

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ORDERS), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message || "Order submitted successfully!");
        setCustomerName("");
        setAddress("");
        setDetails("");
        setPhoneNumber("");
        setPrice("");
        setImages([]);
      } else {
        Alert.alert("Error", data.message || "Failed to submit order.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      Alert.alert("Error", "An error occurred during order submission.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false, // Disables the built-in editor for full image selection without cropping
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Animated.ScrollView
      contentContainerStyle={styles.container}
      entering={FadeIn.duration(800).springify()} // Smooth fade-in animation
    >
      <View style={styles.header}>
        <Text style={styles.title}>New Order</Text>
        <Text style={styles.subtitle}>
          Fill in the details to place your order
        </Text>
      </View>

      {/* Customer Name Field */}
      <Animated.View
        style={styles.inputCard}
        entering={FadeIn.delay(100).duration(600)}
      >
        <Text style={styles.label}>Customer Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter customer name"
          value={customerName}
          onChangeText={setCustomerName}
          placeholderTextColor="#A0A0A0"
        />
      </Animated.View>

      {/* Address Field */}
      <Animated.View
        style={styles.inputCard}
        entering={FadeIn.delay(200).duration(600)}
      >
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter full address"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholderTextColor="#A0A0A0"
        />
      </Animated.View>

      {/* Details Field */}
      <Animated.View
        style={styles.inputCard}
        entering={FadeIn.delay(300).duration(600)}
      >
        <Text style={styles.label}>Order Details</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter order details (e.g., specific requirements)"
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholderTextColor="#A0A0A0"
        />
      </Animated.View>

      {/* Phone Number Field */}
      <Animated.View
        style={styles.inputCard}
        entering={FadeIn.delay(400).duration(600)}
      >
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#A0A0A0"
        />
      </Animated.View>

      {/* Price Field */}
      <Animated.View
        style={styles.inputCard}
        entering={FadeIn.delay(500).duration(600)}
      >
        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholderTextColor="#A0A0A0"
        />
      </Animated.View>

      {/* Images Section */}
      <Animated.View
        style={styles.inputCard}
        entering={FadeIn.delay(600).duration(600)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Images *</Text>
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Text style={styles.addButtonText}>Add Image</Text>
          </TouchableOpacity>
        </View>
        {images.length > 0 && (
          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.helperText}>At least one image is required</Text>
      </Animated.View>

      {/* Submit Button */}
      <Animated.View
        style={styles.submitContainer}
        entering={FadeIn.delay(700).duration(600)}
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#FFFFFF"
            style={styles.loadingIndicator}
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitOrder}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>Submit Order</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F8F9FF", // Light blue-tinted background for freshness
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2E3A59", // Deep indigo for sophistication
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  inputCard: {
    // backgroundColor: "#FFFFFF",
    // borderRadius: 20, // Rounded for modern card effect
    padding: 20,
    marginBottom: 0,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 5, // Subtle shadow for lifted, beautiful depth
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3A59",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#DDE2E6",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FAFBFC",
    fontSize: 16,
    color: "#1F2937",
  },
  multilineInput: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#EF4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  helperText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 5,
    fontStyle: "italic",
    textAlign: "center",
  },
  submitContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#4A90E2", // Primary blue for action
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    minWidth: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  loadingIndicator: {
    padding: 20,
  },
});

export default OrderFormScreen;
