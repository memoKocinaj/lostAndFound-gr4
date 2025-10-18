import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import NavBar from "../components/NavBar";
import CategorySelector from "../components/CategorySelector";
import ItemCard from "../components/ItemCard";

export default function AddItemScreen() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [lostItems, setLostItems] = useState([]);

  const addItem = () => {
    if (itemName.trim() === "") {
      Alert.alert("Error", "Please enter item name");
      return;
    }

    if (selectedCategory === "") {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (itemName.trim().length < 2) {
      Alert.alert("Error", "Item name should be at least 2 characters long");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      description: itemDescription.trim(),
      lastSeenLocation: lastSeenLocation.trim(),
      category: selectedCategory,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      type: "lost",
    };

    setLostItems([newItem, ...lostItems]);
    setItemName("");
    setItemDescription("");
    setLastSeenLocation("");
    setSelectedCategory("");

    Alert.alert("Success", "Lost item reported successfully!");
  };

  const deleteItem = (id) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setLostItems(lostItems.filter((item) => item.id !== id));
        },
      },
    ]);
  };
