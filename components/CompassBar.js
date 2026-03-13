import { StyleSheet, View, Text, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

//Largeur de l'écran du téléphone pixels
const { width: SCREEN_WIDTH } = Dimensions.get("window");

//chaque degré = 4px sur l'écran -> augmenter cette valeur étale davantage la boussole
const ZOOM_FACTOR = 4;

//Largeur totale du ruban : 360° x 4px = 1440px (volontairement plus large que l'écran )
const CONTENT_WIDTH = 360 * ZOOM_FACTOR;

//les 8 points cardinaux avec leur position en degrés sur la boussole
const MARKERS = [
  { label: "N", degree: 0 },
  { label: "NE", degree: 45 },
  { label: "E", degree: 90 },
  { label: "SE", degree: 135 },
  { label: "S", degree: 180 },
  { label: "SW", degree: 225 },
  { label: "W", degree: 270 },
  { label: "NW", degree: 315 },
];

//props : degree(direction actuelle du téléphone), targetAzimut(direction de l'astre), isAligned (boolean)
export default function CompassBar({ degree, targetAzimuth, isAligned }) {
  //calcule le décalage horizontal du ruban pour centrer le degré actuel sur l'écran
  // exemple: si on regarde vers le Nord(0°) -> translateX = SCREEN_WIDTH / 2 - 1440
  const translateX = SCREEN_WIDTH / 2 - degree * ZOOM_FACTOR - CONTENT_WIDTH;

  return (
    <View style={styles.container}>
      {/* Ligne rouge fixe au centre de l'écran - indique la direction actuelle*/}
      <View style={styles.cursor} />

      {/*Ruban de la boussole qui défile horizontalement selon translateX */}
      <View style={[styles.ribbon, { transform: [{ translateX }] }]}>
        {/*répété 3 fois côté à côté pour que la boussole soit infinie et ne montre jamais de bord vide quand on tourne */}
        <CompassContent targetAzimuth={targetAzimuth} isAligned={isAligned} />
        <CompassContent targetAzimuth={targetAzimuth} isAligned={isAligned} />
        <CompassContent targetAzimuth={targetAzimuth} isAligned={isAligned} />
      </View>
    </View>
  );
}

//sous composant : affiche les points cardinaux et l'icone de l'astre visé
const CompassContent = ({ targetAzimuth, isAligned }) => (
  <View style={{ width: CONTENT_WIDTH, position: "relative", height: 80 }}>
    {/* Affiche chaque point cardinal positionné en degree x  ZOOM_FACTOR pixels depuis la gauche. Le -10 centre le texte sur sa position*/}
    {MARKERS.map(({ label, degree }) => (
      <Text
        key={label}
        style={[styles.cardinal, { left: degree * ZOOM_FACTOR - 10 }]}
      >
        {label}
      </Text>
    ))}

    {/*Affiche l'icône planète unqiuement si un astre est visé et qu'on est aligné. Positionnée à targerAzimuth × ZOOM_FACTOR, le -15 centre l'icône  */}
    {targetAzimuth !== null && isAligned && (
      <View style={[styles.target, { left: targetAzimuth * ZOOM_FACTOR - 15 }]}>
        <Text>
          <Ionicons name="planet" size={16} color="#FFFFFF" />
        </Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 100,
    backgroundColor: "rgba(255, 255, 255, 0)",
    justifyContent: "center",
    overflow: "hidden",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#1D2F49",
  },

  target: {
    position: "absolute",
    top: "42%",
    bottom: "42%",
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  cursor: {
    position: "absolute",
    left: SCREEN_WIDTH / 2,
    zIndex: 10,
    width: 2,
    height: 50,
    backgroundColor: "red",
  },
  ribbon: {
    flexDirection: "row",
    width: CONTENT_WIDTH * 3,
  },
  cardinal: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
    width: 20,
    textAlign: "center",
    position: "absolute",
    top: "50%",
  },
});
