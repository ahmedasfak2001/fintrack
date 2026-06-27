import React, { useState } from "react";

import {
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

import api from "../api/api";
import AuthLayout from "../components/AuthLayout";
import { authStyles } from "../styles/authStyles";
import { showError, showSuccess } from "../utils/toast";

const EditProfileScreen = ({
    navigation,
    route,
}: any) => {

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

            await api.put(
                "/api/users/profile",
                {
                    name: userName,
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

        <AuthLayout>

            <Text style={authStyles.title}>
                Edit Profile
            </Text>

            <Text style={authStyles.subtitle}>
                Update your profile information
            </Text>

            <TextInput
                placeholder="Full Name"
                value={userName}
                onChangeText={setUserName}
                style={authStyles.input}
                placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity
                style={[
                    authStyles.button,
                    loading &&
                    authStyles.disabledButton,
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
                                authStyles.buttonText
                            }
                        >
                            Save Changes
                        </Text>

                    )
                }

            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    marginTop: 15,
                    alignItems: "center",
                }}
                onPress={() =>
                    navigation.goBack()
                }
            >

                <Text
                    style={authStyles.link}
                >
                    Cancel
                </Text>

            </TouchableOpacity>

        </AuthLayout>

    );
};

export default EditProfileScreen;