import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
} from "react-native";

const { width, height } = Dimensions.get("window");

const COLORS = ["#FF6B9D", "#C084FC", "#60A5FA", "#FCD34D", "#FFFFFF"];

const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 300,
    duration: Math.random() * 500 + 500,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
};

const STARS = generateStars(200);

function Star({ star }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(star.delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: star.duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.1,
          duration: star.duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: star.x,
        top: star.y,
        width: star.size,
        height: star.size,
        borderRadius: star.size / 2,
        backgroundColor: star.color,
        opacity,
      }}
    />
  );
}

export default function LoadingModal({ visible }) {
  const scaleIcon = useRef(new Animated.Value(1)).current;
  const scaleText = useRef(new Animated.Value(0.8)).current;
  const opacityText = useRef(new Animated.Value(1)).current;
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    if (visible && logoReady) {
      Animated.loop(
        Animated.sequence([
          // logo pulse, texte discret
          Animated.parallel([
            Animated.sequence([
              Animated.timing(scaleIcon, {
                toValue: 1.2,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(scaleIcon, {
                toValue: 1,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(opacityText, {
              toValue: 0.8,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(scaleText, {
              toValue: 0.9,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          // texte pulse, logo discret
          Animated.parallel([
            Animated.sequence([
              Animated.timing(scaleText, {
                toValue: 1.2,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(scaleText, {
                toValue: 1,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(opacityText, {
              toValue: 1,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(scaleIcon, {
              toValue: 0.9,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }
  }, [visible, logoReady]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        {STARS.map((star) => (
          <Star key={star.id} star={star} />
        ))}
        <Animated.View style={{ transform: [{ scale: scaleIcon }] }}>
          <Animated.Image
            source={require("../assets/Logo_icon_only.png")}
            style={styles.logo}
            resizeMode="contain"
            onLoad={() => setLogoReady(true)}
          />
        </Animated.View>
        <Animated.Image
          source={require("../assets/Logo_text_only.png")}
          style={[
            styles.textLogo,
            {
              transform: [{ scale: scaleText }],
              opacity: opacityText,
              tintColor: "#C9A84C",
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  textLogo: {
    width: 200,
    height: 80,
    marginTop: 10,
  },
});