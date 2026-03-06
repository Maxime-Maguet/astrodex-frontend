import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import Header from "../components/Header";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen(route) {
  const [equipement, setEquipement] = useState("rien");
  const [xp, setXp] = useState(0);
  const [name, setName] = useState("");
  const user = useSelector((state) => state.user.value);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

 
  useEffect(() => {
    if (isFocused && user.token) {
      fetch(`${apiUrl}/users/profile/${user.token}`)
        .then((res) => res.json())
        .then((userData) => {
          if (userData.result) {
            console.log("equipement :", userData.user.equipement);
            let name = userData.user.name;
            let xp = userData.user.xp;
            let equip = userData.user.equipement;
            setName(name);
            setXp(xp);
            if (equip) {
              setEquipement(equip);
            } else {
              setEquipement("Tu n'as pas encore d'équipement !");
            }
          }
        });
    }
  }, [isFocused]);
  console.log(equipement);
  //calcul du niveau
  let xps = xp;
  let txtNiv = "";
  let niveau = Math.floor(xps / 1000); //on arrondi exemple: si xp=2500 le math.floor va transfomer le 2.5 en 2
  if (niveau >= 100) {
    niveau = null;
    txtNiv = "Niveau maximum atteint";
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <Header title="Profil" />
      <View style={styles.card}>
        <View style={styles.container}>
          <Text style={styles.bodyContainerTop}>Ton Nom : {name}</Text>
          <Text style={styles.bodyContainer1}>
            Ton Niveau : {niveau} {txtNiv}
          </Text>
          <Text style={styles.bodyContainerBottom}>Ton xp : {xp}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.container}>
          <Text style={styles.body}>Ton équipement : {equipement}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("EquipementSelectionScreen")}
          style={[styles.button]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Changer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  container: {
    flex: 1,
    marginLeft: 15,
    flexWrap: "nowrap",
  },
  bodyContainerTop: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Inter",
    marginTop: 10,
    marginBottom: 10,
  },

  bodyContainerBottom: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Inter",
    marginBottom: 10,
  },

  bodyContainer1: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Inter",
    marginBottom: 10,
  },

  body: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Inter",
  },

  button: {
    width: "20%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#AAB3C5",
    borderRadius: 5,
    margin: 10,
  },

  card: {
    position: "relative",
    overflow: "hidden",
    width: "90%",
    flexDirection: "row",
    backgroundColor: "#151C2F",
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  buttonText: {
    color: "#AAB3C5",
    fontFamily: "Inter",
    fontSize: 14,
    textAlign: "center",
  },

  subtitle: {
    color: "#5B8CFF",
    fontSize: 14,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherContainer: {
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  compassContainer: {
    marginBottom: 50,
    width: "100%",
  },

  texteAstres: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  ScrollView: {
    height: 180,
    marginTop: 10,
  },

  astresSection: {
    flex: 1,
    justifyContent: "center",
  },
});
