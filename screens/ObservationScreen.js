import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { updateLocation } from "../reducers/user";
import Header from "../components/Header";
import CompassBar from "../components/CompassBar";
import BoussoleIOS from "../components/CompIos";
import BoussoleAndroid from "../components/CompAndroid";
import BoussoleAndroid2 from "../components/CompAndroidAvecDeviceMotion";
import * as Astronomy from "astronomy-engine";
import { DeviceMotion } from "expo-sensors";

export default function ObservationScreen() {
  return (
    <View style={styles.container}>
      <Header title="Observation" />
      {/* <CompassBar /> */}
      <BoussoleIOS />
      <BoussoleAndroid />
      <BoussoleAndroid2 />
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
