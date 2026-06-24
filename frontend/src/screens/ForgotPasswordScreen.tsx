import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from "react-native";

import api from "../api/api";
import { showError, showSuccess } from "../utils/toast";
import { COLORS } from "../constants/colors";

const ForgotPasswordScreen = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {

        try {

            setLoading(true);

            await api.post(
                "/api/users/forgot-password",
                {
                    email
                }
            );

            showSuccess(
                "Password reset email sent"
            );

        }
        catch (error: any) {
            console.log(
                "FORGOT PASSWORD ERROR",
                error.response?.data
            );

            console.log(
                "STATUS",
                error.response?.status
            );

            showError(
                error.response?.data?.message ||
                JSON.stringify(error.response?.data) ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);   
        }
    };

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Forgot Password
            </Text>

            <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleForgotPassword}
                disabled={loading}
            >

                {
                    loading
                        ? <ActivityIndicator color="#fff" />
                        : (
                            <Text style={styles.buttonText}>
                                Send Reset Link
                            </Text>
                        )
                }

            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center"
    },

    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 20
    },

    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: "center"
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold"
    }
});

export default ForgotPasswordScreen;