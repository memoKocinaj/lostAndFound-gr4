import { useState } from "react";

import {
    Alert,
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
                    } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import NavBar from "../components/NavBar";
import CategorySelector from "../components/CategorySelector";
import ItemCard from "../components/ItemCard";

export default function FoundItemScreen() {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Report Found Item</Text>

          <TextInput
            placeholder="Item Name *"
            value={foundName}
            onChangeText={setFoundName}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <CategorySelector
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          <TextInput
            placeholder="Where did you find it?"
            value={foundLocation}
            onChangeText={setFoundLocation}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[
              styles.addButton,
              (!foundName.trim() || !selectedCategory) &&
                styles.addButtonDisabled,
            ]}
            onPress={addFoundItem}
            disabled={!foundName.trim() || !selectedCategory}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Found Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search found items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Found Items ({filteredItems.length})
          </Text>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? "No items found" : "No found items yet"}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start by reporting items you've found"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onDelete={() => deleteFoundItem(item.id)}
                type="found"
              />
            )}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        )}
      </View>
      <NavBar />
    </SafeAreaView>
  );
}

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
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E9ECEF",
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
  addButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  list: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});