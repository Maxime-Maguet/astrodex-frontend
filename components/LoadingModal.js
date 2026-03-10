import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 300,
    duration: Math.random() * 500 + 500,
  }));
};

const STARS = generateStars(60);

function Star({ star }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(star.delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: star.duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.1,
          duration: star.duration,
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
        backgroundColor: "#FFFFFF",
        opacity,
      }}
    />
  );
}

export default function LoadingModal({ visible }) {
  const rotate = useRef(new Animated.Value(0)).current;

  const scale = useRef(new Animated.Value(1)).current;

useEffect(() => {
  if (visible) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }
}, [visible]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        {STARS.map((star) => (
          <Star key={star.id} star={star} />
        ))}
        <Animated.View style={{ transform: [{ scale }] }}>
  <Animated.Image
    source={require("../assets/Logo_Astrodex_icon.png")}
    style={styles.logo}
    resizeMode="contain"
  />
</Animated.View>
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
    width: 250,
    height: 250,
  },
});