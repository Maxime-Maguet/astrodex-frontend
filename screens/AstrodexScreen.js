import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Switch,
  StatusBar,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCapturedAstres } from "../reducers/astre";
import AstroCard from "../components/AstroCard";
import Header from "../components/Header";
import AstroModal from "../components/AstroModal";
import * as NavigationBar from "expo-navigation-bar";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { updateXP } from "../reducers/user";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function AstrodexScreen() {
  const [astres, setAstres] = useState([]); // Tous les astres
  const [showCapturedOnly, setShowCapturedOnly] = useState(false); // Filtre "Mes captures"
  const [selectedAstre, setSelectedAstre] = useState(null); // Astre sélectionné pour la modal
  const [modalVisible, setModalVisible] = useState(false); // Etat de la modal
  const [captured, setCaptured] = useState(0);
  const [nombreAstre, setNombreAstre] = useState(0);
  const isFocused = useIsFocused();

  const route = useRoute(); // Pour récupérer les params envoyés depuis ObservationScreen
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const capturedAstres = useSelector((state) => state.astre.value);

  const toggleSwitch = () =>
    setShowCapturedOnly((previsousState) => !previsousState);

  const handleDetails = (astre) => {
    setSelectedAstre(astre);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  //permet de ne pas avoir la barre de navigation du téléphone
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  // Ouvre la modal si un astre vient d'être capturé
  useEffect(() => {
    if (route.params?.astreName) {
      const astre = astres.find((e) => e.name === route.params.astreName);
      if (astre) {
        setSelectedAstre(astre);
        setModalVisible(true);
      }
    }
  }, [route.params, astres]);

  // Fetch tous les astres
  useEffect(() => {
    fetch(`${apiUrl}/astres`)
      .then((res) => res.json())
      .then((astresData) => {
        if (astresData.result) {
          setAstres(astresData.astres);
          setNombreAstre(Number(astresData.astres.length));
        }
      });
  }, []);

  // Fetch astres capturés par l'utilisateur
  useEffect(() => {
    if (isFocused && user.token) {
      fetch(`${apiUrl}/users/profile/${user.token}`)
        .then((res) => res.json())
        .then((userData) => {
          if (userData.result) {
            let capture = Number(userData.user.capturedAstres.length);
            dispatch(setCapturedAstres(userData.user.capturedAstres));
            dispatch(updateXP(userData.user.xp));
            setCaptured(capture);
          }
        });
    }
  }, [isFocused]);

  // Filtre les astres selon le switch "Mes captures"
  // Si showCapturedOnly est true, ne garde que les astres déjà capturés
  // Sinon, renvoie tous les astres
  const filteredAstres = astres.filter((item) => {
    if (showCapturedOnly) {
      return capturedAstres.some((e) => e._id === item._id);
    } else {
      return true;
    }
  });

  // Pour chaque astre filtré, on vérifie s'il est capturé
  const astresList = filteredAstres.map((data, i) => {
    const isCaptured = capturedAstres.some((astre) => astre._id === data._id);
    return (
      <AstroCard
        key={data._id}
        name={data.name}
        description={data.description}
        imageUrl={data.imageUrl}
        rarity={data.rarity_level}
        type={data.type}
        isCaptured={isCaptured}
        onDetails={() => handleDetails(data)}
      />
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <Header title="AstroDex" />
      <View style={styles.rangéeStats}>
        <View style={styles.badgeStat}>
          <Text style={styles.valeurStat}>⭐ {user.xp}</Text>
          <Text style={styles.libelleStat}>XP</Text>
        </View>
        <View style={styles.séparateurStat} />
        <View style={styles.badgeStat}>
          <Text style={styles.valeurStat}>
            🌌 {captured}/{nombreAstre}
          </Text>
          <Text style={styles.libelleStat}>Astres capturés</Text>
        </View>
      </View>
      <View style={styles.toggleContainer}>
        <Switch
          trackColor={{ false: "#767577", true: "#767577" }}
          thumbColor={showCapturedOnly ? "#5B8CFF" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={showCapturedOnly}
        />
        <Text style={styles.toggleText}>Mes captures</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {astresList}
      </ScrollView>

      {selectedAstre && (
        <AstroModal
          visible={modalVisible}
          closeModale={closeModal}
          infoAstre={selectedAstre}
        ></AstroModal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    paddingTop: Platform.OS === "ios" ? 20 : 0,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    marginTop: 20,
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  toggleText: {
    color: "#AAB3C5",
    marginLeft: 10,
  },

  rangéeStats: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#151C2F",
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.2)",
  },
  badgeStat: {
    flex: 1,
    alignItems: "center",
  },
  valeurStat: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  libelleStat: {
    color: "#AAB3C5",
    fontSize: 11,
    marginTop: 2,
  },
  séparateurStat: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(56, 189, 248, 0.2)",
  },
});
