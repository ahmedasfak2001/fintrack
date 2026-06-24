import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import {
    useRoute,
    useNavigation
} from "@react-navigation/native";

import api from "../api/api";
import {
    showSuccess,
    showError
} from "../utils/toast";
import { COLORS } from "../constants/colors";

const ResetPasswordScreen = () => {

    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const token = route.params?.token;
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {

        if (!token) {

            showError(
                "Invalid password reset link"
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

        try {
            setLoading(true);
            await api.post(
                "/api/users/reset-password",
                {
                    token,
                    newPassword: password
                }
            );

            showSuccess(
                "Password reset successful"
            );

            navigation.navigate(
                "Login"
            );

        }
        catch (error: any) {
            setLoading(false);
            console.log(
                "RESET PASSWORD ERROR",
                error.response?.data
            );

            console.log(
                "STATUS",
                error.response?.status
            );

            showError(
                error.response?.data?.message ||
                JSON.stringify(error.response?.data) ||
                "Password reset failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Reset Password
            </Text>

            <TextInput
                secureTextEntry
                placeholder="New Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TextInput
                secureTextEntry
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleReset}
            >

                <Text style={styles.buttonText}>
                    Reset Password
                </Text>

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
        textAlign: "center",
        marginBottom: 30
    },

    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 15
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

export default ResetPasswordScreen;