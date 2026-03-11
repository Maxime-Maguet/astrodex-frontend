import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Animated, //Librairie d'animation React Native
  StyleSheet,
  Dimensions, //Récupération de la taille de l'écran
  Easing, //Adoucir les animations
} from "react-native";

//Récupération de la largeur et de la hauteur de l'écran
const { width, height } = Dimensions.get("window");

//Couleurs inspiration: Nébuleuse d'Orion
const COLORS = ["#FF6B9D", "#C084FC", "#60A5FA", "#FCD34D", "#FFFFFF"];

//Génération d'un tableau d'étoiles avec des propriétés aléatoires
//Fonction appelléé une seule fois en dehors pour éviter les re-renders
const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,                        //Identifiant unique pour le key React
    x: Math.random() * width,    //Position horizontale aléatoire sur l'écran
    y: Math.random() * height,   //Position verticale aléatoire sur l'écran
    size: Math.random() * 3 + 1,  //Taille entre 1 et 4 pixels
    delay: Math.random() * 300,   //Délai avant de commencer à clignoter
    duration: Math.random() * 500 + 500,   //Durée du clignotement entre 500 et 1000ms
    color: COLORS[Math.floor(Math.random() * COLORS.length)],  //Une couleur aléatoire parmi COLORS
  }));
};

//Génère 200 étoiles: avec un stockage en dehors du composant pour ne pas être recréées à chaque render
const STARS = generateStars(200);
//Composant Star: il représente une étoile qui clignote en boucle infinie
function Star({ star }) {
  //useRef pour créer une valeur animée sans déclencher de re-render
  const opacity = useRef(new Animated.Value(0)).current; //Opacité initiale à 0 (invisible)

  useEffect(() => {
    //Fonction récursive qui crée une boucle infinie
    const animate = () => {
      Animated.sequence([
        Animated.delay(star.delay), //Attente avant de démarrer (délai unique par étoile)
        Animated.timing(opacity, {
          toValue: 1,                //Apparition progressive
          duration: star.duration,    //Durée aléatoire
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,      //Utilise le thread natif pour de meilleures performances
        }),
        Animated.timing(opacity, {
          toValue: 0.1,             //Disparition partielle (garder l'étoile visible)
          duration: star.duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => animate());    //Rappelle animate() à la fin pour boucler infiniment
    };
    animate();     //Démarre de l'animation au montage du composant
  }, []);          //[] = s'exécute une seule fois au montage

 //Rendu de l'étoile: un petit cercle coloré
  return (
    <Animated.View
      style={{
        position: "absolute",  //Positionnement libre sur l'écran
        left: star.x,          //Position horizontale
        top: star.y,           //Position verticale
        width: star.size,      //Largeur
        height: star.size,     //Hauteur
        borderRadius: star.size / 2,  //Forme ronde
        backgroundColor: star.color,  //Couleur de l'étoile
        opacity,                      //Opacité animée
      }}
    />
  );
}

//Composant principal LoadingModal
//Props : visible (booléen): contrôle l'affichage de la modale
export default function LoadingModal({ visible }) {
  
  const scaleIcon = useRef(new Animated.Value(1)).current; //Valeur animée pour la taille du logo (commence à 1 = taille normale)
  
  const scaleText = useRef(new Animated.Value(0.8)).current; //Valeur animée pour la taille du texte (commence à 0.8 = légèrement réduit)
  
  const opacityText = useRef(new Animated.Value(1)).current; //Valeur animée pour l'opacité du texte (commence à 1 = visible)

  const [logoReady, setLogoReady] = useState(false); //Attend que le logo soit chargé avant de démarrer l'animation

  // useEffect(() => {
  //   if (visible && logoReady) {  //Démarrage uniquement si visible ET logo chargé
  //     Animated.loop(             //Boucle infinie
  //       Animated.sequence([      //Enchaînement des animations
  //         //Logo pulse, texte discret
  //         Animated.parallel([    //Les animations se jouent en même temps
  //           Animated.sequence([  //Grossissement du logo puis revient à la normale
  //             Animated.timing(scaleIcon, {
  //               toValue: 1.2,    //Logo grossit à 120%
  //               duration: 600,
  //               easing: Easing.inOut(Easing.ease),
  //               useNativeDriver: true,
  //             }),
  //             Animated.timing(scaleIcon, {
  //               toValue: 1,      //Logo revient à 100%
  //               duration: 600,
  //               easing: Easing.inOut(Easing.ease),
  //               useNativeDriver: true,
  //             }),
  //           ]),
  //           Animated.timing(opacityText, {
  //             toValue: 0.8,    //Le texte s'efface légèrement quand le logo pulse
  //             duration: 600,
  //             easing: Easing.inOut(Easing.ease),
  //             useNativeDriver: true,
  //           }),
  //           Animated.timing(scaleText, {
  //             toValue: 0.9,   //Le texte rétrécit quand le logo pulse
  //             duration: 600,
  //             easing: Easing.inOut(Easing.ease),
  //             useNativeDriver: true,
  //           }),
  //         ]),
  //         // texte pulse, logo discret
  //         Animated.parallel([
  //           Animated.sequence([   //Le texte grossit et revient à la normale
  //             Animated.timing(scaleText, {
  //               toValue: 1.2,     //Texte grossit à 120%
  //               duration: 600,
  //               easing: Easing.inOut(Easing.ease),
  //               useNativeDriver: true,
  //             }),
  //             Animated.timing(scaleText, {
  //               toValue: 1,     //Texte revient à 100%
  //               duration: 600,
  //               easing: Easing.inOut(Easing.ease),
  //               useNativeDriver: true,
  //             }),
  //           ]),
  //           Animated.timing(opacityText, {
  //             toValue: 1,     //Texte reprend son opacité
  //             duration: 600,
  //             easing: Easing.inOut(Easing.ease),
  //             useNativeDriver: true,
  //           }),
  //           Animated.timing(scaleIcon, {
  //             toValue: 0.9,    //Rétrécissement léger du logo pendant que le texte pulse
  //             duration: 600,
  //             easing: Easing.inOut(Easing.ease),
  //             useNativeDriver: true,
  //           }),
  //         ]),
  //       ])
  //     ).start();   //Démarrage la boucle
  //   }
  // }, [visible, logoReady]);  //Relance si visible ou logoReady change

  return (
    // Modal React Native, elle s'affiche par-dessus tout le reste
    <Modal visible={visible} transparent animationType="fade">
      {/* Conteneur principal plein écran */}
      <View style={styles.container}>

        {/* Rendu de toutes les étoiles */}
        {STARS.map((star) => (
          <Star key={star.id} star={star} />
        ))}

        {/* Logo pulse, entouré par un Animated.View pour appliquer le scale */}
        <Animated.View style={{ transform: [{ scale: scaleIcon }] }}>
          <Animated.Image
            source={require("../assets/Logo_icon_only.png")}
            style={styles.logo}
            resizeMode="contain"
            onLoad={() => setLogoReady(true)} //Déclenchement du démarrage de l'animation
          />
        </Animated.View>
        {/* Texte AstroDex pulse en alternance avec le logo */}
        <Animated.Image
          source={require("../assets/Logo_text_only.png")}
          style={[
            styles.textLogo,
            {
              transform: [{ scale: scaleText }], //Animation de taille
              opacity: opacityText,              //Animation d'opacité
              tintColor: "#C9A84C",           //Teinte dorée appliquée sur texte Astrodex
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}

//Styles du composant
const styles = StyleSheet.create({
  container: {
    flex: 1,                    //Prend tout l'espace disponible
    backgroundColor: "#0B0F1A", //Fond bleu nuit
    justifyContent: "center",   //Centre verticalement
    alignItems: "center",       //Centre horizontalement
  },
  logo: {
    width: 200,   //Largeur du logo
    height: 200,  //Hauteur du logo
  },
  textLogo: {
    width: 200,    //Largeur du texte
    height: 80,    //Hauteur du texte
    marginTop: 10, //Espace entre le logo et le texte
  },
});