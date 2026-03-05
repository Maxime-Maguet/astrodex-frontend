import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import Header from "../components/Header";
import BoussoleIOS from "../components/CompIos";
import BoussoleAndroid from "../components/CompAndroid";
import ButtonCapture from "../components/buttonCapture";
import ObservationModal from "../components/observationModal";
import * as NavigationBar from "expo-navigation-bar";

export default function ObservationScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [planetName, setplanetName] = useState(null);
  const handleCapture = () => {
    setplanetName("Mars"); // a modifier ici pour recuperer les planetes en fonction du positionnement de la capture
    setModalVisible(true);
  };

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  function platformOS() {
    if (Platform.OS === "ios") {
      return <BoussoleIOS />;
    } else if (Platform.OS === "android") {
      return <BoussoleAndroid />;
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={styles.scrollContent}
      >
        <Header title="Observation" />
        {platformOS()}
        <ButtonCapture
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={handleCapture}
        />
        <ObservationModal
          visible={modalVisible}
          closeModal={closeModal}
          planetName={planetName}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },

  scrollContent: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 40,
  },

  button: {
    alignSelf: "stretch",
    backgroundColor: "#5B8CFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
    marginHorizontal: 20,
    minWidth: "90%",
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
