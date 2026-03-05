import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import CompassBar from "../components/CompassBar";
import * as Location from "expo-location";
import { fetchWeather } from "../services/weatherService";
import HomeAstresCard from "../components/homeAstresCard";

const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes en ms
const MAX_VISIBILITY = 10000; // 10 000 m = visibilité parfaite (100%)

const visibilityToPercent = meters =>
  Math.min(Math.round((meters / MAX_VISIBILITY) * 100), 100);

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");
  const [astres, setAstres] = useState([]);
  useEffect(() => {
    let interval;

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
    fetch(`${apiUrl}/astres`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.result) {
          setAstres(data.astres);
        }
      });
  }, []);

  const astresList = astres.map((data, i) => {
    return (
      <HomeAstresCard
        key={data._id}
        name={data.name}
        imageUrl={data.imageUrl}
      />
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.astresSection}>
          <Text style={styles.texteAstres}>Astres Visible ce soir</Text>
          <View style={styles.ScrollView}>
            <ScrollView
              horizontal={true} // permet de mettre VieW en scroll horizontale
              showsHorizontalScrollIndicator={true}   
              style={styles.astresScroll}>
              {astresList}
            </ScrollView>
          </View>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "center",
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

  texteAstres: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  ScrollView: {
    height: 180,
    marginTop: 10,
  },

  astresSection: {
    flex: 1,
    justifyContent: "center",
  },
});
