import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import Header from "../components/Header";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import LogoutButton from "../components/LogoutButton";
import * as ImagePicker from "expo-image-picker";
import { addPhoto } from "../reducers/user";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen(route) {
  const [equipement, setEquipement] = useState("rien");
  const [xp, setXp] = useState(0);
  const [name, setName] = useState("");
  const [captured, setCaptured] = useState(0);
  const [astreData, setAstreData] = useState(0);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [modalDecoVisible, setModalDecoVisible] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (isFocused && user.token) {
      fetch(`${apiUrl}/users/profile/${user.token}`)
        .then((res) => res.json())
        .then((userData) => {
          if (userData.result) {
            let name = userData.user.name;
            let xp = userData.user.xp;
            let equip = userData.user.equipement;
            let capture = Number(userData.user.capturedAstres.length);

            setName(name);
            setXp(xp);
            setCaptured(capture);
            if (userData.user.avatar) {
              dispatch(addPhoto(userData.user.avatar));
            }
            if (equip) {
              setEquipement(equip);
            } else {
              setEquipement("Tu n'as pas encore d'équipement !");
            }
          }
        });
    }
  }, [isFocused]);

  useEffect(() => {
    fetch(`${apiUrl}/astres`)
      .then((res) => res.json())
      .then((astresData) => {
        if (astresData.result) {
          setAstreData(Number(astresData.astres.length));
        }
      });
  }, []);

  //calcul du niveau
  let xps = xp;
  let txtNiv = "";
  let niveau = Math.floor(xps / 250); //on arrondi pour avoir un niveau sans virgule.
  if (niveau >= 100) {
    niveau = null;
    txtNiv = "Niveau maximum atteint";
  }

  function captured100() {
    if (captured === astreData) {
      return (
        <Text style={styles.bodyContainerBottom}>
          Tu as attrapé tous les astres. Bravo à toi !
        </Text>
      );
    } else {
      return (
        <Text style={styles.bodyContainerBottom}>
          Tu as attrapé {captured} sur {astreData} astres.
        </Text>
      );
    }
  }

  const takePicture = async () => {
    // Demande la permission d'utiliser la caméra avec ImagePicker
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    // Si l'utilisateur refuse, on arrête
    if (!permission.granted) {
      Alert.alert("Permission caméra requise");
      return;
    }
    // Ouvre la caméra du téléphone
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
      base64: true,
    });
    if (result.canceled) return;

    const photo = result.assets[0];
    if (!photo.base64) {
      Alert.alert("Impossible d'enregistrer la photo");
      return;
    }

    setImage(photo.uri);

    fetch(`${apiUrl}/users/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        photo: photo.base64,
        mimeType: photo.mimeType || "image/jpeg",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result && data.avatar) {
          dispatch(addPhoto(data.avatar));
        } else {
          setImage(null);
          Alert.alert(
            "Impossible d'enregistrer la photo",
            data.error || "Erreur inconnue",
          );
        }
      })
      .catch(() => {
        setImage(null);
        Alert.alert("Impossible d'enregistrer la photo");
      });
  };
  // image de l'avatar par défault
  const defaultAvatar =
    "https://res.cloudinary.com/dlywrsigk/image/upload/v1773055116/Profil_etvtzm.png";

  // on débute avec l'image de profil par défault
  let avatarSource = { uri: defaultAvatar };
  // on vérifie dans le backend si une image est stocké
  if (user.avatar) {
    avatarSource = { uri: user.avatar };
  }
  // si l'utilisateur a pris la photo on la remplace par la nouvelle image
  if (image) {
    avatarSource = { uri: image };
  }

  return (
    <View style={styles.safeArea}>
      <Header title="Profil" />
      <TouchableOpacity onPress={takePicture}>
        <Image style={styles.avatar} source={avatarSource} />
      </TouchableOpacity>
      <TouchableOpacity onPress={takePicture}>
        <Text style={styles.imageText}>Changer d'avatar</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <View style={styles.container}>
          <Text style={styles.bodyContainerTop}>{name}</Text>
          <Text style={styles.bodyContainer1}>
            Ton Niveau : {niveau} {txtNiv}
          </Text>
          <Text style={styles.bodyContainerBottom}>Ton xp total : {xp}</Text>
          <Text>{captured100()}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.container}>
          <Text style={styles.body}>
            Ton équipement :{" "}
            {equipement === "Telescope" ? "Telescope" : equipement}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EquipementSelectionScreen", {
              from: "Profil",
            })
          }
          style={[styles.button]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Changer</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.modalView}>
        <TouchableOpacity
          style={styles.buttonDeco}
          onPress={() => setModalDecoVisible(true)}
        >
          <Text style={styles.text}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalDecoVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ color: "#FFFFFF" }}>
              Veux-tu vraiment te déconnecter?
            </Text>
            <LogoutButton />
            <TouchableOpacity
              style={styles.buttonDeco}
              onPress={() => setModalDecoVisible(false)}
            >
              <Text style={styles.text}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    // paddingTop: 20,
    alignItems: "center",
  },

  imageText: {
    color: "#FFFFFF",

    marginBottom: 25,
  },

  header: {
    alignItems: "center",
    marginTop: 40,
  },

  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 2,
  },

  container: {
    flex: 1,
    marginLeft: 15,
    flexWrap: "nowrap",
  },

  bodyContainerTop: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Inter",
    marginTop: 10,
    marginBottom: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#0B0F1A",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#AAB3C5",
  },

  modal: {
    alignItems: "center",
    width: 200,
    height: 200,
  },

  bodyContainerBottom: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Inter",
    marginBottom: 10,
  },

  bodyContainer1: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Inter",
    marginBottom: 10,
  },

  body: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Inter",
  },

  button: {
    width: "20%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#AAB3C5",
    borderRadius: 5,
    margin: 10,
  },

  card: {
    position: "relative",
    overflow: "hidden",
    width: "90%",
    flexDirection: "row",
    backgroundColor: "#151C2F",
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  buttonText: {
    color: "#AAB3C5",
    fontFamily: "Inter",
    fontSize: 14,
    textAlign: "center",
  },

  subtitle: {
    color: "#5B8CFF",
    fontSize: 14,
  },
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherContainer: {
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  compassContainer: {
    marginBottom: 50,
    width: "100%",
  },

  texteAstres: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  ScrollView: {
    height: 180,
    marginTop: 10,
  },

  astresSection: {
    flex: 1,
    justifyContent: "center",
  },

  buttonDeco: {
    width: 200,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#AAB3C5",
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    color: "#AAB3C5",
    fontFamily: "Inter",
    fontSize: 14,
    textAlign: "center",
  },

  avatar: {
    borderRadius: 100,
    width: 150,
    height: 150,
    marginVertical: 25,
  },
});
