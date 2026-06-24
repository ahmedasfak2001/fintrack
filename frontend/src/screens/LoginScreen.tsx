import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";

import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoginRequest } from "../types/LoginRequest";
import { AuthResponse } from "../types/AuthResponse";
import { COLORS } from "../constants/colors";
import { showError, showSuccess } from "../utils/toast";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (
    email: string
  ) => {

    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!email.trim()) {
        showError(
          "Email is required"
        );
        setLoading(false);
        return;
      }

      if (!validateEmail(email)) {

        showError(
          "Please enter a valid email address"
        );

        return;
      }

      if (!password.trim()) {
        showError(
          "Password is required"
        );

        return;
      }

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
      await AsyncStorage.setItem(
        "userName",
        response.data.name
      );
      const hasLoggedInBefore =
        await AsyncStorage.getItem(
          "hasLoggedInBefore"
        );

      if (!hasLoggedInBefore) {

        await AsyncStorage.setItem(
          "welcomeMessage",
          `Welcome ${response.data.name}`
        );

        await AsyncStorage.setItem(
          "hasLoggedInBefore",
          "true"
        );

      } else {

        await AsyncStorage.setItem(
          "welcomeMessage",
          `Welcome Back ${response.data.name}`
        );
      }


      const savedToken =
        await AsyncStorage.getItem("token");

      console.log("Stored Token:", savedToken);

      showSuccess(
        "Login Successful"
      );
      navigation.replace("MainApp");

      console.log(
        "JWT Token:",
        response.data.token
      );

    } catch (error) {

      showError(
        "Invalid email or password"
      );

      console.error(error);
    } finally {

      setLoading(false);
    }
  };

  return (

    <ImageBackground
      source={require("../assets/register-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>

        <View style={styles.card}>

          <Text style={styles.title}>
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            Login to continue tracking your finances
          </Text>

          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ForgotPassword")
            }
          >
            <Text style={styles.forgotPassword}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {
              loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>
                  Login
                </Text>
              )
            }
          </TouchableOpacity>



          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                "ResendVerification"
              )
            }
          >
            <Text style={styles.resendText}>
              Resend Verification Email
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Register")
              }
            >
              <Text style={styles.registerLink}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>

    </ImageBackground>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor:
      COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 24,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0F172A",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 8,
    marginBottom: 25,
    fontSize: 15,
  },

  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },

  forgotPassword: {
    textAlign: "left",
    color: COLORS.primary,
    marginTop: -10,
    marginLeft: 5,
    fontWeight: "600",
  },

  resendText: {
    textAlign: "center",
    marginTop: 15,
    color: "#64748B",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  registerText: {
    color: "#64748B",
    fontSize: 15,
  },

  registerLink: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default LoginScreen;