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
  //"Oeil nu": { maxMagnitude: 4, label: "Œil nu", xpBonus: 100 }, //Configuration basé sur la magnétude
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
  return (
    <View style={styles.container}>
      <View style={styles.middlecontainer}>
        <Text style={styles.buttonChoix}>Choisis ton équipement</Text>
        <View style={styles.buttoncontainer}>
          <FontAwesome style={styles.icon} name="eye" />
          <TouchableOpacity
            onPress={() => setEquipement("Oeil nu")}
            style={[
              styles.button,
              equipement === "Oeil nu" && { backgroundColor: "#1A237E" },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Oeil nu</Text>
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
              styles.button , 
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
    backgroundColor: "#0B0F1A",
    padding: 20,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
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
    fontSize: 30,
    color: "#ffffff",
    marginTop: 20,
    paddingLeft: 25,
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
    backgroundColor: "#535252",
    opacity: 20,
    borderRadius: 10,
  },
  buttonChoix: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 30,
    letterSpacing: 5,
    elevation: 15,
  },
  icontelescope: {
    fontSize: 50,
    color: "#ffffff",
    marginTop: 20,
    paddingLeft: 25,
  },
  desc: {
    fontSize: 10,
    color: "#ffffff",
    marginTop: 3,
  },
  middlecontainer: {
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    elevation: 15,
    shadowRadius: 10,
  },
});
