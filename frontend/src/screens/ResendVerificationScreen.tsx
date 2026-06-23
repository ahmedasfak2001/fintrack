import React, { useState } from "react";

import {
    View,
    TextInput,
    Button,
    Alert,
} from "react-native";

import api from "../api/api";

export default function ResendVerificationScreen({ navigation }: any) {

    const [email, setEmail] =
        useState("");

    const resendEmail = async () => {

        try {

            await api.post(
                "/api/users/resend-verification",
                {
                    email,
                }
            );

            Alert.alert(
                "Success",
                "Verification email sent.",
                [
                    {
                        text: "Go To Login",
                        onPress: () =>
                            navigation.navigate("Login"),
                    },
                ]
            );

        } catch (error: any) {

            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <View>

            <TextInput
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
            />

            <Button
                title="Send Verification Email"
                onPress={resendEmail}
            />

        </View>
    );
}