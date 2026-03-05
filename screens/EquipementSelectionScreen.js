import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEquipement } from "../reducers/user";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function EquipementSelectionScreen({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [Equipement, setEquipement] = useState("");

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

          dispatch(updateEquipement(data.equipement));
          navigation.navigate("Observation");
          console.log(data.equipement, "Envoi bien l'equipement")

        } else console.log(" déjà équipé");
      });
  };
  return (
  
      <View style={styles.container}>
        <Text style={styles.buttonText}>Choisis ton équipement</Text>
        <View style={styles.buttoncontainer}>
        <FontAwesome style={styles.icon} name='eye' />
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
        </View>
        <View style={styles.buttoncontainer}>
          <FontAwesome  style={styles.icon} name='binoculars' />
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
 </View>
  <View style={styles.buttoncontainer}>
        <FontAwesome style={styles.icon} name='Telescope' />
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
    justifyContent: 'center',
    alignItems : "center"
   
  },
  button: {
    width: "60%",
    flex : "row",
    backgroundColor: "#6C768F",
    padding: 25,
    paddingLeft: 25,
    borderRadius: 8,
    marginTop: 15,
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
    paddingLeft: 100,
    paddingRight: 100,
    alignItems: 'center',
    marginTop: 10,
    marginBottom : 50
  },

 confirmBtn : {
  marginTop: 20,
  alignItems : "center",
  paddingLeft: 20,
  paddingRight: 20,
  },


  icon:{
    fontSize : 25,
    color : "white",
marginTop: 40
  },
  buttoncontainer:{
    flexDirection: 'row', 
    width:"100%",   
    alignItems: 'center',      
    justifyContent: 'space-between', 
    marginBottom: 30,
    padding : 20,
    paddingRight:25,
    paddingLeft: 25,
paddingHorizontal : 20
  },
 
});
