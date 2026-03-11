import { View, Text, StyleSheet, Image } from "react-native";

export default function AstreCard(props) {
  return (
    <View style={styles.card}>
    <Image source={{ uri: props.imageUrl }} style={styles.image} />
      <View style={styles.container}>
        <Text style={styles.astreName}>{props.name}</Text>
      </View>
      {props.validatedastre && (
        <Text style={styles.astreValidated} >Déjà Capturé !</Text> //Props passé pour pouvoir afficher la phrase
      )}
        
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
    marginBottom: 5,
  },

  container: {
    alignItems: "center",
  },

  astreName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    fontFamily: "Inter",
    marginTop : -10,
  },
  astreValidated : {
  fontSize: 13,
  color: "white",
  fontWeight: "bold",
  marginTop : -15,
  }
  });
