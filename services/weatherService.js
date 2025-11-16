const WEATHERAPI_KEY = "811e4f8782e14641880202029251611";

export const getCurrentWeather = async (latitude, longitude) => {
  try {
    console.log(
      `🌤️ Fetching weather for coordinates: ${latitude}, ${longitude}`
    );

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${latitude},${longitude}&aqi=no`
    );

    console.log("📡 WeatherAPI response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ WeatherAPI error response:", errorText);
      throw new Error(`WeatherAPI error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Weather data received from WeatherAPI");

    return {
      temperature: Math.round(data.current.temp_c),
      description: data.current.condition.text,
      icon: getWeatherIconCode(data.current.condition.code),
      city: data.location.name,
      country: data.location.country,
      isMock: false,
    };
  } catch (error) {
    console.error("❌ Error fetching weather from WeatherAPI:", error.message);
    return getMockWeatherData();
  }
};

// Map WeatherAPI condition codes to Ionicons
const getWeatherIconCode = (conditionCode) => {
  const iconMap = {
    1000: "sunny", // Sunny
    1003: "partly-sunny", // Partly cloudy
    1006: "cloud", // Cloudy
    1009: "cloud", // Overcast
    1030: "cloudy", // Mist
    1063: "rainy", // Patchy rain possible
    1066: "snow", // Patchy snow possible
    1069: "snow", // Patchy sleet possible
    1072: "rainy", // Patchy freezing drizzle possible
    1087: "thunderstorm", // Thundery outbreaks possible
    1114: "snow", // Blowing snow
    1117: "snow", // Blizzard
    1135: "cloudy", // Fog
    1147: "cloudy", // Freezing fog
    1150: "rainy", // Patchy light drizzle
    1153: "rainy", // Light drizzle
    1168: "rainy", // Freezing drizzle
    1171: "rainy", // Heavy freezing drizzle
    1180: "rainy", // Patchy light rain
    1183: "rainy", // Light rain
    1186: "rainy", // Moderate rain at times
    1189: "rainy", // Moderate rain
    1192: "rainy", // Heavy rain at times
    1195: "rainy", // Heavy rain
    1198: "rainy", // Light freezing rain
    1201: "rainy", // Moderate or heavy freezing rain
    1204: "snow", // Light sleet
    1207: "snow", // Moderate or heavy sleet
    1210: "snow", // Patchy light snow
    1213: "snow", // Light snow
    1216: "snow", // Patchy moderate snow
    1219: "snow", // Moderate snow
    1222: "snow", // Patchy heavy snow
    1225: "snow", // Heavy snow
    1237: "snow", // Ice pellets
    1240: "rainy", // Light rain shower
    1243: "rainy", // Moderate or heavy rain shower
    1246: "rainy", // Torrential rain shower
    1249: "snow", // Light sleet showers
    1252: "snow", // Moderate or heavy sleet showers
    1255: "snow", // Light snow showers
    1258: "snow", // Moderate or heavy snow showers
    1261: "snow", // Light showers of ice pellets
    1264: "snow", // Moderate or heavy showers of ice pellets
    1273: "thunderstorm", // Patchy light rain with thunder
    1276: "thunderstorm", // Moderate or heavy rain with thunder
    1279: "thunderstorm", // Patchy light snow with thunder
    1282: "thunderstorm", // Moderate or heavy snow with thunder
  };

  return iconMap[conditionCode] || "partly-sunny";
};

const getMockWeatherData = () => {
  const mockTemperatures = [15, 16, 17, 18, 19, 20, 21, 22];
  const mockDescriptions = [
    "Sunny",
    "Partly cloudy",
    "Cloudy",
    "Overcast",
    "Light rain",
    "Moderate rain",
    "Clear",
    "Mist",
  ];

  const temp =
    mockTemperatures[Math.floor(Math.random() * mockTemperatures.length)];
  const desc =
    mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];

  return {
    temperature: temp,
    description: desc,
    icon: desc.includes("Sunny")
      ? "sunny"
      : desc.includes("cloud")
      ? "partly-sunny"
      : desc.includes("rain")
      ? "rainy"
      : "partly-sunny",
    city: "Pristina",
    country: "XK",
    isMock: true,
  };
};

export const testWeatherAPI = async () => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=Pristina&aqi=no`
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ WeatherAPI test successful - Service is working!");
      return { success: true, data };
    } else {
      const error = await response.text();
      console.log("❌ WeatherAPI test failed:", error);
      return { success: false, error };
    }
  } catch (error) {
    console.log("❌ WeatherAPI test error:", error.message);
    return { success: false, error: error.message };
  }
};

