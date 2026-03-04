import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Animated, Dimensions } from "react-native";
import { DeviceMotion } from "expo-sensors";
//voir la difference avec useWindowDimensions
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ZOOM_FACTOR = 4;
// 360 représente un cercle complet en multipliant par le zoom factore chaque degré correspond à 4px sur le ruban (1440px de large pour un tour complet)
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

export default function CompassBar() {
  //on initialise degree à 0 capté par le magnetometre
  const [degree, setDegree] = useState(0);
  //console.log(Dimensions.get("window"));

  useEffect(() => {
    const subscription = DeviceMotion.addListener((data) => {
      //console.log(data.rotation);
      if (!data.rotation) return;

      let angle = (data.rotation.alpha * (180 / Math.PI) + 360) % 360;

      //console.log("angle brut :", Math.round(angle));
      setDegree(Math.round(angle));
    });
    //On demande une mise à jour toutes les 16ms ≈ 60fps. C'est la fréquence d'un écran fluide.
    DeviceMotion.setUpdateInterval(16);
    //quand le composant est détruit, on désabonne le listener pour éviter les fuites mémoire.
    return () => subscription.remove();
  }, []);
  //ici on récupere les degree du state et on convertit les degré en pixels (ici 90° *4) si on tourne de 1° le ruban glisse de 4px
  // on part du principe que 1° = 1px
  //const translateX = degree - CONTENT_WIDTH;
  const translateX = -(degree * ZOOM_FACTOR) - CONTENT_WIDTH;
  //console.log(degree);

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
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    overflow: "hidden", // cache ce qui dépasse de la barre
  },
  cursor: {
    position: "absolute",
    left: SCREEN_WIDTH / 2 - 1, // centré sur l'écran (-1 pour compenser width:2)
    zIndex: 10,
    width: 2,
    height: 50,
    backgroundColor: "red",
  },
  ribbon: {
    flexDirection: "row",
    width: CONTENT_WIDTH * 3, // 3 copies côte à côte
  },
  cardinal: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    width: 20,
    textAlign: "center",
    position: "absolute",
    top: "50%", // centré verticalement dans la barre
  },
});
