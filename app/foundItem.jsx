import { useState } from "react";
import { Alert } from "react-native";

export const useFoundItems = () => {
  const [foundName, setFoundName] = useState("");
  const [foundLocation, setFoundLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addFoundItem = () => {
    if (foundName.trim() === "") {
      Alert.alert("Error", "Please enter item name");
      return;
    }

    if (selectedCategory === "") {
      Alert.alert("Error", "Please select a category");
      return;
    }

    const newFoundItem = {
      id: Date.now().toString(),
      name: foundName,
      location: foundLocation,
      category: selectedCategory,
      date: new Date().toLocaleDateString(),
      type: "found",
    };

    setFoundItems([...foundItems, newFoundItem]);
    setFoundName("");
    setFoundLocation("");
    setSelectedCategory("");
    Alert.alert("Success", "Found item added successfully!");
  };

  const deleteFoundItem = (id) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          setFoundItems(foundItems.filter((item) => item.id !== id));
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

  return {
    foundName,
    setFoundName,
    foundLocation,
    setFoundLocation,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    foundItems: filteredItems,
    addFoundItem,
    deleteFoundItem,
    getCategoryName,
    canSubmit: foundName.trim() && selectedCategory,
  };
};