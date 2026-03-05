import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function SkyCard({ temp, clouds, clartePercent, message }) {
  const isObservable = clouds <= 70;

  return (
    <View style={styles.card}>
      
      <View style={styles.left}>
        <View style={styles.headerRow}>
          <FontAwesome name="map-marker" size={11} color="#AAB3C5" />
          <Text style={styles.headerLabel}>AUJOURD'HUI</Text>
        </View>
        <Text style={styles.title}>Ciel</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      
      <View style={styles.right}>

        
        <View style={styles.dataRow}>
          <Text style={styles.value}>{clartePercent}%</Text>
          <FontAwesome name="eye" size={18} color="#FFFFFF" />
        </View>

        <View style={styles.divider} />

    
        <View style={styles.dataRow}>
          <Text style={styles.value}>{clouds}%</Text>
          <FontAwesome name="cloud" size={18} color="#FFFFFF" />
        </View>

        <View style={styles.divider} />

    
        <View style={styles.dataRow}>
          <Text style={styles.value}>{temp}°C</Text>
          <FontAwesome name="sun-o" size={18} color="#FFFFFF" />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  left: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerLabel: {
    fontSize: 11,
    color: "#AAB3C5",
    letterSpacing: 1.5,
    fontFamily: "Inter",
  },
  title: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "Inter",
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: "#AAB3C5",
    fontFamily: "Inter",
    lineHeight: 18,
  },
  right: {
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 4,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
  },
  value: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Inter",
    fontWeight: "500",
    minWidth: 55,
    textAlign: "right",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});