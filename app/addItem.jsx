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
 return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Report Lost Item</Text>

          <TextInput
            placeholder="Item Name *"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <CategorySelector
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />




  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#F8F9FA",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  addButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

},
  addButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
