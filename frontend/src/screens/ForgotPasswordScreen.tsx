import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import api from "../api/api";
import { showError, showSuccess } from "../utils/toast";
import { COLORS } from "../constants/colors";
import AuthLayout from "../components/AuthLayout";

const ForgotPasswordScreen = ({ navigation }: any) => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {

        try {

            setLoading(true);

            await api.post(
                "/api/users/forgot-password",
                { email }
            );

            showSuccess(
                "Password reset email sent"
            );

        } catch (error: any) {

            console.log(
                "FORGOT PASSWORD ERROR",
                error.response?.data
            );

            showError(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <AuthLayout>

                <Text style={styles.title}>
                    Forgot Password
                </Text>

                <Text style={styles.subtitle}>
                    Enter your registered email address and we'll send you a password reset link.
                </Text>

                <TextInput
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && styles.disabledButton
                    ]}
                    onPress={handleForgotPassword}
                    disabled={loading}
                >

                    {
                        loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>
                                Send Reset Link
                            </Text>
                        )
                    }

                </TouchableOpacity>

                <View style={styles.backContainer}>

                    <Text style={styles.backText}>
                        Remember your password?{" "}
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("Login")
                        }
                    >
                        <Text style={styles.backLink}>
                            Login
                        </Text>
                    </TouchableOpacity>

                </View>

        </AuthLayout>

    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({

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
        lineHeight: 22,
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

    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },

    disabledButton: {
        opacity: 0.7,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    backContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 25,
    },

    backText: {
        color: "#64748B",
        fontSize: 15,
    },

    backLink: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: "bold",
    },
});