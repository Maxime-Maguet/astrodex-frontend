import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../reducers/user";

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // navigation.replace(login);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Log Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter",
  },
});