import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/api";
import { showSuccess, showError } from "../utils/toast";

import { useTheme } from "../theme/useTheme";
import { COLORS } from "../constants/colors";
import PasswordInput from "../components/PasswordInput";

const ChangePasswordScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
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

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

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

        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
        >

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            theme.card,
                        borderColor:
                            theme.border,
                    },
                ]}
            >

                <Text
                    style={[
                        styles.title,
                        {
                            color:
                                theme.text,
                        },
                    ]}
                >
                    🔒 Change Password
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        {
                            color:
                                theme.secondaryText,
                        },
                    ]}
                >
                    Keep your account secure by updating your password regularly.
                </Text>

                <PasswordInput
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    placeholder="Current Password"

                />

                <PasswordInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"

                />

                <PasswordInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm New Password"

                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && {
                            opacity: 0.7,
                        },
                    ]}
                    onPress={
                        handleChangePassword
                    }
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
                                    styles.buttonText
                                }
                            >
                                Change Password
                            </Text>

                        )
                    }

                </TouchableOpacity>

            </View>

        </View>
    );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },

    card: {
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 22,
    },

    input: {
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
        fontSize: 16,
    },

    button: {
        backgroundColor:
            COLORS.primary,
        paddingVertical: 15,
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