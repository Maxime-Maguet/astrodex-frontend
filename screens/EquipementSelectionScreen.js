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
import { useDispatch } from "react-redux";

export default function EquipementSelectionScreen() {
    const Dispatch = useDispatch();
 
const [Equipement, setEquipement]= useState('');

  const Equipement_LIMITS = {
    EYE: { maxMagnitude: 4, label: "Œil nu", xpBonus: 100 }, //Configuration basé sur la magnétude
    BINOCULARS: { maxMagnitude: 8, label: "Jumelles", xpBonus: 250 },
    TELESCOPE: { maxMagnitude: 15, label: "Télescope", xpBonus: 500 },
  };

  const Observation = (equipement) => {
    if(!equipement){
      console.log("pas d'équipement selectionné")
        return; 
    }
    
    fetch("http://192.168.1.34:3000/users/updateUser", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({equipement : Equipement, token : user.token }),
    })
    .then((response) => response.json())
   .then((data) => {
    if (data.result ) {
      console.log("Succès", data.equipement);
      Dispatch()
      setEquipement(equipement)
    } else console.log("Echec non visible");
  });
}
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setEquipement()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Oeil nue</Text>
        <Text>
          (Idéal pour observer les planètes les plus proches visible à l'oeil
          nu)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>setEquipement()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Jumelles</Text>
        <Text>(Idéal pour les amas d'étoiles et les planètes lointaines)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setEquipement()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Télescope</Text>
        <Text>
          (Débusquez les astres les plus sombres et les galaxies les plus lointaines.)
        </Text>
      </TouchableOpacity>
<TouchableOpacity onPress={() => Observation()}>
      <Text style={styles.buttonConfirmer}>Confirmer</Text>
        </TouchableOpacity>
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
    backgroundColor: "#8a8b8e",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonConfirmer:{
      backgroundColor: "#3B6DED",
    width: "85%",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  }
});
