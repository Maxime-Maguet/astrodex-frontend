import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEquipement } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function EquipementSelectionScreen({ navigation }) {
  const route = useRoute();
  //const Equipement_LIMITS = {
  //"Oeil nue": { maxMagnitude: 4, label: "Œil nu", xpBonus: 100 }, //Configuration basé sur la magnétude
  //"Jumelles": { maxMagnitude: 8, label: "Jumelle", xpBonus: 250 },
  //"Lunette astronomique": {
  //maxMagnitude: 15,
  //label: "Télescope",
  //xpBonus: 500,
  //},

  //};

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [equipement, setEquipement] = useState("");

  const Observation = () => {
    if (equipement === "" || equipement === undefined) {
      console.log("pas d'équipement selectionné");
      return;
    }

    fetch(`${apiUrl}/users/updateUser`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipement: equipement, token: user.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        if (data) {
          console.log(data.equipement, " Equipement reçu !");

          navigation.navigate("TabNavigator", { screen: "Acceuil" });

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
  return (
    <View style={styles.container}>
      <View style={styles.middlecontainer}>
        <Text style={styles.buttonChoix}>Choisis ton équipement</Text>
        <View style={styles.buttoncontainer}>
          <FontAwesome style={styles.icon} name="eye" />
          <TouchableOpacity
            onPress={() => setEquipement("Oeil nue")}
            style={[
              styles.button,
              equipement === "Oeil nue" && { backgroundColor: "#1A237E" },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Oeil nue</Text>
            <Text style={styles.desc}>
              Parfait pour apprendre à lire les constellations et repérer les
              planètes les plus brillantes.
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttoncontainer}>
          <FontAwesome style={styles.icon} name="binoculars" />
          <TouchableOpacity
            onPress={() => setEquipement("Jumelles")}
            style={[
              styles.button,
              equipement === "Jumelles" && { backgroundColor: "#1A237E" },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Jumelles</Text>
            <Text style={styles.desc}>
              L'équilibre idéal pour explorer les champs étoilés et les amas
              ouverts.
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttoncontainer}>
          <Ionicons name="telescope" style={styles.icontelescope} />
          <TouchableOpacity
            onPress={() => setEquipement("Lunette astronomique")}
            style={[
              styles.button,
              equipement === "Lunette astronomique" && {
                backgroundColor: "#1A237E",
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Télescope</Text>
            <Text style={styles.desc}>
              Débusquez les astres les plus sombres et les galaxies les plus
              lointaines.
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => Observation()}
          style={styles.confirmBtn}
        >
          <Text style={styles.buttonConfirmer}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#172342",
    padding: 20,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  button: {
    width: "60%",
    flex: "row",
    backgroundColor: "#6C768F",
    padding: 25,
    paddingLeft: 25,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
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
    marginTop: -15,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  icon: {
    fontSize: 25,
    color: "#ffffff",
    marginTop: 30,
    paddingLeft: 35,
  },
  buttoncontainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    padding: 20,
    paddingRight: 25,
    paddingLeft: 25,
    paddingHorizontal: 20,
    gap: 10,
    backgroundColor: "rgba(251, 217, 219, 0.10)",

    borderRadius: 10,
  },
  buttonChoix: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 40,
  },
  icontelescope: {
    fontSize: 40,
    color: "#ffffff",
    marginTop: 40,
    paddingLeft: 35,
  },
  desc: {
    fontSize: 10,
    color: "#ffffff",
    marginTop: 3,
  },
  middlecontainer: {},
});
