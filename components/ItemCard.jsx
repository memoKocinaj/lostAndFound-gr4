import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ItemCard({ item, onDelete, type = "lost" }) {
  return (
    <View style={styles.card}>
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
            {type === "lost" ? `Last seen: ${item.lastSeenLocation}` : `Found at: ${item.location}`}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={onDelete}
      >
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
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: '#E9ECEF',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 12,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    padding: 8,
  },
});