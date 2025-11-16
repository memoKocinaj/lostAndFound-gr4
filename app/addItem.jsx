import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import CategorySelector from "../components/CategorySelector";
import ItemCard from "../components/ItemCard";
import NavBar from "../components/NavBar";
import {
  addLostItem,
  getUserLostItems,
  deleteItem,
} from "../services/firestoreService";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export default function AddItemScreen() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [lostItems, setLostItems] = useState([]);
const [loading, setLoading] = useState(false);

    const [imageUri, setImageUri] = useState(null);

  const [locationCoords, setLocationCoords] = useState(null);

  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    if (user) {
      loadLostItems();
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  const loadLostItems = async () => {
    setLoading(true);
    try {
      const items = await getUserLostItems(user.uid);
      setLostItems(items);
    } catch (error) {
      console.error("❌ ERROR loading lost items:", error);
      Alert.alert("Error", "Failed to load lost items: " + error.message);
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
      console.log("Camera error:", error);
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
      console.log("Gallery error:", error);
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

          const addressParts = [];
          if (addr.street && addr.street.trim()) addressParts.push(addr.street);
          if (addr.name && addr.name.trim()) addressParts.push(addr.name);
          if (addr.city && addr.city.trim()) addressParts.push(addr.city);
          if (addr.region && addr.region.trim()) addressParts.push(addr.region);

          addressText = addressParts.join(", ");

          if (!addressText.trim() || addressText.trim().length < 5) {
            addressText = `${current.coords.latitude.toFixed(
              5
            )}, ${current.coords.longitude.toFixed(5)}`;
          }
        } else {
          addressText = `${current.coords.latitude.toFixed(
            5
          )}, ${current.coords.longitude.toFixed(5)}`;
        }
      } catch (reverseError) {
        console.log(
          "Reverse geocode completely failed, using coordinates only"
        );

        addressText = `${current.coords.latitude.toFixed(
          5
        )}, ${current.coords.longitude.toFixed(5)}`;
      }

      setLastSeenLocation(addressText);
      setLocationCoords({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });

      Alert.alert(
        "Location Set",
        "Current location has been set successfully!"
      );
    } catch (error) {
      console.log("Location error:", error);

      if (error.message.includes("getCountryCode")) {
        Alert.alert(
          "Location Set",
          "Coordinates saved successfully! Address lookup unavailable in your area."
        );
      } else {
        Alert.alert("Error", "Failed to get location: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (itemName.trim() === "") {
      Alert.alert("Error", "Please enter item name");
      return;
    }

    if (selectedCategory === "") {
      Alert.alert("Error", "Please select a category");
      return;
    }
try {
      console.log("➕ ADDING NEW ITEM...");

      const newItem = {
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
        userId: user.uid,

        imageUri: imageUri,
        locationCoords: locationCoords,
      };

      console.log("📦 Item to save:", newItem);

      const itemId = await addLostItem(newItem, user.uid);
      console.log("✅ Item saved with ID:", itemId);

      setItemName("");
      setItemDescription("");
      setLastSeenLocation("");
      setSelectedCategory("");
      setImageUri(null);
      setLocationCoords(null);

      await loadLostItems();
      Alert.alert("Success", "Lost item reported successfully!");
    } catch (error) {
      console.error("❌ Error adding item:", error);
      Alert.alert("Error", "Failed to add item: " + error.message);
    }
  };

  const deleteItemHandler = async (id) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteItem("lostItems", id);
            await loadLostItems();
          } catch (error) {
            Alert.alert("Error", "Failed to delete item");
          }
        },
      },
    ]);
  };
  
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

          <TextInput
            placeholder="Description"
            value={itemDescription}
            onChangeText={setItemDescription}
            style={[styles.input, styles.textArea]}
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />

          <TextInput
            placeholder="Last Seen Location"
            value={lastSeenLocation}
            onChangeText={setLastSeenLocation}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[
              styles.addButton,
              (!itemName.trim() || !selectedCategory) &&
                styles.addButtonDisabled,
            ]}
            onPress={addItem}
            disabled={!itemName.trim() || !selectedCategory}
          >
            <Text style={styles.addButtonText}>Report Lost Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Lost Items ({lostItems.length})</Text>
        </View>

        {lostItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>
              No lost items reported yet
            </Text>
            <Text style={styles.emptyStateText}>
              Use the form above to report your first lost item
            </Text>
          </View>
        ) : (
          <FlatList
            data={lostItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onDelete={() => deleteItem(item.id)}
                type="lost"
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

  addButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listHeader: {
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
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});



