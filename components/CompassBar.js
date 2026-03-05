import { StyleSheet, View, Text, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ZOOM_FACTOR = 4;
const CONTENT_WIDTH = 360 * ZOOM_FACTOR;

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

export default function CompassBar({ degree, targetAzimuth }) {
  const translateX = SCREEN_WIDTH / 2 - degree * ZOOM_FACTOR - CONTENT_WIDTH;

  return (
    <View style={styles.container}>
      <View style={styles.cursor} />
      <View style={[styles.ribbon, { transform: [{ translateX }] }]}>
        <CompassContent targetAzimuth={targetAzimuth} />
        <CompassContent targetAzimuth={targetAzimuth} />
        <CompassContent targetAzimuth={targetAzimuth} />
      </View>
    </View>
  );
}

const CompassContent = ({ targetAzimuth }) => (
  <View style={{ width: CONTENT_WIDTH, position: "relative", height: 80 }}>
    {MARKERS.map(({ label, degree }) => (
      <Text
        key={label}
        style={[styles.cardinal, { left: degree * ZOOM_FACTOR - 10 }]}
      >
        {label}
      </Text>
    ))}

    {targetAzimuth !== null && (
      <View style={[styles.target, { left: targetAzimuth * ZOOM_FACTOR - 15 }]}>
        <Text style={{ fontSize: 10 }}>⭕</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0)",
    justifyContent: "center",
    overflow: "hidden",
  },

  target: {
    position: "absolute",
    top: "50%",
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
