import { StyleSheet, Text, View, SafeAreaView } from "react-native";

export default function Header(props) {
  return (
    <SafeAreaView style={styles.safeArea } >
      <View style={styles.container}>
        <Text style={[styles.titre, { fontFamily: "ShuttleX", fontSize: 48 }]} >{props.title}</Text>
      </View> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#0B0F1A",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
    alignItems: "center",
  },
  titre: {
    fontSize: 48,
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "Inter",
  },
});
