import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

import { useDispatch } from "react-redux";
import { setAstreFocus } from "../reducers/astre";

export default function AstreSelector({
  visibleBodies,
  currentFocus,
  onSelect,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSelect = (body) => {
    onSelect(body);
    setIsVisible(false);
    dispatch(setAstreFocus(body));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsVisible(!isVisible)}
      >
        <View style={styles.aligner}>
          <Text style={styles.selectedText}>
            {currentFocus && currentFocus !== "..."
              ? currentFocus
              : "Choisissez un astre à viser"}
          </Text>
          <Text style={styles.arrow}>{isVisible ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.dropdownList}>
            <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
              {visibleBodies.length > 0 ? (
                visibleBodies.map((body) => (
                  <TouchableOpacity
                    key={body}
                    style={[
                      styles.item,
                      currentFocus === body && styles.activeItem,
                    ]}
                    onPress={() => handleSelect(body)}
                  >
                    <Text style={styles.itemText}>{body}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noAstre}>Aucun astre visible...</Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    alignItems: "center",
  },
  dropdownButton: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#151C2F",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1D2F49",
    height: 55,
    minWidth: "60%",
  },
  aligner: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  arrow: {
    color: "#5B8CFF",
    fontSize: 12,
    paddingLeft: 10,
  },
  overlay: {
    flex: 1,
  },
  dropdownList: {
    position: "absolute",
    top: 270,
    alignSelf: "center",
    width: "60%",
    backgroundColor: "#151C2F",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1D2F49",
    elevation: 10,
  },

  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1D2F49",
    alignItems: "center",
  },
  activeItem: {
    backgroundColor: "#1D2F49",
  },
  itemText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  noAstre: {
    color: "#ADB5BD",
    padding: 15,
    textAlign: "center",
  },
});
