import React from "react";
import { View, Text } from "react-native";
// On garde l'import pour voir si c'est lui qui tue l'app
import { Magnetometer } from "expo-sensors";

export default function CompassBar() {
  return (
    <View style={{ padding: 20, backgroundColor: "orange" }}>
      <Text>Test : Magnetometer est {typeof Magnetometer}</Text>
    </View>
  );
}
