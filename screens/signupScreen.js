import { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GradientImage from "../components/GradientImage";
export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleSubmit = () => {
    // Vérifie si un des champs est vide
    if (email === "" || username === "" || password === "") return;

    // Vérifie si l'email est valide grâce à la REGEX
    if (!EMAIL_REGEX.test(email)) {
      setEmailError(true); // Active l'état d'erreur pour afficher un message d'erreur dans l'interface
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
          setUsernameError(true);
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
              placeholder="Pseudo"
              placeholderTextColor="rgba(0, 0, 0, 0.50)"
              onChangeText={(value) => {
                setUsername(value);
                if (usernameError) {
                  setUsernameError(false);
                }
              }}
              value={username}
              style={styles.input}
            />
            {usernameError && (
              <Text style={styles.errorUsername}>
                Utilisateur déjà existant
              </Text>
            )}
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
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.textButton}>S'inscrire</Text>
            </TouchableOpacity>
            <Text style={styles.Soustitle}>Vous avez un compte ?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.button1}
            >
              <Text style={styles.buttonSigup}>Retour</Text>
            </TouchableOpacity>
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

  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  container: {
    flex: 1,
  },

  title: {
    color: "#ffffff",
    fontSize: 48,
    marginVertical: 35,
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
    backgroundColor: "#D9DEE3",
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

  error: {
    fontSize: 16,
    color: "rgba(255, 21, 0, 0.53)",
    fontFamily: "Inter",
  },

  errorUsername: {
    fontSize: 16,
    color: "rgba(255, 21, 0, 0.53)",
    fontFamily: "Inter",
  },

  button1: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "transparent",
    width: "50%",
    borderWidth: 1,
    borderColor: "#2f95dc",
    marginTop: 10,
  },

  buttonSigup: {
    color: "#2f95dc",
    fontWeight: "bold",
  },

  Soustitle: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Inter",
    marginVertical: 20,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    backgroundColor: "#D9DEE3",
    borderRadius: 10,
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    padding: 15,
    color: "#1A1C20",
  },

  image: {
    alignItems: "center",
    marginVertical: 35,
  },
});
