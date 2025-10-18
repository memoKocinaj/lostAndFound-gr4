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
import NavBar from "../components/NavBar";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profiles, setProfiles] = useState([]);

  const saveProfile = () => {
    if (name.trim() === "" || email.trim() === "") {
      Alert.alert("Error", "Please enter both name and email");
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      name,
      email,
      date: new Date().toLocaleDateString(),
    };

    setProfiles([...profiles, newProfile]);
    setName("");
    setEmail("");
    Alert.alert("Success", "Profile saved successfully!");
  };

  const deleteProfile = (id) => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete this profile?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setProfiles(profiles.filter((profile) => profile.id !== id));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Add User Profile</Text>

          <TextInput
            placeholder="Full Name *"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#999"
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
  addButton: {
    backgroundColor: "#45B7D1",
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
