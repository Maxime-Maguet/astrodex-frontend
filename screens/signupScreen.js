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

    fetch(`http://192.168.1.22:3000/users/signup`, {
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
      .then(response => response.json())
      .then(data => { console.log(data); if (data.token === true) {
         
        dispatch(login({ token: data.token, username: username }));
} else {
console.log("utilisateur déjà existant.")

}});
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        <Text style={styles.title}>Inscription</Text>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Email"
            onChangeText={value => setEmail(value)}
            value={email}
            style={styles.input}
          />
          <TextInput
            placeholder="username"
            onChangeText={value => setUsername(value)}
            value={username}
            style={styles.input}
          />
          <TextInput
            placeholder="password"
            onChangeText={value => setPassword(value)}
            value={password}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.textButton}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1C20",
    alignItems: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    marginTop: 70,
  },

  button: {
    backgroundColor: "#5B8CFF",
    fontSize: 16,
    alignItems: "center",
    borderRadius: 10,
    width: "85%",
    justifyContent: "center",
    padding: 10,
marginTop: 20,

  },

  input: {
    width: "85%",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    color: "#1A1C20",
  },

  textButton: {
    fontSize: 24,
    color: "#ffffff",
    fontFamily: "Inter",
    borderRadius: 10,
  },

  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
   
  },
});
