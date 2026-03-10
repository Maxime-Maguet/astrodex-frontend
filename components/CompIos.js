import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import { StyleSheet, Text, View } from "react-native";
import { updateLocation } from "../reducers/user";
import { setIsAligned } from "../reducers/astre";
import CompassBar from "../components/CompassBar";
import AstreSelector from "../components/AstresVisibles";
import * as Astronomy from "astronomy-engine";
import { FIXED_COORDINATES } from "../modules/logiqueAstres";
import { filtrerAstresParEquipement } from "../modules/filtreAstresParEquipement";

export default function BoussoleAndroid() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value); // On récupère les infos du store (token, nickname, etc.)
  const visibleAstres = useSelector((state) => state.astre.visibleAstres);
  const equipement = useSelector((state) => state.user.value.equipement);
  const astresFiltrés = filtrerAstresParEquipement(visibleAstres, equipement);

  const [currentPosition, setCurrentPosition] = useState(null); // État local pour afficher la position direct sur l'écran
  const [target, setTarget] = useState("..."); // L'astre visé
  const [targetAzimuth, setTargetAzimuth] = useState(null);
  const [astreFocus, setAstreFocus] = useState(null);
  const [locationHeading, setLocationHeading] = useState(0);
  const isAligned = useSelector((state) => state.astre.isAligned);
  // console.log(visibleAstres);
  // console.log(useSelector((state) => state.astre));
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
            timeInterval: 10000, // On check toutes les 5 secondes
            distanceInterval: 5, // Ou dès qu'on bouge d'un mètre
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
    if (!currentPosition || !astreFocus || astreFocus === "...") return;

    const observer = new Astronomy.Observer(
      currentPosition.latitude,
      currentPosition.longitude,
      currentPosition.altitude ?? 0,
    );
    const date = new Date();

    let raFocus, decFocus;

    // Utilisation des coordonnées fixes ou calculées
    if (FIXED_COORDINATES[astreFocus]) {
      raFocus = FIXED_COORDINATES[astreFocus].ra;
      decFocus = FIXED_COORDINATES[astreFocus].dec;
    } else {
      try {
        const equ = Astronomy.Equator(astreFocus, date, observer, true, true);
        raFocus = equ.ra;
        decFocus = equ.dec;
      } catch (e) {
        return;
      }
    }

    const horFocus = Astronomy.Horizon(
      date,
      observer,
      raFocus,
      decFocus,
      "normal",
    );
    setTargetAzimuth(horFocus.azimuth);

    const diff = Math.abs(locationHeading - horFocus.azimuth);
    const distanceHorizontale = Math.min(diff, 360 - diff);

    if (horFocus.altitude > 0) {
      dispatch(setIsAligned(distanceHorizontale <= 3));
      if (distanceHorizontale <= 3) setTarget(`⭐ ${astreFocus} en vue !`);
      else if (distanceHorizontale < 10) setTarget("🥵 C'est chaud...");
      else if (distanceHorizontale < 20) setTarget("🫠 Tu te rapproches...");
      else setTarget("🥶 C'est froid...");
    } else {
      setTarget("L'astre est sous la ligne d'horizon");
      dispatch(setIsAligned(false));
    }
  }, [currentPosition, locationHeading, astreFocus]);

  return (
    <View style={styles.container}>
      <View style={styles.headerPadding}>
        <AstreSelector
          visibleBodies={astresFiltrés}
          currentFocus={astreFocus}
          onSelect={(body) => setAstreFocus(body)}
        />
      </View>
      <View>
        <CompassBar
          degree={locationHeading}
          targetAzimuth={targetAzimuth}
          isAligned={isAligned}
        />
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
          <Text style={styles.body}>🌡️ : {target}</Text>
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
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
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
