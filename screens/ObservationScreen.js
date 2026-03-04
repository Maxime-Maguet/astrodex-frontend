import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { updateLocation } from "../reducers/user";
import Header from "../components/Header";
import CompassBar from "../components/CompassBar";
import BoussoleIOS from "../components/CompIos";
import BoussoleAndroid from "../components/CompAndroid";
import BoussoleAndroid2 from "../components/CompAndroidAvecDeviceMotion";
import * as Astronomy from "astronomy-engine";
import { DeviceMotion } from "expo-sensors";
import ButtonCapture from "../components/buttonCapture";
import ObservationModal from "../components/observationModal";

export default function ObservationScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCapture = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  function platformIOS() {
    if (Platform.OS === "ios") {
      return <BoussoleIOS />;
    } else if (Platform.OS === "android") {
      return <BoussoleAndroid />;
    }
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <Header title="Observation" />
        {/* <CompassBar /> */}
        {platformIOS()}
        <ButtonCapture
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={handleCapture}
        />
        <ObservationModal visible={modalVisible} closeModal={closeModal} />
      </ScrollView>
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
