import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Image } from "react-native";
export default function ObservationModal(props) {
  const [observation, setObservation] = useState(null);

  useEffect(() => {
    if (props.visible) {
      fetch("http://192.168.1.34:3000/astres")
        .then(response => response.json())
        .then(data => {
          console.log(data);
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
              <Text style={styles.title}>{observation.name}</Text>
              <Text style={styles.description}>{observation.description} </Text>
              <Image
                source={{
                   uri: observation.imageUrl
                }}
                style={styles.image}
              />
            </>
          )}
          <TouchableOpacity onPress={props.closeModal} style={styles.button}>
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
  },
  title: {
    fontSize: 15,
    color: "#0B0F1A",
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  description: {
    fontSize: 15,
    color: "#0B0F1A",
    fontWeight: "bold",
    fontFamily: "Inter",
  },

  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    bordercolor: "red",
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
    color: "#3E63DD",
    fontWeight: "600",
  },
});
