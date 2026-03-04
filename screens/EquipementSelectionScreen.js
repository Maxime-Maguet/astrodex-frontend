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
<<<<<<< HEAD
  const Dispatch = useDispatch();
  const [astre, setAstre] = useState(null);
  const [Equipement, setEquipement] = useState("");
=======
    const Dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
 
const [Equipement, setEquipement]= useState('');
>>>>>>> origin/equipement

  const Equipement_LIMITS = {
   "Oeil nue": { maxMagnitude: 4, label: "Œil nu", xpBonus: 100 }, //Configuration basé sur la magnétude
    "Jumelles": { maxMagnitude: 8, label: "Jumelle", xpBonus: 250 },
    "Lunette astronomique": { maxMagnitude: 15, label: "Télescope", xpBonus: 500 },
  };

<<<<<<< HEAD
  const Observation = (equipement) => {
    if (!equipement) {
      console.log("pas d'équipement selectionné");
      return;
    }

    fetch("http://192.168.1.67:3000/users/updateUser", {
=======
  const Observation = () => {
    if(Equipement === ""||Equipement === undefined){
      console.log("pas d'équipement selectionné")
        return; 
    }

    fetch("http://192.168.1.34:3000/users/updateUser", {
>>>>>>> origin/equipement
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipement: Equipement, token: user.token }),
    })
<<<<<<< HEAD
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Succès");
          Dispatch();
          setEquipement(equipement);
        } else console.log("Echec non visible");
      });
  };
=======
    .then((response) => response.json())
   .then((data) => {console.log(data)
    if (data ) {
      console.log("Succès", data.equipement);
      
  setEquipement(Equipement)
    } else console.log(" déjà équipé");
  });
}
>>>>>>> origin/equipement
  return (
    <Modal>
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setEquipement('Oeil nue')}

        style={[styles.button, Equipement === "Oeil nue" && { backgroundColor: 'blue'} ]}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Oeil nue</Text>
        
      </TouchableOpacity>
      <TouchableOpacity
<<<<<<< HEAD
        onPress={() => setEquipement()}
        style={styles.button}
=======
        onPress={() =>setEquipement("Jumelles")}
        style={[styles.button, Equipement === "Jumelles" && { backgroundColor: 'blue'} ]}
>>>>>>> origin/equipement
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Jumelles</Text>
       
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setEquipement("Lunette astronomique")}
        style={[styles.button, Equipement === "Lunette astronomique" && { backgroundColor: 'blue'} ]}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Télescope</Text>
<<<<<<< HEAD
        <Text>
          (Débusquez les astres les plus sombres et les galaxies les plus
          lointaines.)
        </Text>
=======
        
>>>>>>> origin/equipement
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
    paddingLeft : 25,
   
    borderRadius: 8,
    marginTop: 45,
    alignItems: "center",
   
    
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
<<<<<<< HEAD
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonConfirmer: {
    backgroundColor: "#3B6DED",
    width: "85%",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
=======
 
  buttonConfirmer:{
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
  }
>>>>>>> origin/equipement
});
