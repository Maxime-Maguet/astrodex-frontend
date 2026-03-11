import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
  Pressable,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCapturedAstres } from "../reducers/astre";
import AstroCard from "../components/AstroCard";
import Header from "../components/Header";
import AstroModal from "../components/AstroModal";

import { useRoute, useIsFocused } from "@react-navigation/native";
import { updateXP } from "../reducers/user";
import * as Progress from "react-native-progress";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function AstrodexScreen() {
  const [astres, setAstres] = useState([]); // Tous les astres
  const [showCapturedOnly, setShowCapturedOnly] = useState(false); // Filtre "Mes captures"
  const [selectedAstre, setSelectedAstre] = useState(null); // Astre sélectionné pour la modal
  const [modalVisible, setModalVisible] = useState(false); // Contrôle la visibilité de la modal
  const [captured, setCaptured] = useState(0); // Nombre d'astres capturés par l'utilisateur
  const [nombreAstre, setNombreAstre] = useState(0); // Nombre total d'astres disponibles
  const [dateCapture, setDateCapture] = useState([]);
  const [showXP, setShowXP] = useState(false);
  // useIsFocused retourne true quand l'écran est actif — utilisé pour relancer les fetches à chaque visite
  const isFocused = useIsFocused();

  // useRoute permet de récupérer les paramètres de navigation (ex: astreName envoyé depuis ObservationScreen)
  const route = useRoute();
  const dispatch = useDispatch();

  // Données utilisateur depuis Redux (token, xp...)
  const user = useSelector((state) => state.user.value);
  // Liste des astres capturés stockée dans Redux, mise à jour après chaque capture
  const capturedAstres = useSelector((state) => state.astre.value);

  // Inverse l'état du switch "Mes captures"
  const toggleSwitch = () =>
    setShowCapturedOnly((previsousState) => !previsousState);

  // Ouvre la modal de détails pour un astre spécifique
  const handleDetails = (astre) => {
    setSelectedAstre(astre);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Si on arrive depuis ObservationScreen avec un astreName en paramètre,
  // on trouve l'astre correspondant et on ouvre directement sa modal
  useEffect(() => {
    if (route.params?.astreName) {
      const astre = astres.find((e) => e.name === route.params.astreName);
      if (astre) {
        setSelectedAstre(astre);
        setModalVisible(true);
      }
    }
  }, [route.params, astres]);

  // Charge tous les astres de la BDD au premier rendu
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

  // Se relance à chaque fois que l'écran devient actif (isFocused)
  // Resynchronise les astres capturés et l'XP depuis la BDD vers Redux
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
            setDateCapture(userData.user.capturedDates);
          }
        });
    }
  }, [isFocused]);

  // Si le filtre est actif, ne garde que les astres présents dans capturedAstres (Redux)
  // Sinon retourne tous les astres
  const filteredAstres = astres.filter((item) => {
    if (showCapturedOnly) {
      return capturedAstres.some((e) => e._id === item._id);
    } else {
      return true;
    }
  });

  // Pour chaque astre filtré, vérifie s'il est capturé pour passer isCaptured à AstroCard
  // AstroCard affiche un overlay "NON CAPTURÉ" si isCaptured est false
  const astresList = filteredAstres.map((data, i) => {
    const isCaptured = capturedAstres.some((astre) => astre._id === data._id);
    const capturedDate = dateCapture.find((e) => e.astreId === data._id);

    return (
      <AstroCard
        key={data._id}
        name={data.name}
        description={data.description}
        imageUrl={data.imageUrl}
        rarity={data.rarity_level}
        type={data.type}
        date={capturedDate?.capturedAt}
        isCaptured={isCaptured}
        onDetails={() => handleDetails(data)}
      />
    );
  });

  //calcul du niveau
  let xpLimit = 250;
  let xps = user.xp;
  let niveau = Math.floor(xps / xpLimit); //on arrondi pour avoir un niveau sans virgule.
  if (niveau >= 100) {
    niveau = null;
  }

  let xpSur250 = xps - niveau * xpLimit;
  let xpDeBarre = xpSur250 / xpLimit;
  //console.log(xpDeBarre);

  return (
    <View style={styles.safeArea}>
      <Header title="AstroDex" />

      {/* Bandeau de stats : XP et progression de capture */}

      <View style={styles.rangéeStats}>
        <View style={styles.badgeStat}>
          <View style={styles.xp}>
            <Text style={styles.libelleStat}>Niveau : </Text>
            <Text style={styles.valeurStat}>{niveau}</Text>
          </View>
          <Pressable
            onPress={() => setShowXP((prev) => !prev)}
            style={{ paddingTop: 10 }}
          >
            {showXP ? (
              <View style={styles.xp}>
                <Octicons name="star-fill" size={16} color="gold" />
                <Text style={styles.valeurStat}>{user.xp}</Text>
                <Text style={styles.libelleStat}>XP</Text>
              </View>
            ) : (
              <Text style={{ marginBottom: 1 }}>
                <Progress.Bar
                  color={"rgba(91, 140, 255, 1)"}
                  unfilledColor={"rgba(0, 122, 255, 0)"}
                  borderColor={"#AAB3C5"}
                  progress={xpDeBarre}
                  width={100}
                  height={16}
                >
                  <Text style={styles.textDansBarre}>
                    {xpSur250}/{xpLimit}
                  </Text>
                </Progress.Bar>
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.séparateurStat} />
        <View style={styles.badgeStat}>
          <Text style={styles.valeurStat}>
            🌌 {captured}/{nombreAstre}
          </Text>
          <Text style={styles.libelleStat}>Astres capturés</Text>
        </View>
      </View>

      {/* Switch pour filtrer uniquement les astres capturés */}
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

      {/* Modal de détails — ne se monte que si un astre est sélectionné */}
      {selectedAstre && (
        <AstroModal
          visible={modalVisible}
          closeModale={closeModal}
          infoAstre={selectedAstre}
        ></AstroModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    // paddingTop: 20,
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

  textDansBarre: {
    color: "rgba(255, 255, 255, 0.7)",
    position: "absolute",
    alignSelf: "center",
    fontSize: 12,
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

  xp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  valeurStat: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  libelleStat: {
    color: "#AAB3C5",
    fontSize: 11,
    //marginTop: 2,
  },
  séparateurStat: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(56, 189, 248, 0.2)",
  },
});
