import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  StatusBar,
  Text,
} from "react-native";
import Header from "../components/Header";
import BoussoleIOS from "../components/CompIos";
import BoussoleAndroid from "../components/CompAndroid";
import ButtonCapture from "../components/buttonCapture";
import ObservationModal from "../components/observationModal";
import * as NavigationBar from "expo-navigation-bar";
import { useDispatch, useSelector } from "react-redux";
import { addAstre } from "../reducers/astre";
import { updateEquipement } from "../reducers/user";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ObservationScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [EquipementVu, setEquipementVu] = useState("");
  const dispatch = useDispatch();

  // const handleCapture = () => {
  //   if (!selectedAstre) return;

  const equipement = useSelector((state) => state.user.value.equipement);
  const userToken = useSelector((state) => state.user.value.token);
  const selectedAstre = useSelector((state) => state.astre.astreFocus);
  const capturedAstres = useSelector((state) => state.astre.value);
  const user = useSelector((state) => state.user.value);
  console.log(equipement);
  const isAlreadyCaptured = capturedAstres.some(
    (astre) => astre.name === selectedAstre,
  );

  const handleCapture = () => {
    if (isAlreadyCaptured) {
      navigation.navigate("Astrodex", { astreName: selectedAstre });
      return;
    }
    fetch(`${apiUrl}/astres`)
      .then((res) => res.json())
      .then((astresData) => {
        // console.log(
        //   "Astres BDD:",
        //   astresData.astres.map((a) => `"${a.name}"`),
        // );
        //console.log("selectedAstre:", `"${selectedAstre}"`);
        const astreToCapture = astresData.astres.find(
          (astre) => astre.name === selectedAstre,
        );

        if (!astreToCapture) return;

        fetch(`${apiUrl}/astres/capturer`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            astreId: astreToCapture._id,
            token: userToken,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.result) {
              dispatch(addAstre(astreToCapture));
              dispatch(updateEquipement(data.equipement));
              setModalVisible(true);
            } else {
              console.log("Erreur lors de la capture");
            }
          });
      });
  };

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  function platformOS() {
    if (Platform.OS === "ios") {
      return <BoussoleIOS />;
    } else if (Platform.OS === "android") {
      return <BoussoleIOS />;
    }
  }

  function equip() {
    if (equipement === undefined) {
      fetch(`${apiUrl}/users/profile/${user.token}`)
        .then((res) => res.json())
        .then((userData) => {
          if (userData.result) {
            let equip = userData.user.equipement;

            if (equip) {
              setEquipementVu(equip);
            } else {
              setEquipementVu("Tu n'as pas encore d'équipement !");
            }
          }
        });
      return (
        <Text style={styles.body}>
          Tu utilises comme équipement : {EquipementVu}
        </Text>
      );
    } else {
      return (
        <Text style={styles.body}>
          Tu utilises comme équipement : {equipement}
        </Text>
      );
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {/* <ScrollView
        nestedScrollEnabled={true}
        style={{ width: "100%" }}
        contentContainerStyle={styles.scrollContent}
      > */}
      <Header title="Observation" />
      {equip()}
      {platformOS()}
      <ButtonCapture
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={handleCapture}
      />
      <ObservationModal visible={modalVisible} closeModal={closeModal} />
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },

  scrollContent: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 40,
  },

  button: {
    alignSelf: "stretch",
    backgroundColor: "#5B8CFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
    marginHorizontal: 20,
    minWidth: "90%",
  },

  buttonPressed: {
    backgroundColor: "#3E63DD",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  bodyError: {
    color: "#970000",
    fontSize: 12,
  },
  body: {
    textAlign: "center",
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Inter",
    marginBottom: 10,
  },
});
