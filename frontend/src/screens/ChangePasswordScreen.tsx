import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/api";
import { showSuccess, showError } from "../utils/toast";

const ChangePasswordScreen = ({ navigation }: any) => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {

        if (!oldPassword || !newPassword || !confirmPassword) {

            showError("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {

            showError("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {

            showError(
                "Password must be at least 6 characters"
            );
            return;
        }

        try {

            setLoading(true);

            const token =
                await AsyncStorage.getItem("token");

            await api.put(
                "/api/users/change-password",
                {
                    oldPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            showSuccess(
                "Password changed successfully"
            );

            navigation.goBack();

        } catch (error: any) {

            const message =
                error?.response?.data ||
                "Failed to change password";

            showError(message);

        } finally {

            setLoading(false);
        }
    };

    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Change Password
            </Text>

            <TextInput
                placeholder="Current Password"
                secureTextEntry
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
            />

            <TextInput
                placeholder="New Password"
                secureTextEntry
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <TextInput
                placeholder="Confirm New Password"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
                style={[
                    styles.button,
                    loading && {
                        opacity: 0.7
                    }
                ]}
                onPress={handleChangePassword}
                disabled={loading}
            >

                {
                    loading ? (
                        <ActivityIndicator
                            color="#FFFFFF"
                        />
                    ) : (
                        <Text style={styles.buttonText}>
                            Change Password
                        </Text>
                    )
                }

            </TouchableOpacity>

        </View>
    );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F5F5F5",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },

    button: {
        backgroundColor: "#2563EB",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});