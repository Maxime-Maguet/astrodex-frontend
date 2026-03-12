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
import { useIsFocused } from "@react-navigation/native";

export default function BoussoleAndroid() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const user = useSelector((state) => state.user.value); // On récupère les infos du store (token, nickname, etc.)
  const visibleAstres = useSelector((state) => state.astre.visibleAstres);
  const equipement = useSelector((state) => state.user.value.equipement);
  const astresFiltrés = filtrerAstresParEquipement(visibleAstres, equipement);

  const [currentPosition, setCurrentPosition] = useState(null); // État local pour afficher la position direct sur l'écran
  const [target, setTarget] = useState("..."); // L'astre visé
  const [targetAzimuth, setTargetAzimuth] = useState(null);
  const [astreFocus, setAstreFocus] = useState(null);
  const [locationHeading, setLocationHeading] = useState(0);
  const [headingBuffer, setHeadingBuffer] = useState([]); //normal que le headingBuffer n'est pas utilisé, j'utilise juste le tableau pour sauvegarder les 5 dernières valeurs
  const isAligned = useSelector((state) => state.astre.isAligned);

  //ajouté par Max
  const astreFromAccueil = useSelector((state) => state.astre.astreFocus);

  //ajouté par Max
  useEffect(() => {
    if (astreFromAccueil && isFocused) {
      setAstreFocus(astreFromAccueil);
    }
  }, [astreFromAccueil]);

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

      // On écoute les changements de direction de la boussole en temps réel
      let locationSubscription = await Location.watchHeadingAsync(
        (newHeading) => {
          // On arrondit la valeur de la boussole à l'entier le plus proche
          const value = Number(newHeading.trueHeading.toFixed(0));

          setHeadingBuffer((prev) => {
            // On garde les 5 dernières valeurs pour lisser le résultats (exemple: si on bouge d'un coup sec la boussole, ça donnera [10, 12, 11, 45, 13], la moyenne donnera 18)
            // +  la valeur dans le slice est grande, plus ce sera lisse mais + c'est lent à réagir
            const buffer = [...prev, value].slice(-2);

            // Moyenne circulaire : on convertit les degrés en sinus et cosinus
            // pour éviter les sauts entre 359° et 0° (plein Nord)
            const sin = buffer.reduce(
              (a, b) => a + Math.sin((b * Math.PI) / 180),
              0,
            );
            const cos = buffer.reduce(
              (a, b) => a + Math.cos((b * Math.PI) / 180),
              0,
            );

            // On reconvertit le résultat en degrés (0° à 360°)
            const moyenne =
              Math.round((Math.atan2(sin, cos) * 180) / Math.PI + 360) % 360;

            // On met à jour la boussole avec la valeur lissée
            setLocationHeading(moyenne);
            return buffer;
          });
        },
      );

      return () => {
        // on arrête d'écouter la boussole quand on quitte l'écran
        locationSubscription && locationSubscription.remove();
      };
    })();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      setAstreFocus(null);
      setTarget("...");
      dispatch(setIsAligned(false));
      setTargetAzimuth(null);
    }
  }, [isFocused]);

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
      if (distanceHorizontale <= 4) setTarget(`⭐ ${astreFocus} en vue !`);
      else if (distanceHorizontale < 25) setTarget("🥵 C'est chaud...");
      else if (distanceHorizontale < 50) setTarget("🫠 Tu te rapproches...");
      else if (distanceHorizontale < 75) setTarget("🥶 C'est froid...");
      else if (distanceHorizontale < 100) setTarget("❄️ C'est glacial...");
      else setTarget("🧊 Aussi froid que l'espace");
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
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  body: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Inter",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#151C2F",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 15,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#1D2F49",
    color: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 30,
  },
});
