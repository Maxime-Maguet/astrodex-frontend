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

const visibilityToPercent = meters =>
  Math.min(Math.round((meters / MAX_VISIBILITY) * 100), 100);

export default function HomeScreen() {
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");
  const [astres, setAstres] = useState([]);
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
            location.coords.longitude,
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

useEffect(() => {
  fetch("http://192.168.1.67:3000/astres")
    .then((res) => res.json())
    .then((data) => { console.log(data)
      if (data.result) {
        setAstres(data.astres);
      }
    });
}, []);

  const astresList = astres.map((data, i) => {
    return (
      <AstreCard
        key={data._id}
        name={data.name}
        description={data.description}
        imageUrl={data.imageUrl}
      />
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {astresList}

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
