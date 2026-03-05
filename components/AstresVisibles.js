import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

export default function AstreSelector({
  visibleBodies,
  currentFocus,
  onSelect,
}) {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (body) => {
    onSelect(body);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={styles.selectedText}>
          {currentFocus && currentFocus !== "..."
            ? currentFocus
            : "Choisissez un astre à viser"}
        </Text>
        <Text style={styles.arrow}>{isVisible ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {isVisible && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "70%",
    zIndex: 1000,
    marginBottom: 10,
    position: "relative",
    alignItems: "center",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#151C2F",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1D2F49",
    height: 55,
  },
  selectedText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  arrow: {
    color: "#5B8CFF",
    fontSize: 12,
    paddingLeft: 20,
  },
  dropdownList: {
    position: "absolute",
    top: 60,
    backgroundColor: "#151C2F",
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#1D2F49",
    overflow: "hidden",
    zIndex: 2000,
    elevation: 10,
    minWidth: "50%",
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
