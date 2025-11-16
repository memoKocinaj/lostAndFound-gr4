import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { getCurrentWeather } from "../services/weatherService";

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const theme = useTheme();
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const styles = createStyles(theme);

  useEffect(() => {
    if (user) {
      loadWeather();
    }
  }, [user]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        return true;
      } else if (status === "denied") {
        Alert.alert(
          "Location Permission Required",
          "Weather feature needs location access to show local weather.",
          [{ text: "OK", style: "default" }]
        );
        return false;
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    }
  };

  const loadWeather = async () => {
    setWeatherLoading(true);
    setLocationError(null);

    try {
      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        const granted = await requestLocationPermission();
        if (!granted) {
          setLocationError("Location permission required for local weather");
          await loadFallbackWeather();
          return;
        }
        ({ status } = await Location.getForegroundPermissionsAsync());
      }

      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
          timeout: 10000,
        });

        const { latitude, longitude } = currentLocation.coords;
        const weatherData = await getCurrentWeather(latitude, longitude);

        if (weatherData) {
          setWeather(weatherData);
          if (weatherData.isMock) {
            setLocationError("Using demo weather data");
          }
        } else {
          throw new Error("Weather data is null");
        }
      } else {
        await loadFallbackWeather();
      }
    } catch (error) {
      console.error("❌ Error loading weather:", error);
      setLocationError("Failed to load weather data");
      await loadFallbackWeather();
    }

    setWeatherLoading(false);
  };

  const loadFallbackWeather = async () => {
    const fallbackWeather = await getCurrentWeather(42.6629, 21.1655);
    if (fallbackWeather) {
      setWeather(fallbackWeather);
      if (fallbackWeather.isMock) {
        setLocationError((prev) =>
          prev ? `${prev} (using demo data)` : "Using demo weather data"
        );
      }
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      "01d": "sunny",
      "01n": "moon",
      "02d": "partly-sunny",
      "02n": "cloudy-night",
      "03d": "cloud",
      "03n": "cloud",
      "04d": "cloud",
      "04n": "cloud",
      "09d": "rainy",
      "09n": "rainy",
      "10d": "rainy",
      "10n": "rainy",
      "11d": "thunderstorm",
      "11n": "thunderstorm",
      "13d": "snow",
      "13n": "snow",
      "50d": "water",
      "50n": "water",
    };
    return iconMap[iconCode] || "partly-sunny";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading app...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Welcome to Find Lost Things 👋</Text>
          <Text style={styles.subtitle}>Please log in to continue</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Login / Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Welcome to Find Lost Things 👋</Text>
        <Text style={styles.welcomeText}>Hello, {user.email}!</Text>

        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherTitle}>Current Weather</Text>
            <TouchableOpacity onPress={loadWeather} disabled={weatherLoading}>
              <Ionicons
                name="refresh"
                size={16}
                color={
                  weatherLoading
                    ? theme.colors.textSecondary
                    : theme.colors.primary
                }
              />
            </TouchableOpacity>
          </View>

          {weatherLoading ? (
            <View style={styles.weatherLoading}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.weatherLoadingText}>Loading weather...</Text>
            </View>
          ) : weather ? (
            <View style={styles.weatherContent}>
              <View style={styles.weatherMain}>
                <Ionicons
                  name={getWeatherIcon(weather.icon)}
                  size={32}
                  color={theme.colors.primary}
                />
                <View style={styles.weatherTemp}>
                  <Text style={styles.temperature}>
                    {weather.temperature}°C
                  </Text>
                  <Text style={styles.weatherDescription}>
                    {weather.description}
                  </Text>
                </View>
              </View>
              <Text style={styles.weatherLocation}>
                <Ionicons
                  name="location"
                  size={12}
                  color={theme.colors.textSecondary}
                />{" "}
                {weather.city}
                {weather.isMock && " (Demo)"}
              </Text>
              {locationError && (
                <Text style={styles.locationErrorText}>{locationError}</Text>
              )}
            </View>
          ) : (
            <View style={styles.weatherError}>
              <Ionicons
                name="cloud-offline"
                size={24}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.weatherErrorText}>Weather unavailable</Text>
            </View>
          )}
        </View>

        <Link href="/add-Item" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add Lost Item</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/found-Item" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Found Items</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/matches" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Matches</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 10,
      color: theme.colors.text,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 40,
      textAlign: "center",
    },
    welcomeText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 30,
      textAlign: "center",
    },
    button: {
      padding: 15,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      marginVertical: 10,
      width: "80%",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },

    weatherCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      width: "100%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.isDark ? 0.2 : 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    weatherHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    weatherTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    weatherLoading: {
      alignItems: "center",
      padding: 16,
    },
    weatherLoadingText: {
      marginTop: 8,
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    weatherContent: {
      alignItems: "center",
    },
    weatherMain: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    weatherTemp: {
      marginLeft: 12,
    },
    temperature: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    weatherDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textTransform: "capitalize",
    },
    weatherLocation: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    locationErrorText: {
      fontSize: 10,
      color: theme.colors.warning,
      marginTop: 4,
      textAlign: "center",
      fontStyle: "italic",
    },
    weatherError: {
      alignItems: "center",
      padding: 16,
    },
    weatherErrorText: {
      marginTop: 6,
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
  });
