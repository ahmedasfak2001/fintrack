import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/api";
import { showError, showSuccess } from "../utils/toast";

import { useTheme } from "../theme/useTheme";
import { COLORS } from "../constants/colors";

const EditProfileScreen = ({
    navigation,
    route,
}: any) => {

    const { theme } = useTheme();

    const { name } = route.params;

    const [userName, setUserName] =
        useState(name);

    const [loading, setLoading] =
        useState(false);

    const handleUpdate = async () => {

        try {

            if (
                userName.trim().length < 3
            ) {

                showError(
                    "Name must be at least 3 characters"
                );

                return;
            }

            setLoading(true);

            const token =
                await AsyncStorage.getItem("token");

            await api.put(
                "/api/users/profile",
                {
                    name: userName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            showSuccess(
                "Profile updated successfully"
            );

            navigation.goBack();

        } catch (error: any) {

            console.log(
                "UPDATE PROFILE ERROR",
                error
            );

            showError(
                error.response?.data?.message ||
                "Failed to update profile"
            );

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
                    👤 Edit Profile
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
                    Update your display name.
                </Text>

                <TextInput
                    value={userName}
                    onChangeText={setUserName}
                    placeholder="Full Name"
                    placeholderTextColor="#94A3B8"
                    style={[
                        styles.input,
                        {
                            borderColor:
                                theme.border,

                            color:
                                theme.text,

                            backgroundColor:
                                theme.background,
                        },
                    ]}
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && {
                            opacity: 0.7,
                        },
                    ]}
                    onPress={handleUpdate}
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
                                Save Changes
                            </Text>

                        )
                    }

                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() =>
                        navigation.goBack()
                    }
                >

                    <Text
                        style={[
                            styles.cancelText,
                            {
                                color:
                                    theme.secondaryText,
                            },
                        ]}
                    >
                        Cancel
                    </Text>

                </TouchableOpacity>

            </View>

        </View>

    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
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
        marginBottom: 20,
        fontSize: 16,
    },

    button: {
        backgroundColor:
            COLORS.primary,

        paddingVertical: 15,

        borderRadius: 12,

        alignItems: "center",
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },

    cancelButton: {
        marginTop: 15,
        alignItems: "center",
    },

    cancelText: {
        fontSize: 15,
        fontWeight: "600",
    },
});