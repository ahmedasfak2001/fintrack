import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";

import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoginRequest } from "../types/LoginRequest";
import { AuthResponse } from "../types/AuthResponse";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = () => {
  //   Alert.alert("Login", "Button Clicked");
  // };

  const handleLogin = async () => {
    try {
      const request: LoginRequest = {
        email,
        password,
      };

      const response =
        await api.post<AuthResponse>(
          "/api/users/login",
          request
        );

      await AsyncStorage.setItem(
        "token",
        response.data.token
      );

      const savedToken =
        await AsyncStorage.getItem("token");

      console.log("Stored Token:", savedToken);

      Alert.alert(
        "Success",
        "Login Successful"
      );

      console.log(
        "JWT Token:",
        response.data.token
      );

    } catch (error) {

      Alert.alert(
        "Error",
        "Invalid email or password"
      );

      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FinTrack Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button
        title="Login"
        onPress={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default LoginScreen;