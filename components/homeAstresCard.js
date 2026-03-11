import { View, Text, StyleSheet, Image } from "react-native";

export default function AstreCard(props) {
  return (
    <View style={styles.card}>
      {props.validatedastre && (
        <Text style={styles.astreValidated} >Déjà Capturé !</Text> //Props passé pour pouvoir afficher la phrase
      )}
      <Image source={{ uri: props.imageUrl }} style={styles.image} />
      <View style={styles.container}>
        <Text style={styles.astreName}>{props.name}</Text>
      </View>
      
      
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0B0F1A",
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: "center",
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },

  container: {
    alignItems: "center",
  },

  astreName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    fontFamily: "Inter",
  },
  astreValidated : {
  fontSize: 15,
  color: "white",
  fontWeight: "bold",
  marginTop : -25,
  }
  });
