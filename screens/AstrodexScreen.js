import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddAstres } from "../reducers/astre";
import AstroCard from "../components/AstroCard";
import Header from "../components/Header";
import AstroModal from "../components/AstroModal";

export default function AstrodexScreen() {
  const [astres, setAstres] = useState([]);
  const [astresCapture, setAstresCapture] = useState([]);
  const [showCapturedOnly, setShowCapturedOnly] = useState(false);
  const [selectedAstre, SetSelectedAstre] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleSwitch = () =>
    setShowCapturedOnly((previsousState) => !previsousState);

  const handleDetails = (astre) => {
    SetSelectedAstre(astre);
    setModalVisible(true);
  };

  const userToken = "yT4UH_beP7aLhzeTatho7gMOZJDIDy4D";

  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://192.168.1.6:3000/astres")
      .then((res) => res.json())
      .then((astresData) => {
        //console.log(astresData.astres[0].name);
        if (astresData.result) {
          setAstres(astresData.astres);
          dispatch(AddAstres(astresData.astres));
        }
      });
  }, []);

  useEffect(() => {
    fetch(`http://192.168.1.6:3000/users/profile/${userToken}`)
      .then((res) => res.json())
      .then((userData) => {
        if (userData.result) {
          console.log("capturedAstres raw :", userData.user.capturedAstres);
          setAstresCapture(userData.user.capturedAstres);
        }
      });
  }, []);
  //console.log(astresCapture);
  //console.log("tous les astres : ", astres[0]);
  //console.log("astres capturés: ", astresCapture[0]);

  const filteredAstres = astres.filter((astre) => {
    if (showCapturedOnly) {
      return astresCapture.some((e) => e._id === astre._id);
    } else {
      return true;
    }
  });

  const astresList = filteredAstres.map((data, i) => {
    //console.log(data.rarity_level);

    const isCaptured = astresCapture.some((astre) => astre._id === data._id);
    return (
      <AstroCard
        key={data._id}
        name={data.name}
        description={data.description}
        imageUrl={data.imageUrl}
        rarity={data.rarity_level}
        type={data.type}
        isCaptured={isCaptured}
        onDetails={() => handleDetails(data)}
      />
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="AstroDex" />
      <View style={styles.toggleContainer}>
        <Switch
          trackColor={{ false: "#767577", true: "#767577" }}
          thumbColor={showCapturedOnly ? "#5B8CFF" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={showCapturedOnly}
        />
        <Text style={styles.toggleText}>Mes captures</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {astresList}
      </ScrollView>
      <AstroModal></AstroModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  toggleText: {
    color: "#AAB3C5",
    marginLeft: 10,
  },
});
