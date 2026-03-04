import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { updateLocation } from "../reducers/user";
import Header from "../components/Header";
import CompassBar from "../components/CompassBar";
import * as Astronomy from "astronomy-engine";
import { DeviceMotion } from "expo-sensors";

// Liste des astres, pour l'instant système solaire pour test
const bodies = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
let astreFocus = "Venus";

export default function BoussoleAndroid2() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value); // On récupère les infos du store (token, nickname, etc.)

  const [currentPosition, setCurrentPosition] = useState(null); // État local pour afficher la position direct sur l'écran
  const [target, setTarget] = useState("Rien en vue..."); // L'astre visé

  const locationRef = useRef(null); // Pour stocker la position GPS
  const lastCalc = useRef(0); // Pour brider le calcul Astro à 1 seconde
  const currentTargetRef = useRef(null);

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
    //         // On check si le user est bien connecté (s'il a un token) avant de lancer l'appel
    // if (user.token) {
    //         // 1. On va taper sur notre Backend pour récupérer tous les astres qu'il a déjà capturés
    //         // On utilise le token pour être sûr que c'est bien sa collection
    //   fetch(`${BACKEND_ADDRESS}/captures/${user.token}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         // 2. Si le backend nous répond "result: true", c'est que c'est tout bon
    //       if (data.result) {

    //         // On dispatch les astres déjà capturés dans le store Redux
    //         //Comme ça, on peut afficher ses astres capturés sur n'importe quel écran de l'app !
    //         dispatch(loadCaptures(data.captures));
    //       }
    //     });
    // }
  }, []);

  const [deviceMotionHeading, setDeviceMotionHeading] = useState(0);

  useEffect(() => {
    let deviceMotionSubscription = DeviceMotion.addListener(({ rotation }) => {
      // Extract rotation data
      const { alpha } = rotation;

      // Calculate heading
      let calculatedHeading = 360 - (alpha * 180) / Math.PI;
      if (calculatedHeading < 0) {
        calculatedHeading += 360;
      }
      if (calculatedHeading > 360) {
        calculatedHeading -= 360;
      }

      setDeviceMotionHeading(calculatedHeading.toFixed(0));
    });

    return () => {
      deviceMotionSubscription && deviceMotionSubscription.remove();
    };
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
      const diff = Math.abs(deviceMotionHeading - hor.azimuth);
      const distanceHorizontale = Math.min(diff, 360 - diff);

      // Si l'astre est au-dessus de l'horizon et aligné (marge de 10°)
      if (hor.altitude > 0) {
        if (distanceHorizontale <= 4 && astreFocus === body) {
          found = `${body}`;

          break;
        } else if (distanceHorizontale <= 10 && body === astreFocus) {
          found = `Tu y es presque !`;
        }
      }
    }

    setTarget(found);

    // On relance le calcul dès que la position ou la boussole change
  }, [currentPosition, deviceMotionHeading]);

  return (
    <View style={styles.container}>
      <Text style={styles.h2}>Pour ANDROID avec DeviceMotion</Text>
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
          <Text style={styles.body}>Boussole : {deviceMotionHeading}°</Text>
          <Text style={styles.body}>En vue : {target}</Text>
          <Text style={styles.body}>Alignement : PlaceHolder</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    alignItems: "center",
    padding: 20,
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
    width: "100%",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1D2F49",
    color: "#FFFFFF",
  },

  button: {
    width: "100%",
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
