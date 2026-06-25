import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import api from "../api/api";
import { RegisterRequest } from "../types/RegisterRequest";
import { showError } from "../utils/toast";
import AuthLayout from "../components/AuthLayout";
import { authStyles } from "../styles/authStyles";
import PasswordInput from "../components/PasswordInput";
import { useTheme } from "../theme/useTheme";

const RegisterScreen = ({ navigation }: any) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { theme } = useTheme();

    const validateEmail = (email: string) => {

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(email);
    };

    const handleRegister = async () => {

        try {

            setLoading(true);

            if (name.trim().length < 3) {

                showError(
                    "Username must be at least 3 characters"
                );

                return;
            }

            if (!email.trim()) {

                showError(
                    "Email is required"
                );

                return;
            }

            if (!validateEmail(email)) {

                showError(
                    "Please enter a valid email address"
                );

                return;
            }

            if (password.length < 6) {

                showError(
                    "Password must be at least 6 characters"
                );

                return;
            }

            if (password !== confirmPassword) {

                showError(
                    "Passwords do not match"
                );

                return;
            }

            const request: RegisterRequest = {
                name,
                email,
                password,
            };

            await api.post(
                "/api/users/register",
                request
            );

            Alert.alert(
                "Registration Successful 🎉",
                `We've sent a verification email to:\n\n${email}\n\nPlease verify your email before logging in.`,
                [
                    {
                        text: "Go To Login",
                        onPress: () =>
                            navigation.navigate("Login"),
                    },
                ]
            );

        } catch (error: any) {

            if (error.response?.status === 409) {

                showError(
                    "Email already registered"
                );

            } else {

                showError(
                    "Something went wrong."
                );
            }

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
                Welcome to FinTrack
            </Text>

            <Text
                style={[
                    authStyles.subtitle,
                    {
                        color: theme.secondaryText,
                    },
                ]}
            >
                Track every rupee. Build better habits.
            </Text>

            <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={[
                    authStyles.input,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                    },
                ]}
                placeholderTextColor={theme.secondaryText}
            />

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
            <PasswordInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
            />
            <TouchableOpacity
                style={[
                    authStyles.button,
                    loading && authStyles.disabledButton,
                ]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={authStyles.buttonText}>
                        Create Account
                    </Text>
                )}
            </TouchableOpacity>

            <View style={authStyles.linkContainer}>
                <Text
                    style={[
                        authStyles.linkText,
                        {
                            color: theme.secondaryText
                        }
                    ]}>
                    Already have an account?{" "}
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Login")
                    }
                >
                    <Text style={authStyles.link}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>

        </AuthLayout>
    );
};

export default RegisterScreen;

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