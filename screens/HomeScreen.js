import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import CompassBar from "../components/CompassBar";
import * as Location from "expo-location";
import { fetchWeather } from "../services/weatherService";
import * as NavigationBar from "expo-navigation-bar";
import HomeAstresCard from "../components/homeAstresCard";
import SkyCard from "../components/SkyCard";
import { LinearGradient } from "expo-linear-gradient";
import LogoutButton from "../components/LogoutButton";
import { AstresVisibles } from "../modules/logiqueAstres";
import { setVisibleAstres } from "../reducers/astre";
import { useDispatch } from "react-redux";

const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes en ms
const MAX_VISIBILITY = 10000; // 10 000 m = visibilité parfaite (100%)

const visibilityToPercent = (meters) =>
  Math.min(Math.round((meters / MAX_VISIBILITY) * 100), 100);

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");
  const [astres, setAstres] = useState([]);
  const [visibleAstres, setVisibleAstresState] = useState([]);
  const dispatch = useDispatch();
  const [astroInfo, setAstroInfo] = useState(null);

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

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
            coords: location.coords,
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

  //const shortText = astroInfo.description.slice(0, 250);

  useEffect(() => {
    fetch(`${apiUrl}/astres/info`)
      .then((response) => response.json())
      .then((data) => {
        setAstroInfo(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/astres`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setAstres(data.astres);
        }
      });
  }, []);

  useEffect(() => {
    if (astres.length > 0 && weather?.coords) {
      const allNames = astres.map((a) => a.name);

      const visibles = AstresVisibles(allNames, {
        latitude: weather.coords.latitude,
        longitude: weather.coords.longitude,
      });

      const filteredAstres = astres.filter((a) => visibles.includes(a.name));

      setVisibleAstresState(filteredAstres);
      dispatch(setVisibleAstres(visibles));
    }
  }, [astres, weather]);

  const astresList = visibleAstres.map((data, i) => {
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
      <StatusBar hidden={true} />
      <View style={styles.container}>
        <View style={styles.accueil}>
          <Text style={styles.accueil1}>Accueil</Text>
          <View>
            {astroInfo && (
              <>
                {/* <Text>{astroInfo.title}</Text> */}
                <Image
                  source={{ uri: astroInfo.image }}
                  style={{ width: "100%", height: 100 }}
                />
                <ScrollView>
                  {/* <Text style={styles.description}>{shortText}...</Text> */}
                </ScrollView>
              </>
            )}
          </View>
        </View>
        <View style={styles.astresSection}>
          <Text style={styles.texteAstres}>Astres visibles maintenant</Text>
          <View style={styles.ScrollView}>
            <ScrollView
              horizontal={true} // permet de mettre VieW en scroll horizontale
              showsHorizontalScrollIndicator={false}
              style={styles.astresScroll}
            >
              {astresList}
            </ScrollView>
          </View>
        </View>
        <View style={styles.weatherContainer}>
          {weather ? (
            <SkyCard
              temp={weather.temp}
              clouds={weather.clouds}
              clartePercent={weather.clartePercent}
              message={message}
            />
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
    justifyContent: "flex-end",
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
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  compassContainer: {
    marginBottom: 50, // On la décolle un peu du bas
    width: "100%",
  },

  texteAstres: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Inter",
    textAlign: "center",
  },

  ScrollView: {
    height: 180,
    marginTop: 10,
  },

  astresSection: {
    flex: 1,
    justifyContent: "center",
  },

  accueil: {
    flex: 1,
    justifyContent: "flex-start",
  },

  accueil1: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Inter",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: "white",
  },
});
