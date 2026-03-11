import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AstreCard(props) {
  const isCaptured = props.validatedastre;

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.card}>
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
      </View>
    </TouchableOpacity>
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
  },

  container: {
    alignItems: "center",
  },

  astreName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
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
