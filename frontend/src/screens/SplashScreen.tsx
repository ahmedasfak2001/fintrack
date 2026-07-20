import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

const SplashScreen = ({ navigation }: any) => {
  const [text, setText] = useState("");

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const fullText = "FinTrack";

  useEffect(() => {
    startAnimations();
    typeWriter();
    navigateAfterDelay();
  }, []);

  // 🎬 MAIN ANIMATION SEQUENCE
  const startAnimations = () => {
    // Fade in
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Scale bounce
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();

    // Floating effect loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // ⌨️ Typing effect
  const typeWriter = () => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 120);
  };

  // ⏩ Navigation delay
  const navigateAfterDelay = async () => {

    const token = await AsyncStorage.getItem("token");

    const initialUrl = await Linking.getInitialURL();

    console.log("Initial URL:", initialUrl);

    setTimeout(() => {

      // If app was opened from reset password link
      if (
        initialUrl &&
        initialUrl.includes("reset-password")
      ) {

        const tokenFromUrl =
          initialUrl.split("token=")[1];

        navigation.replace(
          "ResetPassword",
          {
            token: tokenFromUrl,
          }
        );

        return;
      }

      // Normal flow
      if (token) {
        navigation.replace("MainApp");
      } else {
        navigation.replace("Login");
      }

    }, 2800);
  };

  // 🌊 Floating motion
  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <View style={styles.container}>

      {/* Background glow circles */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      {/* Animated logo/text */}
      <Animated.View
        style={[
          styles.centerBox,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: floatTranslate },
            ],
          },
        ]}
      >
        <Text style={styles.logo}>{text}</Text>

        <Text style={styles.tagline}>
          Smart Expense Tracking
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },

  centerBox: {
    alignItems: "center",
  },

  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 2,
  },

  tagline: {
    marginTop: 10,
    fontSize: 14,
    color: "#94A3B8",
  },

  // ✨ Ambient glow effects
  glow1: {
    position: "absolute",
    width: 250,
    height: 250,
    backgroundColor: "#4F46E5",
    borderRadius: 125,
    opacity: 0.15,
    top: 120,
    left: -80,
  },

  glow2: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#22C55E",
    borderRadius: 150,
    opacity: 0.12,
    bottom: 100,
    right: -100,
  },
});

export default SplashScreen;