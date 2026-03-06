import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEquipement } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function EquipementSelectionScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [equipement, setEquipement] = useState("");

  // const Equipement_LIMITS = {
  // "Oeil nue": { maxMagnitude: 4, label: "Œil nu", xpBonus: 100 }, //Configuration basé sur la magnétude
  //Jumelles: { maxMagnitude: 8, label: "Jumelle", xpBonus: 250 },
  //"Lunette astronomique": {
  //maxMagnitude: 15,
  //label: "Télescope",
  //xpBonus: 500,
  //},
  //};

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
        console.log(data);
        if (data) {
          console.log(data.equipement, " Equipement reçu !");

          navigation.navigate("TabNavigator", { screen: "Accueil"})
          dispatch(updateEquipement(data.equipement));
        } else console.log(" déjà équipé");
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.buttonText}>Choisis ton équipement</Text>
      <View style={styles.buttoncontainer}>
        <FontAwesome style={styles.icon} name="eye" />
        <TouchableOpacity
          onPress={() => setEquipement("Oeil nue")}
          style={[
            styles.button,
            equipement === "Oeil nue" && { backgroundColor: "blue" },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Oeil nue</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttoncontainer}>
        <FontAwesome style={styles.icon} name="binoculars" />
        <TouchableOpacity
          onPress={() => setEquipement("Jumelles")}
          style={[
            styles.button,
            equipement === "Jumelles" && { backgroundColor: "blue" },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Jumelles</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttoncontainer}>
        <FontAwesome style={styles.icon} name="Telescope" />
        <TouchableOpacity
          onPress={() => setEquipement("Lunette astronomique")}
          style={[
            styles.button,
            equipement === "Lunette astronomique" && {
              backgroundColor: "blue",
            },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Télescope</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => Observation()} style={styles.confirmBtn}>
        <Text style={styles.buttonConfirmer}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    padding: 20,
    paddingTop: 30,
    justifyContent: "space-between",
    alignItems: "center",
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
    marginTop: 20,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },

  icon: {
    fontSize: 25,
    color: "#ffffff",
    marginTop: 40,
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
  },
});
