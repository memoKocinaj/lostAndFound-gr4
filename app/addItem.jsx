import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
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

  const addItem = async () => {
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

  const styles = createStyles(theme);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.loginMessage}>
            Please log in to report lost items
          </Text>
        </View>
        <NavBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Report Lost Item</Text>

            <TextInput
              placeholder="Item Name *"
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
              placeholderTextColor={theme.colors.textSecondary}
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
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.sectionLabel}>Photo (optional)</Text>
            <View style={styles.photoRow}>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera" size={18} color="white" />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoButton}
                onPress={handlePickImage}
              >
                <Ionicons name="image" size={18} color="white" />
                <Text style={styles.photoButtonText}>From Gallery</Text>
              </TouchableOpacity>
            </View>

            {imageUri && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImageUri(null)}
                >
                  <Text style={styles.removeImageText}>Remove image</Text>
                </TouchableOpacity>
              </View>
            )}

            <TextInput
              placeholder="Last Seen Location"
              value={lastSeenLocation}
              onChangeText={setLastSeenLocation}
              style={styles.input}
              placeholderTextColor={theme.colors.textSecondary}
            />

            <TouchableOpacity
              style={styles.mapButton}
              onPress={getCurrentLocation}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.mapButtonText}>Get Current Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.addButton,
                (!itemName.trim() || !selectedCategory) &&
                  styles.addButtonDisabled,
              ]}
              onPress={addItem}
              disabled={!itemName.trim() || !selectedCategory}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={styles.addButtonText}>Report Lost Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                Lost Items ({lostItems.length})
              </Text>
            </View>

            {loading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : lostItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="search-outline"
                  size={64}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.emptyStateTitle}>
                  No lost items reported yet
                </Text>
                <Text style={styles.emptyStateText}>
                  Use the form above to report your first lost item
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {lostItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onDelete={() => deleteItemHandler(item.id)}
                    type="lost"
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      <NavBar />
    </SafeAreaView>
  );
}

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
    listContainer: {},
    loginMessage: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: "center",
      marginTop: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      fontSize: 16,
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
    },
    textArea: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    addButton: {
      flexDirection: "row",
      backgroundColor: theme.colors.danger,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      gap: 8,
    },
    addButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
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
      color: theme.colors.text,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 6,
      marginTop: 4,
    },
    photoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
      gap: 8,
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


  

