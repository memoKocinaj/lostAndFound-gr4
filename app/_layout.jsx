// _layout.jsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          // Add gesture-enabled transitions
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="addItem" />
        <Stack.Screen name="foundItem" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="about" />
      </Stack>
    </>
  );
}
