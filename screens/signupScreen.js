import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Image,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GradientImage from "../components/GradientImage";
import { useFocusEffect } from "@react-navigation/native";
export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleSubmit = async () => {
    Keyboard.dismiss(); //fermeture du clavier
    await new Promise((resolve) => setTimeout(resolve, 100)); //temps pour que le clavier se ferme
    // Vérifie si un des champs est vide
    if (email === "" || username === "" || password === "") return;

    // Vérifie si l'email est valide grâce à la REGEX
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Adresse e-mail non valide"); // Active l'état d'erreur pour afficher un message d'erreur dans l'interface
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
        if (data.token) {
          dispatch(
            login({ token: data.token, username: username, xp: data.xp }),
          );
          navigation.replace("EquipementSelectionScreen", { from: "Signup" });
        } else {
          setUsernameError("Utilisateur déjà existant");
        }
      });
  };

  function getIconName() {
    if (passwordVisible) {
      return "eye-off";
    } else {
      return "eye";
    }
  }

  // pour reset l'écran quand on revient dessus
  useFocusEffect(
    React.useCallback(() => {
      setEmail("");
      setPassword("");
      setUsername("");
      setEmailError("");
      setUsernameError("");
    }, []),
  );

  return (
    <View style={{ flex: 1 }}>
      <GradientImage />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Image
            source={require("../assets/Astrodex.png")}
            style={styles.astrodex}
          />
          <Text
            style={[
              styles.titleAstro,
              { fontFamily: "ShuttleX", fontSize: 63 },
            ]}
          >
            Astrodex
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.inner}>
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="rgba(0, 0, 0, 0.50)"
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) {
                  setEmailError("");
                }
              }}
              value={email}
              style={styles.input}
            />
            <TextInput
              placeholder="Pseudo"
              placeholderTextColor="rgba(0, 0, 0, 0.50)"
              onChangeText={(value) => {
                setUsername(value);
                if (usernameError) {
                  setUsernameError("");
                }
              }}
              value={username}
              style={styles.input}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Mot de passe"
                onChangeText={(value) => setPassword(value)}
                placeholderTextColor="rgba(0, 0, 0, 0.50)"
                secureTextEntry={!passwordVisible}
                value={password}
                style={styles.passwordInput}
              />

              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{ paddingRight: 15 }}
              >
                <MaterialCommunityIcons
                  name={getIconName()}
                  size={22}
                  color="#131212"
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.errorText,
                (usernameError || emailError) && styles.errorTextVisible,
              ]}
            >
              {usernameError || emailError || ""}
            </Text>

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.textButton}>S'INSCRIRE</Text>
            </TouchableOpacity>
            <View style={styles.connexionContainer}>
              <Text style={styles.Soustitle}>Vous avez un compte ?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.button1}
              >
                <Text style={styles.buttonSigup}>Retour</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  astrodex: {
    width: 55,
    height: 55,
    marginRight: 10,
  },
  titleAstro: {
    color: "white",
  },

  container: {
    flex: 1,
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 48,
    marginVertical: 35,
  },

  button: {
    backgroundColor: "#3B6DED",
    width: "80%",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  input: {
    width: "80%",
    backgroundColor: "#D9DEE3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    color: "#1A1C20",
  },

  textButton: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  errorText: {
    color: "rgb(255, 73, 57)",
    fontSize: 14,
    minHeight: 30,
    fontFamily: "Inter",
  },

  errorTextVisible: {
    backgroundColor: "rgba(8, 0, 0, 0.43)",
    padding: 4,
    borderRadius: 6,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    backgroundColor: "#D9DEE3",
    borderRadius: 10,
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    padding: 15,
    color: "#1A1C20",
  },

  connexionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
    justifyContent: "center",
  },
  Soustitle: {
    color: "white",
    fontFamily: "Inter",
  },

  button1: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2f95dc",
  },

  buttonSigup: {
    color: "#2f95dc",
    fontWeight: "bold",
  },
});
