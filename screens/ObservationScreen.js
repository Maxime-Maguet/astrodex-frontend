import { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, StatusBar, Text } from "react-native";
import Header from "../components/Header";
import BoussoleIOS from "../components/CompIos";
import ButtonCapture from "../components/buttonCapture";
import ObservationModal from "../components/observationModal";
import * as NavigationBar from "expo-navigation-bar";
import { useDispatch, useSelector } from "react-redux";
import { addAstre } from "../reducers/astre";
import { updateEquipement } from "../reducers/user";
//import { useFonts } from "expo-font";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ObservationScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  // const handleCapture = () => {
  //   if (!selectedAstre) return;

  const equipement = useSelector((state) => state.user.value.equipement);
  const userToken = useSelector((state) => state.user.value.token);
  const selectedAstre = useSelector((state) => state.astre.astreFocus);
  const capturedAstres = useSelector((state) => state.astre.value);
  const user = useSelector((state) => state.user.value);
<<<<<<< HEAD
  console.log(equipement);
=======

>>>>>>> 9ed835aa5747fc5e89ead81021edff0aa01ff682
  const isAlreadyCaptured = capturedAstres.some(
    (astre) => astre.name === selectedAstre,
  );
  const isAligned = useSelector((state) => state.astre.isAligned);

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

  useEffect(() => {
    if (equipement === undefined || equipement === null) {
      fetch(`${apiUrl}/users/profile/${user.token}`)
        .then((res) => res.json())
        .then((userData) => {
          if (userData.result) {
            const equip = userData.user.equipement;
            dispatch(updateEquipement(equip ?? "Oeil nu"));
          }
        });
    }
  }, []);

  // const [fontsLoaded] = useFonts({
  //   ShuttleX: require("../assets/fonts/SHUTTLE-X.ttf"),
  // });

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ScrollView
        nestedScrollEnabled={true}
        style={{ width: "100%" }}
        contentContainerStyle={styles.scrollContent}
      >
        <Header title="Observation" />
        <Text style={styles.body}>
          Tu utilises comme équipement : {equipement}
        </Text>
        <BoussoleIOS />
        <ButtonCapture
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={handleCapture}
          disabled={!isAligned}
        />
        <ObservationModal visible={modalVisible} closeModal={closeModal} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flex: 1,
    backgroundColor: "#0B0F1A",
  },

  scrollContent: {
    width: "100%",
    alignItems: "center",
  },

  button: {
    alignSelf: "stretch",
    backgroundColor: "#5B8CFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
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
  },
});
