import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ItemCard({ item, onDelete, type = "lost" }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
        ) : (
          <View style={styles.noPhotoContainer}>
            <Image
              source={require("../assets/images/no-image.jpg")}
              style={styles.noPhotoImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.itemName}>{item.name}</Text>

        {item.category && (
          <Text style={styles.category}>Category: {item.category}</Text>
        )}

        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}

        <View style={styles.details}>
          <Text style={styles.location}>
            {type === "lost"
              ? `Last seen: ${item.lastSeenLocation || "Not specified"}`
              : `Found at: ${item.location || "Not specified"}`}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  imageContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F8F9FA",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  noPhotoContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  noPhotoImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#4A90E2",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  location: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    padding: 8,
  },
});
