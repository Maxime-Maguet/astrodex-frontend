import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { fetchWeather } from "../services/weatherService";
import * as NavigationBar from "expo-navigation-bar";
import HomeAstresCard from "../components/homeAstresCard";
import SkyCard from "../components/SkyCard";
import { AstresVisibles } from "../modules/logiqueAstres";
import {
  setVisibleAstres,
  setCapturedAstres,
  setAstreFocus,
} from "../reducers/astre";
import { updateXp } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../components/LoadingModal";
import { MagnitudeLimite } from "../modules/filtreAstresParEquipement";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import ZoomableImage from "../components/ZoomableImage";
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes en ms
const MAX_VISIBILITY = 10000; // 10 000 m = visibilité parfaite (100%)

const visibilityToPercent = (meters) =>
  Math.min(Math.round((meters / MAX_VISIBILITY) * 100), 100);

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");
  const [astres, setAstres] = useState([]);
  const [visibleAstres, setVisibleAstresState] = useState([]);
  const dispatch = useDispatch();
  const [astroInfo, setAstroInfo] = useState(null);
  const equipement = useSelector((state) => state.user.value.equipement);
  const user = useSelector((state) => state.user.value);
  const capturedAstres = useSelector((state) => state.astre.value);
   const imgcloud = "https://res.cloudinary.com/dlywrsigk/image/upload/v1773220645/agdknaloihgtfgop5zbc.jpg"

  const navigation = useNavigation();

  useEffect(() => {
    if (user.token) {
      fetch(`${apiUrl}/users/profile/${user.token}`)
        .then((res) => res.json())
        .then((userData) => {
          if (userData.result) {
            dispatch(setCapturedAstres(userData.user.capturedAstres));
            dispatch(updateXp(userData.user.xp));
          }
        });
    }
  }, []);

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
            setMessage("Trop nuageux pour l'observation");
          } else {
            setMessage("Ciel dégagé pour l'observation");
          }
        } catch (err) {
          setMessage("Impossible de charger la météo");
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

  // const shortText = astroInfo.description.slice(0, 250);

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

      const magnitudeMax = MagnitudeLimite[equipement] ?? 0; //filtre par équipement (si pas déquipement on filtre par rapport a la magnitude 0 (oeil nu par défaut))

      const filteredAstres = astres
        .filter((a) => visibles.includes(a.name))
        .filter((a) => a.magnitude <= magnitudeMax); //filtre par magnitude

      setVisibleAstresState(filteredAstres);
      dispatch(setVisibleAstres(filteredAstres.map((a) => a.name)));
      setTimeout(() => setIsLoading(false), 4000);
    }
  }, [astres, weather, equipement]);

   useEffect(() => {
 
if (astroInfo ){
 setAstroInfo(astroInfo)
}else{
setAstroInfo({
  image :imgcloud})
} 
 }, []);



  const astresList = visibleAstres.map((data) => {
    const isCaptured = capturedAstres.some((astre) => astre._id === data._id);

    return (
      <HomeAstresCard
        key={data._id}
        name={data.name}
        imageUrl={data.imageUrl}
        validatedAstre={isCaptured}
        onPress={() => {
          dispatch(setAstreFocus(data.name));
          navigation.navigate("Observation");
        }}
      />
    );

    
  });

  return (
    <View style={styles.safeArea}>
      <LoadingModal visible={isLoading} />

      <View style={styles.container}>
        <View style={styles.accueil}>
          <Header title="Accueil" />
          <View style={styles.card}>
            {astroInfo && (
              <View style={styles.imageContainer}>
                <ZoomableImage
                  imageUrl={astroInfo.image || imgcloud}
                  style={styles.nasaImage}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.5)"]}
                  style={styles.gradient}
                ></LinearGradient>
                <View style={styles.overlay}>
                  <Text style={styles.nomNasa}>
                    🚀 NASA • Image du jour {astroInfo.title}
                  </Text>
                </View>
              </View>
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
            <Text style={{ color: "grey" }}>
              Impossible d'afficher la météo
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
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

  astresScroll: {
    marginTop: 10,
  },
  weatherContainer: {
    width: "100%",
    marginVertical: 20,
    paddingHorizontal: 0,
  },
  compassContainer: {
    marginBottom: 50,
    width: "100%",
  },

  texteAstres: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Inter",
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 1,
  },

  ScrollView: {
    height: 180,
    marginTop: 10,
  },

  astresSection: {
    justifyContent: "center",
  },

  accueil: {
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

  imageContainer: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },

  nasaImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 5,
  },

  nomNasa: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6A00",
    textAlign: "center",
    letterSpacing: 1,
    // textShadowColor: "rgba(0,0,0,0.9)",
    // textShadowOffset: { width: 0, height: 1 },
    // textShadowRadius: 4,
  },

  // description: {
  //   fontSize: 14,
  //   color: "#FFFFFF",
  //   textShadowColor: "rgba(0,0,0,0.9)",
  //   textShadowOffset: { width: 0, height: 1 },
  //   textShadowRadius: 4,
  // },

  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.15)",
    padding: 10,
    borderRadius: 20,
  },

  textScroll: {
    height: 65,
  },

  card: {
    paddingHorizontal: 20,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderRadius: 16,
    elevation: 43,
  },

  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
