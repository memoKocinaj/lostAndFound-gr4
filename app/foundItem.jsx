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
