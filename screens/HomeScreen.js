import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import CompassBar from "../components/CompassBar";
import * as Location from "expo-location";
import { fetchWeather } from "../services/weatherService";

const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes en ms
const MAX_VISIBILITY = 10000; // 10 000 m = visibilité parfaite (100%)

const visibilityToPercent = (meters) =>
  Math.min(Math.round((meters / MAX_VISIBILITY) * 100), 100);

export default function HomeScreen() {
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadWeather = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setMessage("GPS permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const fetchAndUpdate = async () => {
        try {
          const data = await fetchWeather(
            location.coords.latitude,
            location.coords.longitude
          );
          setWeather({
            ...data,
            clartePercent: visibilityToPercent(data.visibility),
          });
          if (data.clouds > 70) {
            setMessage("Too cloudy to observe the sky");
          } else {
            setMessage("Clear sky for observation");
          }
        } catch (err) {
          setMessage("Unable to fetch weather");
        }
      };

//appel immédiat puis toutes les 30 min
      await fetchAndUpdate();
      interval = setInterval(fetchAndUpdate, REFRESH_INTERVAL);
    };

    loadWeather();
//nettoyage au démontage
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Titre ou Dashboard en haut */}
        <View style={styles.header}>
          <Text style={styles.title}>Stellar Explorer</Text>
          <Text style={styles.subtitle}>Jours 2 - Test Boussole</Text>
        </View>

        {/* Espace vide au milieu (futur Radar / Carte) */}
        <View style={styles.mainView}>
          <Text style={{ color: "grey" }}>Le radar principal viendra ici</Text>
        </View>

         <View style={styles.weatherContainer}>
          {weather ? (
            <>
              <Text style={{ color: "white", fontSize: 16 }}>
                Temp: {weather.temp}°C
              </Text>
              <Text style={{ color: "white", fontSize: 16 }}>
                Clouds: {weather.clouds}%
              </Text>
              <Text style={{ color: "white", fontSize: 16 }}>
                Visibility: {weather.clartePercent}%
              </Text>
              <Text style={{ color: "#5B8CFF", marginTop: 10 }}>{message}</Text>
            </>
          ) : (
            <Text style={{ color: "grey" }}>Unable to fetch weather</Text>
          )}
        </View>

        {/* TA BOUSSOLE EN BAS (Style Skyrim) */}
        <View style={styles.compassContainer}>
          <CompassBar />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505", // Fond très sombre
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  subtitle: {
    color: "#5B8CFF",
    fontSize: 14,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherContainer: {
    alignItems: "center", 
    marginBottom: 20,
  },
  compassContainer: {
    marginBottom: 50, // On la décolle un peu du bas
    width: "100%",
  },
});