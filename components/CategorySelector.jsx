import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  { id: "education", name: "Education", icon: "school" },
  { id: "cars", name: "Cars", icon: "car" },
  { id: "personal", name: "Personal Things", icon: "briefcase" },
  { id: "animals", name: "Animals", icon: "paw" },
  { id: "people", name: "People", icon: "people" },
  { id: "women-clothing", name: "Women Clothing", icon: "shirt" },
  { id: "accessories", name: "Accessories", icon: "watch" },
];

export default function CategorySelector({
  selectedCategory,
  onCategorySelect,
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getSelectedCategoryName = () => {
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category ? category.name : "Select Category";
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Text style={styles.headerText}>{getSelectedCategoryName()}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.dropdown}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id &&
                    styles.categoryItemSelected,
                ]}
                onPress={() => {
                  onCategorySelect(category.id);
                  setExpanded(false);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={category.icon}
                  size={18}
                  color={selectedCategory === category.id ? "#4A90E2" : "#666"}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  headerText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  scrollView: {
    borderRadius: 12,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FA",
  },
  categoryItemSelected: {
    backgroundColor: "#F0F7FF",
  },
  categoryText: {
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 12,
  },
  categoryTextSelected: {
    color: "#4A90E2",
    fontWeight: "600",
  },
});
