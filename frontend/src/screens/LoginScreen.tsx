import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoginRequest } from "../types/LoginRequest";
import { AuthResponse } from "../types/AuthResponse";
import { COLORS } from "../constants/colors";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleLogin = () => {
  //   Alert.alert("Login", "Button Clicked");
  // };

  const handleLogin = async () => {
    try {
      setLoading(true);
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
        //  "invalid-token-test"
      );

      const savedToken =
        await AsyncStorage.getItem("token");

      console.log("Stored Token:", savedToken);

      // Alert.alert(
      //   "Success",
      //   "Login Successful"
      // );

      navigation.replace("Dashboard");

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
    } finally {

      setLoading(false);
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

      {/* <Button
        title="Login"
        onPress={handleLogin}
      /> */}

      <TouchableOpacity
        style={[
          styles.loginButton,
          loading &&
          styles.loginButtonDisabled,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {
            loading
              ? "Signing In..."
              : "Login"
          }
        </Text>
      </TouchableOpacity>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Create Account"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
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
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;