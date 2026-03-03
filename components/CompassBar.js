import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Animated, Dimensions } from "react-native";
import { Magnetometer } from "expo-sensors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ZOOM_FACTOR = 4;
const CONTENT_WIDTH = 360 * ZOOM_FACTOR;

export default function CompassBar() {
  const [degree, setDegree] = useState(0);

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);

      if (angle < 0) angle += 360;
      setDegree(Math.round(angle));
    });

    Magnetometer.setUpdateInterval(16);

    return () => subscription.remove();
  }, []);

  const translateX = -(degree * ZOOM_FACTOR) - CONTENT_WIDTH;

  return (
    <View style={styles.container}>
      <View style={styles.cursor} />

      <Animated.View style={[styles.ribbon, { transform: [{ translateX }] }]}>
        <CompassContent />
        <CompassContent />
        <CompassContent />
      </Animated.View>
    </View>
  );
}

const CompassContent = () => (
  <View
    style={{ width: CONTENT_WIDTH, flexDirection: "row", alignItems: "center" }}
  >
    <Text style={styles.cardinal}>N</Text>
    <View style={{ flex: 1 }} />
    <Text style={styles.cardinal}>E</Text>
    <View style={{ flex: 1 }} />
    <Text style={styles.cardinal}>S</Text>
    <View style={{ flex: 1 }} />
    <Text style={styles.cardinal}>W</Text>
    <View style={{ flex: 1 }} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
  },
  cursor: {
    position: "absolute",
    // Correction : on centre le curseur par rapport à sa propre largeur
    left: SCREEN_WIDTH / 2 - 1,
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
    fontSize: 18,
    width: 20,
    textAlign: "center",
  },
});
