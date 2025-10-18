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
