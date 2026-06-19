import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";

import api from "../api/api";
import { RegisterRequest } from "../types/RegisterRequest";
import { COLORS } from "../constants/colors";
import { showError, showSuccess } from "../utils/toast";

const RegisterScreen = ({ navigation }: any) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] =
        useState(false);

    const validateEmail = (
        email: string
    ) => {

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(email);
    };

    //   const handleRegister = () => {
    //     Alert.alert("Register Clicked");
    //   };

    const handleRegister = async () => {
        try {
            setLoading(true);
            if (
                name.trim().length < 3
            ) {

                // Alert.alert(
                //     "Validation Error",
                //     "Username must be at least 3 characters"
                // );
                showError(
                    "Username must be at least 3 characters"
                );
                setLoading(false);
                return;
            }

            if (!email.trim()) {

                // Alert.alert(
                //     "Validation Error",
                //     "Email is required"
                // );
                showError(
                    "Email is required"
                );
                setLoading(false);
                return;
            }

            if (!validateEmail(email)) {

                // Alert.alert(
                //     "Validation Error",
                //     "Please enter a valid email address"
                // );
                showError(
                    "Please enter a valid email address"
                );
                setLoading(false);
                return;
            }

            if (
                password.length < 6
            ) {

                // Alert.alert(
                //     "Validation Error",
                //     "Password must be at least 6 characters"
                // );
                showError(
                    "Password must be at least 6 characters"
                );
                setLoading(false);
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

            // Alert.alert(
            //     "Success",
            //     "User registered successfully",
            //     [
            //         {
            //             text: "OK",
            //             onPress: () =>
            //                 navigation.navigate("Login"),
            //         },
            //     ]
            // );

            showSuccess(
                "User registered successfully"
            );

            setTimeout(() => {
                navigation.navigate("Login");
            }, 1500);


        }
        // catch (error) {

        //         Alert.alert(
        //             "Error",
        //             "Registration failed"
        //         );

        //         console.error(error);
        //     }
        catch (error: any) {

            if (error.response?.status === 403) {

                // Alert.alert(
                //     "Registration Failed",
                //     "Email already registered"
                // );
                showError(
                    "Email already registered"
                );

            } else {

                // Alert.alert(
                //     "Registration Failed",
                //     "Something went wrong."
                // );
                showError(
                    "Something went wrong."
                );
            }
        } finally {

            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                FinTrack Register
            </Text>

            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            {/* <Button
                title="Register"
                onPress={handleRegister}
            /> */}

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
                            Register
                        </Text>

                    )
                }

            </TouchableOpacity>

            <View style={{ marginTop: 10 }}>

                <Button
                    title="Back To Login"
                    onPress={() => navigation.goBack()}
                />

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    registerButton: {
        backgroundColor:
            COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },

    disabledButton: {
        opacity: 0.7,
    },

    registerButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default RegisterScreen;