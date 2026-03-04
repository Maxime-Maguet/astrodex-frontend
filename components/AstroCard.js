import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddAstres } from "../reducers/astre";

export default function AstroCard(props) {
  const [astres, setAstres] = useState([]);
  const rarityStyle = {
    Commune: "#22C55E",
    Rare: "#3B82F6",
    Épique: "#A855F7",
    Légendaire: "#FACC15",
  };

  const borderColor = rarityStyle[props.rarity];

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: props.imageUrl }}
        style={[styles.image, { borderColor: borderColor, borderWidth: 2 }]}
      />
      <View style={styles.container}>
        <Text style={styles.astreName}>{props.name}</Text>
        <Text style={styles.description}>{props.description}</Text>
      </View>
      <TouchableOpacity style={styles.button} activeOpacity={0.8} />
      <Text>Détails</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  astreName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: 600,
    fontFamily: "Inter",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#AAB3C5",
    fontFamily: "Inter",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 2,
  },
  card: {
    width: "100%",
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
  container: {
    flex: 1,
    marginLeft: 15,
    flexWrap: "nowrap",
  },

  button: {
    width: "10%",
    height: "20%",
    alignItems: "center",
    paddingTop: 8,
    backgroundColor: "#7C7979",
    borderRadius: 10,
  },
});
