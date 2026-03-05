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
      <TouchableOpacity style={styles.overlay} onPress={props.closeModal}>
        <View style={styles.container}>
          <TouchableOpacity onPress={props.closeModal}>
            <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Image source={{ uri: props.imageUrl }} style={styles.image} />
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.rareté}>{props.rarity}</Text>
          <Text style={styles.description}>{props.description}</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {},
  container: {},
  image: {},
  name: {},
});
