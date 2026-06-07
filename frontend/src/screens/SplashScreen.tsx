import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";

import AsyncStorage
from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }: any) => {

  useEffect(() => {

    checkLogin();

  }, []);

  const checkLogin = async () => {

    const token =
      await AsyncStorage.getItem("token");

    if (token) {

      navigation.replace("Dashboard");

    } else {

      navigation.replace("Login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        FinTrack
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
  },
});

export default SplashScreen;