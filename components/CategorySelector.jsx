import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
