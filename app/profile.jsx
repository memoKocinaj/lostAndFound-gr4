import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

          <TextInput
            placeholder="Email Address *"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              styles.addButton,
              (!name.trim() || !email.trim()) && styles.addButtonDisabled,
            ]}
            onPress={saveProfile}
            disabled={!name.trim() || !email.trim()}
          >
            <Text style={styles.addButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Saved Profiles ({profiles.length})
          </Text>
        </View>

        {profiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No profiles saved yet</Text>
            <Text style={styles.emptyStateText}>
              Start by adding a user profile above
            </Text>
          </View>
        ) : (
          <FlatList
            data={profiles}
            keyExtractor={(profile) => profile.id}
            renderItem={({ item }) => (
              <View style={styles.profileCard}>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{item.name}</Text>
                  <Text style={styles.profileEmail}>{item.email}</Text>
                  <Text style={styles.profileDate}>Added: {item.date}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteProfile(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
  profileCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#4A90E2",
    marginBottom: 4,
  },
  profileDate: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#FFF5F5",
  },
  deleteButtonText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "500",
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
