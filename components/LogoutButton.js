import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../reducers/user";
import { clearWeather } from "../reducers/weather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistor } from "../App";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await persistor.purge();
    await AsyncStorage.clear();
    dispatch(logout());
    dispatch(clearWeather());
    navigation.replace("Login");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Se déconnecter</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#AAB3C5",
    borderRadius: 5,
  },
  text: {
    color: "#AAB3C5",
    fontFamily: "Inter",
    fontSize: 14,
    textAlign: "center",
  },
});
