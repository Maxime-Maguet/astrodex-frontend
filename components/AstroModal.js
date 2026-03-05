import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";

export default function AstroModal(props) {
  return (
    <Modal visible={props.visible} animationType="fade" transparent>
      <TouchableOpacity
        style={styles.overlay}
        onPress={props.closeModale}
        //pour empécher le fade qui fait saccader la fermeture de la modale
        activeOpacity={1}
      >
        <View
          style={styles.container}
          // permet de ne pas propager la fermeture de l'overlay au enfant et de pouvoir fermer la modale en cliquant à l'exterieur de celle-ci
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <TouchableOpacity onPress={props.closeModale}>
            <FontAwesome name="times" size={16} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.rareté}>
            Rareté : {props.infoAstre.rarity_level}
          </Text>
          <Image
            source={{ uri: props.infoAstre.imageUrl }}
            style={styles.image}
          />
          <Text style={styles.name}>{props.infoAstre.name}</Text>
          <Text style={styles.description}>{props.infoAstre.description}</Text>
        </View>
      </TouchableOpacity>
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
  image: { width: 150, height: 150, marginBottom: 10 },
  name: {
    fontSize: 24,
    color: "#090909",
    fontFamily: "Inter",
  },
  rareté: {
    fontSize: 28,
    color: "#090909",
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  description: {
    fontSize: 16,
    color: "#090909",
    fontFamily: "Inter",
    textAlign: "center",
  },
});
