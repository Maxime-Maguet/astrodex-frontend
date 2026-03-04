import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EquipementSelectionScreen() {
  const Dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [Equipement, setEquipement] = useState("");

  const Equipement_LIMITS = {
    "Oeil nue": { maxMagnitude: 4, label: "Œil nu", xpBonus: 100 }, //Configuration basé sur la magnétude
    Jumelles: { maxMagnitude: 8, label: "Jumelle", xpBonus: 250 },
    "Lunette astronomique": {
      maxMagnitude: 15,
      label: "Télescope",
      xpBonus: 500,
    },
  };

  const Observation = () => {
    if (Equipement === "" || Equipement === undefined) {
      console.log("pas d'équipement selectionné");
      return;
    }

    fetch("http://192.168.1.34:3000/users/updateUser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipement: Equipement, token: user.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          console.log("Succès", data.equipement);

          setEquipement(Equipement);
        } else console.log(" déjà équipé");
      });
  };
  return (
    <Modal>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setEquipement("Oeil nue")}
          style={[
            styles.button,
            Equipement === "Oeil nue" && { backgroundColor: "blue" },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Oeil nue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEquipement("Jumelles")}
          style={[
            styles.button,
            Equipement === "Jumelles" && { backgroundColor: "blue" },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Jumelles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEquipement("Lunette astronomique")}
          style={[
            styles.button,
            Equipement === "Lunette astronomique" && {
              backgroundColor: "blue",
            },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Télescope</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Observation()}>
          <Text style={styles.buttonConfirmer}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </Modal>
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
    width: "70%",

    backgroundColor: "#6C768F",
    padding: 25,
    paddingLeft: 25,

    borderRadius: 8,
    marginTop: 45,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  buttonConfirmer: {
    backgroundColor: "#3B82F6",
    color: "#FFFFFF",
    fontSize: 16,
    alignItems: "center",
    borderRadius: 10,
    width: "70%",
    paddingLeft: 70,
    paddingRight: 70,
    padding: 10,
    marginTop: 30,
  },
});
