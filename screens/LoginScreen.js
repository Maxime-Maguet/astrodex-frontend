import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";
import { TouchableWithoutFeedback } from "react-native";
import GradientImage from "../components/GradientImage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false); //Chargement
  const token = useSelector((state) => state.user?.value?.token);

  useEffect(() => {
    if (token) {
      navigation.replace("TabNavigator");
    }
  }, []);

  const handleSubmit = async () => {
    Keyboard.dismiss(); //fermeture du clavier
    await new Promise((resolve) => setTimeout(resolve, 100)); //temps pour que le clavier se ferme

    //reset erreurs

    setLoginError("");

    if (!username || !password) {
      setLoginError("Veuillez remplir tous les champs");
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

        if (data.result) {
          dispatch(
            login({
              token: data.token,
              username: username,
              xp: data.xp,
              avatar: data.avatar,
              equipement: data.equipement,
            }),
          );

          navigation.replace("TabNavigator");
        } else {
          if (data.error) {
            setLoginError("Identifiant ou mot de passe incorrect");
          }
        }
      });
  };
  // pour reset l'écran quand on revient dessus
  useFocusEffect(
    React.useCallback(() => {
      setPassword("");
      setUsername("");
      setLoginError("");
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
        <Text style={styles.slogan}>
          Explore le ciel et collecte les astres !
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.formulaire}>
              <TextInput
                placeholder="Pseudo"
                placeholderTextColor="rgba(0, 0, 0, 0.50)"
                onChangeText={(value) => setUsername(value)}
                value={username}
                style={styles.input}
              />

              <TextInput
                placeholder="Mot de passe"
                placeholderTextColor="rgba(0, 0, 0, 0.50)"
                secureTextEntry={true}
                onChangeText={(value) => setPassword(value)}
                value={password}
                style={styles.input}
              />

              <Text
                style={[
                  styles.errorText,
                  loginError && styles.errorTextVisible,
                ]}
              >
                {loginError || ""}
              </Text>

              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.button, loading && styles.buttonDisabled]}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Connexion en cours..." : "SE CONNECTER"}
                </Text>
              </TouchableOpacity>
              <View style={styles.connexionContainer}>
                <Text style={styles.Soustitle}>
                  Vous n'avez pas de compte ?
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Inscription")}
                  style={styles.button1}
                >
                  <Text style={styles.buttonSignin}>S'inscrire</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  container: {
    flex: 1,
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

  slogan: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
  },

  formulaire: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "80%",
    backgroundColor: "#D9DEE3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    color: "#1A1C20",
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
  button: {
    backgroundColor: "#3B6DED",
    width: "80%",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  buttonDisabled: {
    backgroundColor: "#2a4fa3",
    opacity: 0.7,
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
  buttonSignin: {
    color: "#2f95dc",
    fontWeight: "bold",
  },
});
