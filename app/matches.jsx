import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import NavBar from "../components/NavBar";
import { getPotentialMatchesOptimized } from "../services/firestoreService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function MatchesScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const { user, getUserProfile } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    loadMatches();
    loadUserPhoneNumber();
  }, []);

  const loadUserPhoneNumber = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserPhoneNumber(data.phoneNumber || "");

        if (!data.phoneNumber) {
          const timer = setTimeout(() => {
            Alert.alert(
              "Add Your Phone Number",
              "Adding your phone number helps others contact you when they find your lost items!",
              [
                { text: "Later", style: "cancel" },
                { text: "Add Now", onPress: () => router.push("/settings") },
              ]
            );
          }, 3000);

          return () => clearTimeout(timer);
        }
      }
    } catch (error) {
      console.error("Error loading user phone:", error);
    }
  };

  const loadMatches = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const potentialMatches = await getPotentialMatchesOptimized(user.uid);

      const enrichedMatches = await Promise.all(
        potentialMatches.map(async (match) => {
          const foundItemUserProfile = await getUserProfile(
            match.foundItem.userId
          );
          return {
            ...match,
            foundItemUserProfile,
          };
        })
      );

      setMatches(enrichedMatches);
    } catch (error) {
      console.error("Error loading matches:", error);
      Alert.alert("Error", "Failed to load matches");
    }
    setLoading(false);
  };

  const handleCall = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert(
        "No Phone Number",
        "This user hasn't provided a phone number"
      );
      return;
    }

    const phoneUrl = `tel:${phoneNumber}`;

    Alert.alert("Call User", `Would you like to call ${phoneNumber}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () =>
          Linking.openURL(phoneUrl).catch((err) =>
            Alert.alert("Error", "Could not make phone call")
          ),
      },
    ]);
  };

  const handleContact = (match) => {
    const phoneNumber = match.foundItemUserProfile?.phoneNumber;

    Alert.alert(
      "Contact Finder",
      `Contact the person who found "${match.foundItem.name}"\n\nPhone: ${
        phoneNumber || "Not provided"
      }`,
      [
        { text: "Cancel", style: "cancel" },
        ...(phoneNumber
          ? [
              {
                text: "Call",
                onPress: () => handleCall(phoneNumber),
              },
            ]
          : []),
        {
          text: "OK",
          style: "default",
        },
      ]
    );
  };

  const styles = createStyles(theme);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.loginMessage}>Please log in to view matches</Text>
        </View>
        <NavBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Potential Matches</Text>
        <Text style={styles.subtitle}>We found items that might be yours</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Searching for matches...</Text>
          </View>
        ) : matches.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={64}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.emptyStateTitle}>No matches yet</Text>
            <Text style={styles.emptyStateText}>
              We'll notify you when we find potential matches for your lost
              items
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadMatches}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.matchesList}>
            {matches.map((match, index) => (
              <View key={index} style={styles.matchCard}>
                <View style={styles.matchHeader}>
                  <Text style={styles.matchScore}>
                    {Math.round(match.matchScore * 100)}% Match
                  </Text>
                  <Text style={styles.matchReason}>{match.reason}</Text>
                </View>

                <View style={styles.itemsContainer}>
                  <View style={styles.itemBox}>
                    <Text style={styles.itemLabel}>Your Lost Item</Text>
                    <Text style={styles.itemName}>{match.lostItem.name}</Text>
                    <Text style={styles.itemDetail}>
                      Category: {match.lostItem.category}
                    </Text>
                    <Text style={styles.itemDetail}>
                      Lost at: {match.lostItem.lastSeenLocation}
                    </Text>
                  </View>

                  <View style={styles.matchIcon}>
                    <Ionicons
                      name="swap-horizontal"
                      size={24}
                      color={theme.colors.primary}
                    />
                  </View>

                  <View style={styles.itemBox}>
                    <Text style={styles.itemLabel}>Found Item</Text>
                    <Text style={styles.itemName}>{match.foundItem.name}</Text>
                    <Text style={styles.itemDetail}>
                      Category: {match.foundItem.category}
                    </Text>
                    <Text style={styles.itemDetail}>
                      Found at: {match.foundItem.location}
                    </Text>

                    {match.foundItemUserProfile?.phoneNumber && (
                      <View style={styles.phoneContainer}>
                        <Ionicons
                          name="call"
                          size={12}
                          color={theme.colors.primary}
                        />
                        <Text style={styles.phoneText}>
                          {match.foundItemUserProfile.phoneNumber}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleContact(match)}
                >
                  <Ionicons name="chatbubble" size={18} color="white" />
                  <Text style={styles.contactButtonText}>
                    {match.foundItemUserProfile?.phoneNumber
                      ? "Contact Finder"
                      : "View Details"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
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
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 30,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 16,
      color: theme.colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 20,
    },
    refreshButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    refreshButtonText: {
      color: "white",
      fontWeight: "600",
    },
    matchesList: {
      flex: 1,
    },
    matchCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    matchHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    matchScore: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    matchReason: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    itemsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    itemBox: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 12,
    },
    itemLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    itemName: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    itemDetail: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    phoneContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    phoneText: {
      fontSize: 12,
      color: theme.colors.primary,
      marginLeft: 4,
      fontWeight: "500",
    },
    matchIcon: {
      paddingHorizontal: 12,
    },
    contactButton: {
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    contactButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
    loginMessage: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: "center",
      marginTop: 20,
    },
  });
