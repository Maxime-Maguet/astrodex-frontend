import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    fetch("http://192.168.1.34:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(login({ token: data.token, username: username }));
          navigation.navigate("TabNavigator");
        } else {
          console.log("Error : ", data.error);
        }
      });
  };

  return (
    // KeyboardAvoidingView évite de cacher les inputs
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Connexion</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#A9A9A9"
          onChangeText={(value) => setUsername(value)}
          value={username}
          style={styles.input}
        />

        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
          value={password}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => handleSubmit()} style={styles.button}>
          <Text style={styles.buttonText}>SE CONNECTER</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1C20" },
  inner: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#FFFFFF",
  },
  input: {
    width: "85%",
    backgroundColor: "#B0B5BC",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    color: "#1A1C20",
  },
  button: {
    backgroundColor: "#3B6DED",
    width: "85%",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});
