import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NavBar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: "home" },
    { name: "Lost Items", href: "/addItem", icon: "search" },
    { name: "Found Items", href: "/foundItem", icon: "eye" },
    { name: "Profile", href: "/profile", icon: "person" },
    { name: "About", href: "/about", icon: "information" },
  ];

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
                color={pathname === item.href ? "#4A90E2" : "#F0F7FF"}
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

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
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
    backgroundColor: "#F0F7FF",
  },
  navText: {
    fontSize: 12,
    color: "#F0F7FF",
    marginTop: 4,
    fontWeight: "500",
    textAlign: "center",
  },
  navTextActive: {
    color: "#4A90E2",
    fontWeight: "600",
  },
});
