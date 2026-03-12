import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ZoomableImage from "./ZoomableImage";

// Composant carte d'un astre affiché dans l'AstrodexScreen
// Props : name, imageUrl, type, rarity, isCaptured, onDetails

export default function AstroCard(props) {
  // Associe chaque niveau de rareté à une couleur pour la bordure de l'image
  const rarityStyle = {
    Commune: "#22C55E",
    Rare: "#3B82F6",
    Épique: "#A855F7",
    Légendaire: "#FACC15",
  };

  // Sélectionne la couleur selon la rareté via une table de correspondance
  const borderColor = rarityStyle[props.rarity];

  const date = new Date(props.date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <View>
        <ZoomableImage
          imageUrl={props.imageUrl}
          style={[
            styles.image,
            { borderColor: borderColor, borderWidth: 2 },
            !props.isCaptured && { opacity: 0.15 },
          ]}
        />
        {!props.isCaptured && (
          <View style={styles.lockedImage}>
            <Ionicons name="lock-closed" size={32} color="#AAB3C5" />
          </View>
        )}
      </View>

      <View style={styles.container}>
        <Text style={styles.astreName}>{props.name}</Text>
        <Text style={styles.type}>{props.type}</Text>
        <Text style={styles.rarity}>{props.rarity}</Text>
        {props.isCaptured && (
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-clear-outline" size={20} color="#AAB3C5" />
            <Text style={styles.date}>{date}</Text>
          </View>
        )}
      </View>

      {/* Bouton désactivé si l'astre n'est pas encore capturé */}
      <TouchableOpacity
        style={[styles.button, !props.isCaptured && styles.buttonDisabled]}
        activeOpacity={0.8}
        onPress={props.isCaptured ? props.onDetails : null}
        disabled={!props.isCaptured}
      >
        <Text style={styles.buttonText}>Détails</Text>
      </TouchableOpacity>
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
  buttonDisabled: {
    borderColor: "#2a2a2a",
    opacity: 0.3,
  },
  buttonText: {
    color: "#AAB3C5",
    fontFamily: "Inter",
    fontSize: 14,
    textAlign: "center",
  },
  lockedImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 15, 26, 0.85)",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  date: {
    color: "#AAB3C5",
    fontSize: 12,
    fontFamily: "Inter",
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 5,
  },
});
