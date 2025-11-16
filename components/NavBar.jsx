import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function NavBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const theme = useTheme();

  const navItems = user
    ? [
        { name: "Home", href: "/", icon: "home" },
        { name: "Lost It", href: "/add-Item", icon: "search" },
        { name: "Found It", href: "/found-Item", icon: "eye" },
        { name: "Matches", href: "/matches", icon: "heart" },
        { name: "Settings", href: "/settings", icon: "settings" },
      ]
    : [
        { name: "Home", href: "/", icon: "home" },
        { name: "Login", href: "/login", icon: "log-in" },
      ];

  const styles = createStyles(theme);

  return (
    <View style={styles.navContainer}>
      {navItems.map((item) => (
        <Link key={item.name} href={item.href} asChild>
          <TouchableOpacity
            style={StyleSheet.flatten([
              styles.navItem,
              pathname === item.href && styles.navItemActive,
            ])}
          >
            <View style={styles.navContent}>
              <Ionicons
                name={item.icon}
                size={20}
                color={
                  pathname === item.href ? theme.colors.primary : "#FFFFFF"
                }
              />
              <Text
                style={[
                  styles.navText,
                  pathname === item.href && styles.navTextActive,
                ]}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    navContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 0,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      justifyContent: "space-around",
      alignItems: "center",
      paddingBottom: 10,
    },
    navItem: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      borderRadius: 8,
      flex: 1,
    },
    navContent: {
      alignItems: "center",
      justifyContent: "center",
    },
    navItemActive: {
      backgroundColor: theme.isDark ? "#2C3E50" : "#F0F7FF",
    },
    navText: {
      fontSize: 12,
      color: "#FFFFFF",
      marginTop: 4,
      fontWeight: "500",
      textAlign: "center",
    },
    navTextActive: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
  });
