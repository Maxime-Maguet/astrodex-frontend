import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../reducers/user";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace("Login");
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Log Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#AAB3C5",
    borderRadius: 5,
  },
  text: {
    color: "#AAB3C5",
    fontFamily: "Inter",
    fontSize: 12,
  },
});