import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AstreCard(props) {
  const isCaptured = props.validatedastre;

  return (
    <View style={styles.card}>
<<<<<<< HEAD
    <Image source={{ uri: props.imageUrl }} style={styles.image} />
      <View style={styles.container}>
        <Text style={styles.astreName}>{props.name}</Text>
      </View>
      {props.validatedastre && (
        <Text style={styles.astreValidated} >Déjà Capturé !</Text> //Props passé pour pouvoir afficher la phrase
      )}
        
=======
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: props.imageUrl }}
          style={[styles.image, !isCaptured && { opacity: 0.35 }]}
        />
        {!isCaptured && (
          <View style={styles.lockedImage}>
            <Ionicons name="lock-closed" size={32} color="#AAB3C5" />
          </View>
        )}
      </View>
      <View style={styles.container}>
        <Text style={styles.astreName}>{props.name}</Text>
      </View>
>>>>>>> dev
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
    position: "relative",
  },

  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
<<<<<<< HEAD
    marginBottom: 5,
=======
>>>>>>> dev
  },

  container: {
    alignItems: "center",
  },

  astreName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
<<<<<<< HEAD
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
=======
    fontFamily: "Inter",
    marginBottom: 5,
  },

  lockedImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11,15,26,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
});
>>>>>>> dev
