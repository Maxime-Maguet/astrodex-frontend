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

export default function CompassBar({ degree }) {
  const translateX = SCREEN_WIDTH / 2 - degree * ZOOM_FACTOR - CONTENT_WIDTH;

  return (
    <View style={styles.container}>
      <View style={styles.cursor} />
      <View style={[styles.ribbon, { transform: [{ translateX }] }]}>
        <CompassContent />
        <CompassContent />
        <CompassContent />
      </View>
    </View>
  );
}

const CompassContent = () => (
  <View style={{ width: CONTENT_WIDTH, position: "relative", height: 80 }}>
    {MARKERS.map(({ label, degree }) => (
      <Text
        key={label}
        style={[
          styles.cardinal,
          {
            position: "absolute",
            left: degree * ZOOM_FACTOR - 10,
          },
        ]}
      >
        {label}
      </Text>
    ))}
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
