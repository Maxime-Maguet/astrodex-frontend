import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddAstres } from "../reducers/astre";
import AstroCard from "../components/AstroCard";
import Header from "../components/Header";

export default function AstrodexScreen() {
  const [astres, setAstres] = useState([]);

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

  const astresList = astres.map((data, i) => {
    console.log(data.rarity_level);

    return (
      <AstroCard
        key={i}
        name={data.name}
        description={data.description}
        imageUrl={data.imageUrl}
        rarity={data.rarity_level}
        type={data.type}
      />
    );
  });
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="AstroDex" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {astresList}
      </ScrollView>
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
});
