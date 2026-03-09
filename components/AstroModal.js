import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export default function AstroModal(props) {
  const rarityStyle = {
    Commune: { color: "#22C55E", label: "★ COMMUNE" },
    Rare: { color: "#3B82F6", label: "★★ RARE" },
    Épique: { color: "#A855F7", label: "★★★ ÉPIQUE" },
    Légendaire: { color: "#FACC15", label: "★★★★ LÉGENDAIRE" },
  };
  const rarity = rarityStyle[props.infoAstre.rarity_level];

  const astresData = props.infoAstre.stats;

  return (
    <Modal visible={props.visible} animationType="fade" transparent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={props.closeModale}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.containerWrapper}>
          <View style={styles.container}>
            <Text style={[styles.rareté, { color: rarity.color }]}>
              {rarity.label}
            </Text>
            <Text style={styles.name}>{props.infoAstre.name}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: props.infoAstre.imageUrl }}
                style={styles.image}
              />
            </View>

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
                <Text style={styles.statText}>Masse : {astresData.masse}</Text>
              </View>
            </View>

            <ScrollView
              nestedScrollEnabled={true}
              style={{ maxHeight: 100, width: "100%" }}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.description}>
                {props.infoAstre.description}
              </Text>
              <Text style={styles.description}>...</Text>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  containerWrapper: {
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
  image: { width: 160, height: 160, marginBottom: 5 },
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
