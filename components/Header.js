import { StyleSheet, Text, View,} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function Header(props) {

const insets = useSafeAreaInsets();


  return (
    <View style={styles.safeArea}>
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <Text style={[styles.titre, { fontFamily: "ShuttleX", fontSize: 48 }]}>
          {props.title}
        </Text>
      </View>
   </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#0B0F1A",
  },
  container: {
    paddingHorizontal: 20,
    
    paddingBottom: 20,
    alignItems: "center",
  },
  titre: {
    fontSize: 48,
    color: "#FFFFFF",
    // fontWeight: "bold",
    // fontFamily: "Inter",
  },
});
