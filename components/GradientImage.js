import { StyleSheet, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientImage() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Image style={styles.image} source={require("../assets/galaxie.jpg")} />
      <LinearGradient
        colors={["transparent", "rgba(11,15,26,0.85)"]}
        style={styles.gradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },

  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: "100%",
  },
});
