import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// Modal de détails d'un astre -> affichée depuis AstrodexScreen au clic sur "Détails"
// Props : visible, closeModale, infoAstre (objet complet de l'astre)

export default function AstroModal(props) {
  // Associe chaque rareté à une couleur, un label et un nombre d'étoiles
  const rarityStyle = {
    Commune: { color: "#22C55E", label: "COMMUNE", stars: 1 },
    Rare: { color: "#3B82F6", label: " RARE", stars: 2 },
    Épique: { color: "#A855F7", label: " ÉPIQUE", stars: 3 },
    Légendaire: { color: "#FACC15", label: "LÉGENDAIRE", stars: 4 },
  };

  // Récupère le style correspondant à la rareté de l'astre passé en props
  const rarity = rarityStyle[props.infoAstre.rarity_level];

  // Raccourci vers les stats de l'astre (distance, diamètre, masse)
  const astresData = props.infoAstre.stats;

  return (
    <Modal visible={props.visible} animationType="fade" transparent>
      {/* GestureHandlerRootView nécessaire pour que le ScrollView imbriqué fonctionne correctement */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={props.closeModale}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        {/* Wrapper centré — pointerEvents="box-none" permet de cliquer à travers le wrapper sur l'overlay */}
        <View style={styles.containerWrapper}>
          <View style={styles.container}>
            {/* 
  Génère dynamiquement les étoiles selon la rareté :
  - Array(rarity.stars) crée un tableau de N cases vides
  - [...Array()] le transforme en tableau itérable
  - .map() boucle dessus pour afficher une étoile Ionicons par case
*/}
            <View style={styles.rarityLevel}>
              {[...Array(rarity.stars)].map((e, index) => (
                <Ionicons
                  key={index}
                  name="star"
                  size={25}
                  color={rarity.color}
                />
              ))}
              <Text style={[styles.rareté, { color: rarity.color }]}>
                {rarity.label}
              </Text>
            </View>

            {/* Nom de l'astre */}
            <Text style={styles.name}>{props.infoAstre.name}</Text>
            <View style={styles.imageContainer}>
              {/* Image de l'astre */}
              <Image
                source={{ uri: props.infoAstre.imageUrl }}
                style={styles.image}
              />
            </View>
            {/* ScrollView pour les stats + description + lore si le contenu dépasse */}
            <ScrollView
              nestedScrollEnabled={true}
              style={{ maxHeight: 100, width: "100%" }}
              contentContainerStyle={styles.scrollContent}
            >
              {" "}
              {/* Stats techniques de l'astre */}
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statText}>
                    Distance : {astresData.distance}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statText}>
                    Diamètre : {astresData.diametre}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statText}>
                    Masse : {astresData.masse}
                  </Text>
                </View>
                {/* fun fact de l'astre */}
                <Text style={styles.description}>...</Text>
              </View>
              <Text style={styles.description}>
                {props.infoAstre.description}
                {/* Lore narratif de l'astre */}
              </Text>
              <Text style={styles.lore}>{props.infoAstre.lore}</Text>
            </ScrollView>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    // StyleSheet.absoluteFillObject est un raccourci qui applique :
    // position: "absolute", top: 0, left: 0, right: 0, bottom: 0
    // Ça fait occuper à la View toute la surface de son parent
    // Ici ça permet à l'overlay sombre de couvrir tout l'écran derrière la modal
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  containerWrapper: {
    // Même principe — couvre tout l'écran pour centrer la modal dedans
    // pointerEvents="box-none" est géré côté JSX pour laisser les clics
    // passer à travers le wrapper jusqu'à l'overlay
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "box-none",
  },

  container: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#111827",
    alignItems: "center",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.5,
    elevation: 15,
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.2)",
  },
  image: { width: 160, height: 160, marginBottom: 20 },
  name: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Inter",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  rareté: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  statsContainer: {
    paddingBottom: 5,
    gap: 5,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 0,
    gap: 10,
  },

  statText: { fontFamily: "Inter", textAlign: "center", color: "#FFFFFF" },

  rarityLevel: { flexDirection: "row", alignItems: "center", gap: 5 },

  description: {
    fontSize: 16,
    color: "#9CA3AF",
    fontFamily: "Inter",
    textAlign: "center",
  },
  lore: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "justify",
  },
});
