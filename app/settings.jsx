import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  getUserLostItemsCount,
  getUserFoundItemsCount,
  getPotentialMatchesCount,
} from "../services/firestoreService";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, logout, getUserProfile } = useAuth();
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    matches: 0,
    loading: true,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    phoneNumber: "",
  });
  const [saving, setSaving] = useState(false);

  const [passwordUpgradeModal, setPasswordUpgradeModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [hasWeakPassword, setHasWeakPassword] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadUserProfile();
      checkPasswordStrength();
    }
  }, [user]);

  const checkPasswordStrength = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        const hasStrongPassword =
          userData.passwordMeetsRequirements || userData.passwordUpgraded;
        setHasWeakPassword(!hasStrongPassword);
      } else {
        setHasWeakPassword(true);
      }
    } catch (error) {
      console.error("Error checking password strength:", error);

      setHasWeakPassword(true);
    }
  };

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileData({
          email: data.email || user.email || "",
          phoneNumber: data.phoneNumber || "",
        });

        const hasStrongPassword =
          data.passwordMeetsRequirements || data.passwordUpgraded;
        setHasWeakPassword(!hasStrongPassword);
      } else {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          phoneNumber: "",
          createdAt: new Date(),
          passwordUpgraded: false,
          passwordMeetsRequirements: false,
        });
        setProfileData({
          email: user.email || "",
          phoneNumber: "",
        });
        setHasWeakPassword(true);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setProfileData({
        email: user?.email || "",
        phoneNumber: "",
      });
      setHasWeakPassword(true);
    }
  };

  const loadUserStats = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true }));

      const [lostCount, foundCount, matchesCount] = await Promise.all([
        getUserLostItemsCount(user.uid),
        getUserFoundItemsCount(user.uid),
        getPotentialMatchesCount(user.uid),
      ]);

      setStats({
        lostItems: lostCount,
        foundItems: foundCount,
        matches: matchesCount,
        loading: false,
      });
    } catch (error) {
      console.error("Error loading user stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const saveProfile = async () => {
    if (!profileData.email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        email: profileData.email.trim(),
        phoneNumber: profileData.phoneNumber.trim(),
        updatedAt: new Date(),
      });

      Alert.alert("Success", "Profile updated successfully!");
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
    setSaving(false);
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    return "";
  };

  const upgradePassword = async () => {
    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) {
      setPasswordErrors((prev) => ({ ...prev, new: newPasswordError }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirm: "Passwords do not match",
      }));
      return;
    }

    if (!currentPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        current: "Current password is required",
      }));
      return;
    }

    setUpgradeLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      await updateDoc(doc(db, "users", user.uid), {
        passwordUpgraded: true,
        passwordMeetsRequirements: true,
        passwordUpgradedAt: new Date(),
      });

      Alert.alert("Success", "Password upgraded successfully! 🎉");
      setPasswordUpgradeModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({ current: "", new: "", confirm: "" });
      setHasWeakPassword(false);
    } catch (error) {
      console.error("Password upgrade error:", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Current password is incorrect");
      } else {
        Alert.alert("Error", "Failed to upgrade password: " + error.message);
      }
    }
    setUpgradeLoading(false);
  };

  const resetPasswordUpgrade = () => {
    setPasswordUpgradeModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({ current: "", new: "", confirm: "" });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Profile</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditModalVisible(true)}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userEmail}>{profileData.email}</Text>
                <Text style={styles.userId}>
                  User ID: {user?.uid.substring(0, 8)}...
                </Text>
                {profileData.phoneNumber ? (
                  <View style={styles.phoneContainer}>
                    <Ionicons
                      name="call"
                      size={12}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.phoneText}>
                      {profileData.phoneNumber}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.noPhoneText}>
                    <Ionicons
                      name="warning"
                      size={12}
                      color={theme.colors.warning}
                    />
                    Add phone number for better matches
                  </Text>
                )}

                {hasWeakPassword && (
                  <TouchableOpacity
                    style={styles.passwordWarning}
                    onPress={() => setPasswordUpgradeModal(true)}
                  >
                    <Ionicons
                      name="shield-outline"
                      size={12}
                      color={theme.colors.warning}
                    />
                    <Text style={styles.passwordWarningText}>
                      Consider upgrading your password for better security
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {stats.loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading stats...</Text>
              </View>
            ) : (
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.lostItems}</Text>
                  <Text style={styles.statLabel}>Lost Items</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.foundItems}</Text>
                  <Text style={styles.statLabel}>Found Items</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.matches}</Text>
                  <Text style={styles.statLabel}>Potential Matches</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>

            <TouchableOpacity
              style={styles.securityButton}
              onPress={() => setPasswordUpgradeModal(true)}
            >
              <Ionicons
                name={hasWeakPassword ? "shield-outline" : "shield-checkmark"}
                size={20}
                color={
                  hasWeakPassword ? theme.colors.warning : theme.colors.success
                }
              />
              <View style={styles.securityTextContainer}>
                <Text style={styles.securityTitle}>
                  {hasWeakPassword ? "Upgrade Password" : "Password Security"}
                </Text>
                <Text style={styles.securityDescription}>
                  {hasWeakPassword
                    ? "Improve your account security with a stronger password"
                    : "Your password meets security standards ✓"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name={theme.isDark ? "moon" : "sunny"}
                  size={20}
                  color={theme.colors.text}
                />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={theme.isDark}
                onValueChange={theme.toggleTheme}
                trackColor={{ false: "#767577", true: theme.colors.primary }}
                thumbColor={theme.isDark ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadUserStats}
          >
            <Ionicons name="refresh" size={20} color={theme.colors.primary} />
            <Text style={styles.refreshButtonText}>Refresh Stats</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity
              style={styles.accountButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color="#FF6B6B" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About App</Text>

            <TouchableOpacity
              style={styles.aboutBox}
              onPress={() => router.push("/about")}
            >
              <View style={styles.aboutContent}>
                <Ionicons
                  name="information-circle"
                  size={24}
                  color={theme.colors.primary}
                />
                <View style={styles.aboutTextContainer}>
                  <Text style={styles.aboutTitle}>About Us</Text>
                  <Text style={styles.aboutDescription}>
                    Learn more about Find Lost Things and our team
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.12.1</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBodyScroll}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.textInput}
                value={profileData.email}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, email: text }))
                }
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={profileData.phoneNumber}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, phoneNumber: text }))
                }
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />

              <Text style={styles.helperText}>
                Adding your phone number helps others contact you when they find
                your lost items.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!profileData.email.trim() || saving) &&
                    styles.saveButtonDisabled,
                ]}
                onPress={saveProfile}
                disabled={!profileData.email.trim() || saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={passwordUpgradeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={resetPasswordUpgrade}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upgrade Password</Text>
              <TouchableOpacity
                onPress={resetPasswordUpgrade}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.upgradeDescription}>
                For better security, please upgrade to a stronger password:
              </Text>

              <Text style={styles.inputLabel}>Current Password *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  passwordErrors.current && styles.inputError,
                ]}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setPasswordErrors((prev) => ({ ...prev, current: "" }));
                }}
                placeholder="Enter your current password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry
              />
              {passwordErrors.current && (
                <Text style={styles.errorText}>{passwordErrors.current}</Text>
              )}

              <Text style={styles.inputLabel}>New Password *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  passwordErrors.new && styles.inputError,
                ]}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setPasswordErrors((prev) => ({ ...prev, new: "" }));
                }}
                placeholder="Enter new password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry
              />
              {passwordErrors.new ? (
                <Text style={styles.errorText}>{passwordErrors.new}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Must be 8+ characters with uppercase, lowercase, and number
                </Text>
              )}

              <Text style={styles.inputLabel}>Confirm New Password *</Text>
              <TextInput
                style={[
                  styles.textInput,
                  passwordErrors.confirm && styles.inputError,
                ]}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setPasswordErrors((prev) => ({ ...prev, confirm: "" }));
                }}
                placeholder="Confirm new password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry
              />
              {passwordErrors.confirm && (
                <Text style={styles.errorText}>{passwordErrors.confirm}</Text>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetPasswordUpgrade}
                disabled={upgradeLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  upgradeLoading && styles.saveButtonDisabled,
                ]}
                onPress={upgradePassword}
                disabled={upgradeLoading}
              >
                {upgradeLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Upgrade Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 30,
      textAlign: "center",
    },
    section: {
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
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
    },
    editButtonText: {
      fontSize: 14,
      color: theme.colors.primary,
      marginLeft: 4,
      fontWeight: "500",
    },
    profileInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    userDetails: {
      flex: 1,
    },
    userEmail: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    userId: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    phoneContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    phoneText: {
      fontSize: 14,
      color: theme.colors.primary,
      marginLeft: 4,
      fontWeight: "500",
    },
    noPhoneText: {
      fontSize: 12,
      color: theme.colors.warning,
      marginTop: 4,
    },

    passwordWarning: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      padding: 8,
      backgroundColor: `${theme.colors.warning}15`,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.warning,
    },
    passwordWarningText: {
      fontSize: 12,
      color: theme.colors.warning,
      marginLeft: 6,
      fontWeight: "500",
    },
    stats: {
      flexDirection: "row",
      justifyContent: "space-around",
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 16,
    },
    statItem: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    loadingContainer: {
      alignItems: "center",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 16,
    },
    loadingText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 8,
    },

    securityButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
    },
    securityTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    securityTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 2,
    },
    securityDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    settingInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 12,
    },
    refreshButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    refreshButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginLeft: 8,
      fontWeight: "600",
    },
    accountButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    logoutText: {
      fontSize: 16,
      color: "#FF6B6B",
      marginLeft: 12,
      fontWeight: "500",
    },
    infoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.text,
    },
    infoValue: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 16,
      width: "100%",
      maxHeight: "90%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    modalBody: {
      padding: 20,
    },
    upgradeDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      textAlign: "center",
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      fontSize: 16,
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
    },

    inputError: {
      borderColor: theme.colors.danger,
      backgroundColor: `${theme.colors.danger}15`,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.danger,
      marginTop: -8,
      marginBottom: 12,
      marginLeft: 4,
    },
    helperText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: -8,
      marginBottom: 12,
      marginLeft: 4,
      fontStyle: "italic",
    },
    modalFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "600",
    },
    saveButton: {
      flex: 1,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
    saveButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    saveButtonText: {
      fontSize: 16,
      color: "white",
      fontWeight: "600",
    },
    aboutBox: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    aboutContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    aboutTextContainer: {
      flex: 1,
      marginLeft: 12,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    aboutTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
      textAlign: "left",
    },
    aboutDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "left",
    },
    modalBodyScroll: {
      maxHeight: 400,
    },
    modalBodyContent: {
      padding: 20,
    },
  });
