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

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleSubmit = () => {
    if (email === "" || username === "" || password === "") return;

    if (EMAIL_REGEX.test(email)) {
      dispatch(login(email));
      navigation.replace("TabNavigator", { screen: "observationScreen" });
    } else {
      console.log("Email invalide");
      setEmailError(true);
      return;
    }

    fetch(`${apiUrl}/users/signup`, {
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
        console.log(data);
        if (data.token) {
          dispatch(login({ token: data.token, username: username }));
          navigation.replace("TabNavigator");
        } else {
          // console.log("utilisateur déjà existant.");
        }
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Inscription</Text>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Email"
            onChangeText={(value) => {
              setEmail(value);
              if (emailError) {
                setEmailError(false);
              }
            }}
            value={email}
            style={styles.input}
          />
          {emailError && (
            <Text style={styles.error}>Adresse e-mail non valide</Text>
          )}
          <TextInput
            placeholder="username"
            onChangeText={(value) => setUsername(value)}
            value={username}
            style={styles.input}
          />
          <TextInput
            placeholder="password"
            onChangeText={(value) => setPassword(value)}
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
    backgroundColor: "#0B0F1A",
    alignItems: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 48,
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

  error: {
    fontSize: 16,
    color: "rgba(255, 21, 0, 0.53)",
    fontFamily: "Inter",
  },
});
