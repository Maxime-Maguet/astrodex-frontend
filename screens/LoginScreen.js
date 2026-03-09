import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch,useSelector } from "react-redux";
import { login } from "../reducers/user";
import { TouchableWithoutFeedback } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false); //Chargement
  const handleSubmit = async () => {
    Keyboard.dismiss(); //fermeture du clavier
    await new Promise(resolve => setTimeout(resolve, 100)); //temps pour que le clavier se ferme

    //reset erreurs
    setUsernameError("");
    setPasswordError("");

    if (!username) {
      setUsernameError("Veuillez saisir votre nom d'utilisateur");
      return;
    }
    if (!password) {
      setPasswordError("Veuillez saisir votre mot de passe");
      return;
    }

     setLoading(true);

fetch(`${apiUrl}/users/signin`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: username, password: password }),
})
  .then((response) => response.json())
  .then((data) => {
    setLoading(false);

     console.log("data signin:", data);
    if (data.result) {
      dispatch(login({ token: data.token, username: username }));
      console.log(data.result, "bien Afficher");
      navigation.replace("TabNavigator");
    } else {
      if (data.error === "Username does not exist") {
        setUsernameError("Nom d'utilisateur introuvable");
      } else if (data.error === "Incorrect password") {
        setPasswordError("Mot de passe incorrect");
      } else {
        setUsernameError("Identifiant ou mot de passe incorrect");
      }
    }
  });
};
  return (
    
    // KeyboardAvoidingView évite de cacher les inputs
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.Gtitle}>
          Explore le ciel et collecte les astres !
        </Text>
        <Text style={styles.title}>Connexion</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#A9A9A9"
          onChangeText={(value) => setUsername(value)}
          value={username}
          style={styles.input}
        />
        {usernameError ? (
        <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}


        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
          value={password}
          style={styles.input}
        />
        {passwordError ? (
         <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

        <TouchableOpacity
  onPress={handleSubmit}
  style={[styles.button, loading && styles.buttonDisabled]}
  disabled={loading}
>
  <Text style={styles.buttonText}>
    {loading ? "Connexion en cours..." : "SE CONNECTER"}
  </Text>
</TouchableOpacity>

        <Text style={styles.Soustitle}>Vous n'avez pas de compte ?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Inscription")}
          style={styles.button1}
        >
          <Text style={styles.buttonSignin}>S'inscrire</Text>
        </TouchableOpacity>
      </ScrollView>
      </TouchableWithoutFeedback>
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
  Soustitle: {
    color: "white",
  },
  buttonSignin: {
    color: "#2f95dc",
    fontWeight: "bold",
  },
  button1: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "transparent",
    width: "50%",
    borderWidth: 1,
    borderColor: "#2f95dc",
  },
  Gtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#FFFFFF",
  },
  errorText: {
  color: "rgba(255, 21, 0, 0.53)",
  fontSize: 13,
  marginBottom: 12,
  alignSelf: "flex-start",
  marginLeft: "7.5%",
},
buttonDisabled: {
  backgroundColor: "#2a4fa3",
  opacity: 0.7,
},
});
