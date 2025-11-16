import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="add-Item" options={{ title: "Add Item" }} />
          <Stack.Screen name="found-Item" options={{ title: "Found Items" }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
          <Stack.Screen name="matches" options={{ title: "Matches" }} />
          <Stack.Screen name="about" options={{ title: "About" }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
