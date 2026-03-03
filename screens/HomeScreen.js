import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import CompassBar from "../components/CompassBar";
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Titre ou Dashboard en haut */}
        <View style={styles.header}>
          <Text style={styles.title}>Stellar Explorer</Text>
          <Text style={styles.subtitle}>Jours 2 - Test Boussole</Text>
        </View>

        {/* Espace vide au milieu (futur Radar / Carte) */}
        <View style={styles.mainView}>
          <Text style={{ color: "grey" }}>Le radar principal viendra ici</Text>
        </View>

        {/* TA BOUSSOLE EN BAS (Style Skyrim) */}
        <View style={styles.compassContainer}>
          <CompassBar />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505", // Fond très sombre
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  subtitle: {
    color: "#5B8CFF",
    fontSize: 14,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  compassContainer: {
    marginBottom: 50, // On la décolle un peu du bas
    width: "100%",
  },
});
