import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import { StyleSheet, Text, View } from "react-native";
import { updateLocation } from "../reducers/user";
import CompassBar from "../components/CompassBar";
import * as Astronomy from "astronomy-engine";

// Liste des astres, pour l'instant système solaire pour test
const bodies = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
let astreFocus = "Saturn";
let Alignement;

export default function BoussoleAndroid() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value); // On récupère les infos du store (token, nickname, etc.)

  const [currentPosition, setCurrentPosition] = useState(null); // État local pour afficher la position direct sur l'écran
  const [target, setTarget] = useState("Rien en vue..."); // L'astre visé

  useEffect(() => {
    let subscription; // On prépare une variable pour pouvoir dire "quand je ne suis pas sur l'app, je n'actualise pas"

    (async () => {
      // 1. On demande au téléphone la permission d'utiliser la loc
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === "granted") {
        // 2. Si c'est OK("granted"), on lance le watcher
        //on attend la réponse avec await
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High, //si on ne met pas ça, Android ou IOS ne met pas en priorité notre app et donc n'actualise pas
            timeInterval: 5000, // On check toutes les 5 secondes
            distanceInterval: 1, // Ou dès qu'on bouge d'un mètre
          },
          (location) => {
            // 3. À chaque fois que la position change :
            const coords = {
              lat: location.coords.latitude,
              lon: location.coords.longitude,
            };
            console.log("📍 Update GPS :", coords);
            // On met à jour l'état
            setCurrentPosition(location.coords);
            // On envoie les coordonnées dans Redux pour les utiliser partout dans l'app
            dispatch(updateLocation(coords));
          },
        );
      }
    })();
    // 4. LE NETTOYAGE (Super important) : (askip)
    // Quand on quitte cet écran, on coupe le GPS pour ne pas flinguer la batterie du tel
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const [locationHeading, setLocationHeading] = useState(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let locationSubscription = await Location.watchHeadingAsync(
        (locationHeading) => {
          setLocationHeading(Number(locationHeading.trueHeading.toFixed(0)));
        },
      );

      return () => {
        locationSubscription && locationSubscription.remove();
      };
    })();
  }, []);

  useEffect(() => {
    // On ne calcule que si on a la position ET l'orientation
    if (!currentPosition) return;

    const observer = new Astronomy.Observer(
      currentPosition.latitude,
      currentPosition.longitude,
      currentPosition.altitude ?? 0,
    );

    const date = new Date();
    let found = "Rien en vue...";

    for (let body of bodies) {
      const equ_ofdate = Astronomy.Equator(body, date, observer, true, true);
      const hor = Astronomy.Horizon(
        date,
        observer,
        equ_ofdate.ra,
        equ_ofdate.dec,
        "normal",
      );

      // Calcul de l'écart entre le téléphone et l'astre
      const diff = Math.abs(locationHeading - hor.azimuth);
      const distanceHorizontale = Math.min(diff, 360 - diff);

      // Si l'astre est au-dessus de l'horizon et aligné
      if (hor.altitude > 0) {
        if (distanceHorizontale <= 2 && astreFocus === body) {
          found = `${body}`;
          Alignement = "Alignement parfait";
          break;
        } else if (distanceHorizontale < 10 && body === astreFocus) {
          Alignement = "Presque aligné";
        } else if (distanceHorizontale > 10 && body === astreFocus) {
          Alignement = "Pas aligné";
        }
      }
    }

    setTarget(found);

    // On relance le calcul dès que la position ou la boussole change
  }, [currentPosition, locationHeading]);

  return (
    <View style={styles.container}>
      <View style={styles.headerPadding}>
        <Text style={styles.h2}>Pour Android</Text>
        <Text style={styles.body}>Astre Focus: {astreFocus}</Text>
      </View>
      <View>
        <CompassBar degree={locationHeading} />
      </View>
      <View style={styles.card}>
        <Text style={styles.body}>
          Ta position :{" "}
          {currentPosition ? (
            <Text style={styles.body}>
              Lat: {currentPosition.latitude.toFixed(1)} / Lon:{" "}
              {currentPosition.longitude.toFixed(1)}
            </Text>
          ) : (
            <Text>Récupération des coordonnées...</Text>
          )}
        </Text>
        <View>
          <Text style={styles.body}>Boussole : {locationHeading}°</Text>
          <Text style={styles.body}>En vue : {target}</Text>
          <Text style={styles.body}>Alignement : {Alignement}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#0B0F1A",
    alignItems: "center",
  },

  headerPadding: {
    alignSelf: "center",
    paddingHorizontal: 20,
    alignItems: "center",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titre: {
    fontSize: 48,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "Inter",
  },

  h2: {
    fontSize: 32,
    color: "#FFFFFF",
    fontFamily: "Inter",
  },

  h3: {
    fontSize: 24,
    color: "#5B8CFF",
    fontFamily: "Inter",
  },

  body: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Inter",
    marginBottom: 10,
  },

  body2: {
    fontSize: 14,
    color: "#ADB5BD",
    fontFamily: "Inter",
  },

  card: {
    backgroundColor: "#151C2F",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 15,
    alignSelf: "stretch",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1D2F49",
    color: "#FFFFFF",
    marginHorizontal: 20,
  },

  button: {
    alignSelf: "stretch",
    backgroundColor: "#5B8CFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },

  buttonPressed: {
    backgroundColor: "#3E63DD",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
