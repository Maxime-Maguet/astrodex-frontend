import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ObservationModal(props) {
  const [observation, setObservation] = useState(null);
  const navigation = useNavigation();
  const selectedAstre = useSelector((state) => state.astre.astreFocus);

  const rarityStyle = {
    Commune: "#22C55E",
    Rare: "#3B82F6",
    Épique: "#A855F7",
    Légendaire: "#FACC15",
  };

  const textColor = observation
    ? rarityStyle[observation.rarity_level]
    : "#FFFFFF";

  useEffect(() => {
    if (props.visible) {
      fetch(`${apiUrl}/astres`)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);

          const astres = data.astres.find((e) => e.name === selectedAstre);

          setObservation(astres);
        });
    }
  }, [props.visible]);

  return (
    <Modal visible={props.visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {observation && (
            <>
              <Text style={[styles.rarity, { color: textColor }]}>
                {observation.rarity_level}
              </Text>
              <Text style={styles.title}>{observation.name}</Text>
              <Image
                source={{
                  uri: observation.imageUrl,
                }}
                style={styles.image}
              />
              <ScrollView>
                <Text style={styles.description}>
                  {observation.description}
                </Text>
              </ScrollView>
            </>
          )}

          <TouchableOpacity
            onPress={() => {
              props.closeModal();
              navigation.navigate("TabNavigator", { screen: "Astrodex" });
            }}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Astrodex</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#111827",
    alignItems: "center",
    gap: 10,
    borderRadius: 20,
    padding: 25,
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.2)",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },

  title: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "Inter",
    marginBottom: 15,
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    color: "#9CA3AF",
    fontFamily: "Inter",
    textAlign: "center",
  },

  image: {
    width: 160,
    height: 160,
    marginBottom: 10,
    borderRadius: 80,
  },

  button: {
    width: "50%",
    backgroundColor: "#3B82F6",
    borderWidth: 1,
    borderColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  rarity: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
});
