import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function AstroCard(props) {
  //const [isLocked, setIslocked] = useState(!props.isCaptured);

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
        <Text style={styles.type}>{props.type}</Text>
        <Text style={styles.rarity}>{props.rarity}</Text>
      </View>
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Détails</Text>
      </TouchableOpacity>
      {!props.isCaptured && (
        <View style={styles.lockedCard}>
          <Text style={styles.lockedText}>NON CAPTURÉ</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  astreName: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Inter",
    marginBottom: 10,
  },

  rarity: {
    fontSize: 14,
    color: "#AAB3C5",
    fontFamily: "Inter",
  },
  type: {
    fontSize: 14,
    color: "#AAB3C5",
    fontFamily: "Inter",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 2,
  },
  card: {
    position: "relative",
    overflow: "hidden",
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
    width: "20%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#AAB3C5",
    borderRadius: 5,
    marginRight: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#AAB3C5",
    fontFamily: "Inter",
    fontSize: 14,
    textAlign: "center",
  },

  lockedCard: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(58, 58, 58, 0.95)",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedText: {
    fontSize: 14,
    color: "#AAB3C5",
    fontFamily: "Inter",
    fontWeight: "bold",
  },
});
