import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEquipement } from "../reducers/user";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import GradientBackground from "../components/GradientBackground";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function EquipementSelectionScreen({ navigation }) {
  const route = useRoute();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [equipement, setEquipement] = useState("");
  const [infoVisible, setInfoVisible] = useState(null);

  const equipementsData = [
    {
      id: "Oeil nu",
      icon: "eye",
      desc: "Parfait pour apprendre à lire les constellations et repérer les planètes les plus brillantes.",
    },
    {
      id: "Jumelles",
      icon: "binoculars",
      desc: "L'équilibre idéal pour explorer les champs étoilés et les amas ouverts.",
    },
    {
      id: "Telescope",
      icon: "telescope",
      desc: "Débusquez les astres les plus sombres et les galaxies les plus lointaines.",
    },
  ];

  const Observation = () => {
    if (equipement === "" || equipement === undefined) {
      return;
    }

    fetch(`${apiUrl}/users/updateUser`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipement: equipement, token: user.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          dispatch(updateEquipement(data.equipement));
        }
        const ecranOrigine = route.params?.from;
        if (ecranOrigine === "Profil") {
          navigation.navigate("TabNavigator", { screen: "Profil" });
        } else if (ecranOrigine === "Signup") {
          navigation.navigate("TabNavigator", { screen: "Accueil" });
        } else {
          navigation.navigate("TabNavigator", { screen: "Accueil" });
        }
      });
  };

  useEffect(() => {
    if (user.equipement) {
      setEquipement(user.equipement);
    }
  }, [user.equipement]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden />
      <Header title="Equipement" />
      <GradientBackground>
        <View style={styles.container}>
          <Text style={styles.choixEquipement}>Quel est ton matériel ?</Text>
          <View style={styles.buttoncontainer}>
            {equipementsData.map((item) => (
              <View key={item.id} style={styles.allIcons}>
                <TouchableOpacity
                  onPress={() => setEquipement(item.id)}
                  style={[
                    styles.button,
                    equipement === item.id && styles.buttonSelected,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={30}
                    color={equipement === item.id ? "#FFFFFF" : "#6C768F"}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.buttonText,
                    equipement === item.id && { color: "#3B6DED" },
                  ]}
                >
                  {item.id === "Telescope" ? "Telescope" : item.id}
                </Text>
                <TouchableOpacity
                  style={styles.infoBulle}
                  onPress={() => setInfoVisible(item)}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => Observation()}
            style={styles.confirmBtn}
          >
            <Text style={styles.buttonConfirmer}>Confirmer</Text>
          </TouchableOpacity>
          <Modal
            visible={infoVisible !== null}
            transparent
            animationType="fade"
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setInfoVisible(null)}
            >
              {infoVisible && (
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{infoVisible?.id}</Text>
                  <Text style={styles.desc}>{infoVisible?.desc}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Modal>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  buttoncontainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 40,
    borderRadius: 15,
  },

  allIcons: {
    alignItems: "center",
    width: 100,
    gap: 10,
  },

  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  buttonSelected: {
    backgroundColor: "#3B6DED",
    shadowColor: "#5B8CFF",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
  },

  buttonConfirmer: {
    backgroundColor: "#5B8CFF",
    color: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    paddingLeft: 60,
    paddingRight: 60,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  confirmBtn: {
    alignItems: "center",
  },

  icon: {
    fontSize: 30,
    color: "#ffffff",
    marginLeft: 10,
  },

  choixEquipement: {
    color: "#3B6DED",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 60,
    letterSpacing: 3,
  },
  desc: {
    fontSize: 16,
    color: "#ffffff",
    marginTop: 3,
    textAlign: "center",
    letterSpacing: 2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#1A202C",
    padding: 25,
    borderRadius: 25,
    alignItems: "center",
    gap: 10,
    shadowColor: "#5B8CFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(91, 140, 255, 0.2)",
  },
  modalTitle: {
    color: "#3B6DED",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});
