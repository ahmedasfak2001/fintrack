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
import { Ionicons } from "@expo/vector-icons";

import { LoginRequest } from "../types/LoginRequest";
import { AuthResponse } from "../types/AuthResponse";
import { showError, showSuccess } from "../utils/toast";
import AuthLayout from "../components/AuthLayout";
import { authStyles } from "../styles/authStyles";
import PasswordInput from "../components/PasswordInput";
import { useTheme } from "../theme/useTheme";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

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
    <AuthLayout>

      <Text
        style={[
          authStyles.title,
          {
            color: theme.text,
          },
        ]}
      >
        Welcome Back
      </Text>

      <Text
        style={[
          authStyles.subtitle,
          {
            color: theme.secondaryText,
          },
        ]}
      >
        Login to continue tracking your finances
      </Text>

      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        style={[
          authStyles.input,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholderTextColor={theme.secondaryText}
        autoCapitalize="none"
      />

      <PasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ForgotPassword")
        }
      >
        <Text style={[
          authStyles.link,
          {
            marginTop: -15,
            paddingBottom: 5,
          }
        ]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          authStyles.button,
          loading && authStyles.disabledButton,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        {
          loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={authStyles.buttonText}>
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
        <Text
          style={[
            authStyles.linkText,
            {
              color: theme.secondaryText,
              textAlign: "center",
              marginTop: 15,
            }
          ]}>
          Resend Verification Email
        </Text>
      </TouchableOpacity>

      <View style={authStyles.linkContainer}>

        <Text
          style={[
            authStyles.linkText,
            {
              color: theme.secondaryText,
            },
          ]}
        >
          Don't have an account?{" "}
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Register")
          }
        >
          <Text style={authStyles.link}>
            Create Account
          </Text>
        </TouchableOpacity>

      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
});

export default LoginScreen;