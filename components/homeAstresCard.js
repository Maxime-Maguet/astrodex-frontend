import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

export default function AstreCard( props ) {
  return (
    <View style={styles.card}>
    
      <Image source={{ uri: props.imageUrl }} style={styles.image} />
      <View style={styles.container}>
        <Text style={styles.astreName}>{props.name}</Text>
        <Text style={styles.description}>{props.description}</Text>
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
    width: 100,
    height: 100,
    borderRadius: 60, 
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
  },

  description: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
  },
});
