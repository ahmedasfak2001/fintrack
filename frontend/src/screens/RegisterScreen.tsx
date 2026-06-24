import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ImageBackground,
} from "react-native";

import api from "../api/api";
import { RegisterRequest } from "../types/RegisterRequest";
import { COLORS } from "../constants/colors";
import { showError } from "../utils/toast";

const RegisterScreen = ({ navigation }: any) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

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

        <ImageBackground
            source={require("../assets/register-bg.png")}
            style={styles.background}
            resizeMode="cover"
        >

            <View style={styles.overlay}>

                <View style={styles.card}>

                    <Text style={styles.title}>
                        Welcome to FinTrack
                    </Text>

                    <Text style={styles.subtitle}>
                        Track every rupee. Build better habits.
                    </Text>

                    <TextInput
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor="#94A3B8"
                    />

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
                        style={[
                            styles.registerButton,
                            loading &&
                            styles.disabledButton,
                        ]}
                        onPress={handleRegister}
                        disabled={loading}
                    >

                        {
                            loading ? (

                                <ActivityIndicator
                                    color="#FFFFFF"
                                />

                            ) : (

                                <Text
                                    style={
                                        styles.registerButtonText
                                    }
                                >
                                    Create Account
                                </Text>

                            )
                        }

                    </TouchableOpacity>

                    <View style={styles.loginContainer}>

                        <Text style={styles.loginText}>
                            Already have an account?{" "}
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("Login")
                            }
                        >

                            <Text style={styles.loginLink}>
                                Login
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>

            </View>

        </ImageBackground>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({

    background: {
        flex: 1,
    },

    overlay: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },

    card: {
        backgroundColor:
            "rgba(255,255,255,0.94)",
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

    registerButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
    },

    disabledButton: {
        opacity: 0.7,
    },

    registerButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 22,
    },

    loginText: {
        color: "#64748B",
        fontSize: 15,
    },

    loginLink: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: "bold",
    },
});