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

export default function ObservationModal(props) {
  const [observation, setObservation] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    if (props.visible) {
<<<<<<< HEAD
      fetch("http://192.168.1.6:3000/astres")
=======
      fetch("http://192.168.1.67:3000/astres")
>>>>>>> dev
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          //   console.log(data.astres);

          setObservation(data.astres[0]);
        });
    }
  }, [props.visible]);

  return (
    <Modal visible={props.visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {observation && (
            <>
              <Image
                source={{
                  uri: observation.imageUrl,
                }}
                style={styles.image}
              />
              <Text style={styles.title}>{observation.name}</Text>

              <Text style={styles.rarity}>{observation.rarity_level}</Text>

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
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#090909",
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  description: {
    fontSize: 15,
    color: "#090909",
    fontWeight: "bold",
    fontFamily: "Inter",
    backgroundColor: "#D9DEE3",
    borderRadius: 10,
    textAlign: "center",
  },

  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },

  button: {
    width: "100%",
    backgroundColor: "#5B8CFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  rarity: {
    fontSize: 28,
    color: "#090909",
    fontWeight: "bold",
    fontFamily: "Inter",
  },
});
