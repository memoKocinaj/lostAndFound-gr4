import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import NavBar from "../components/NavBar";
import CategorySelector from "../components/CategorySelector";
import ItemCard from "../components/ItemCard";
import {
  addFoundItem,
  deleteItem,
  getUserFoundItems,
} from "../services/firestoreService";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export default function FoundItemScreen() {
  const [foundName, setFoundName] = useState("");
  const [foundLocation, setFoundLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [imageUri, setImageUri] = useState(null);
  const [locationCoords, setLocationCoords] = useState(null);

  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    loadFoundItems();
  }, [user]);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  const loadFoundItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const items = await getUserFoundItems(user.uid);
      setFoundItems(items);
    } catch (error) {
      console.error("Error loading found items:", error);
      Alert.alert("Error", "Failed to load found items");
    }
    setLoading(false);
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open gallery");
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required");
        return;
      }

      setLoading(true);

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let addressText = "";

      try {
        const reverse = await Location.reverseGeocodeAsync(current.coords);

        if (reverse && reverse.length > 0) {
          const addr = reverse[0];
          const parts = [];

          if (addr.street) parts.push(addr.street);
          if (addr.name) parts.push(addr.name);
          if (addr.city) parts.push(addr.city);
          if (addr.region) parts.push(addr.region);

          addressText = parts.join(", ");

          if (addressText.length < 5) {
            addressText = `${current.coords.latitude.toFixed(
              5
            )}, ${current.coords.longitude.toFixed(5)}`;
          }
        }
      } catch {
        addressText = `${current.coords.latitude.toFixed(
          5
        )}, ${current.coords.longitude.toFixed(5)}`;
      }

      setFoundLocation(addressText);
      setLocationCoords({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });

      Alert.alert("Location Set", "Current location has been set successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  const addFoundItemHandler = async () => {
    if (foundName.trim() === "") {
      return Alert.alert("Error", "Please enter item name");
    }

    if (!selectedCategory) {
      return Alert.alert("Error", "Please select a category");
    }

    if (!user) {
      return Alert.alert("Error", "Please log in");
    }

    try {
      const newItem = {
        name: foundName.trim(),
        location: foundLocation.trim(),
        category: selectedCategory,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        type: "found",
        userId: user.uid,
        imageUri: imageUri || null,
        locationCoords: locationCoords || null,
      };

      await addFoundItem(newItem, user.uid);

      setFoundName("");
      setFoundLocation("");
      setSelectedCategory("");
      setImageUri(null);
      setLocationCoords(null);

      await loadFoundItems();
      Alert.alert("Success", "Found item added!");
    } catch (error) {
      Alert.alert("Error", "Failed to add item");
    }
  };

  const deleteFoundItem = async (id) => {
    Alert.alert("Delete Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteItem("foundItems", id);
            await loadFoundItems();
          } catch {
            Alert.alert("Error", "Failed to delete item");
          }
        },
      },
    ]);
  };

  const getCategoryName = (categoryId) => {
    const categories = {
      education: "Education",
      cars: "Cars",
      personal: "Personal Things",
      animals: "Animals",
      people: "People",
      "women-clothing": "Women Clothing",
      accessories: "Accessories",
    };
    return categories[categoryId] || "Unknown";
  };

  const filteredItems = foundItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location &&
        item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      getCategoryName(item.category)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.loginMessage}>
            Please log in to report found items
          </Text>
        </View>
        <NavBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },
    formContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    listSection: {
      minHeight: 200,
    },
    photoButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      borderRadius: 10,
      gap: 6,
    },
   photoButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
    imagePreviewContainer: {
      alignItems: "center",
      marginBottom: 12,
      marginTop: 4,
    },
    imagePreview: {
      width: "100%",
      height: 180,
      borderRadius: 12,
      marginBottom: 8,
    },
    removeImageButton: {
      padding: 8,
    },
    removeImageText: {
      color: theme.colors.danger,
      fontSize: 13,
      fontWeight: "500",
    },
    mapButton: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      padding: 8,
    },
    mapButtonText: {
      marginLeft: 6,
      color: theme.colors.primary,
      fontWeight: "600",
    },
  });

  });

