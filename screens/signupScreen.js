import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
export default function SignupScreen() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email === "" || username === "" || password === "") return;

    fetch(`http://192.168.1.6/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(login({ token: data.token, username: data.username }));
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Inscription</Text>
        <TextInput
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          value={email}
          style={styles.inputEmail}
        />
        <TextInput
          placeholder="username"
          onChangeText={(value) => setUsername(value)}
          value={username}
          style={styles.inputUsername}
        />
        <TextInput
          placeholder="password"
          onChangeText={(value) => setPassword(value)}
          value={password}
          style={styles.inputPassword}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.textButton}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  textButton: {
    fontSize: 24,
    color: "#5B8CFF",
    fontFamily: "Inter",
  },

  title: {
    color: "rgb(255, 116, 91)",
    fontSize: 24,
  },

  inputEmail: {
    backgroundcolor: "#ffffff",
    fontSize: 24,
  },
});
