import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
} from "react-native";

import api from "../api/api";
import { RegisterRequest } from "../types/RegisterRequest";

const RegisterScreen = ({ navigation }: any) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //   const handleRegister = () => {
    //     Alert.alert("Register Clicked");
    //   };

    const handleRegister = async () => {
        try {

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
                "Success",
                "User registered successfully",
                [
                    {
                        text: "OK",
                        onPress: () =>
                            navigation.navigate("Login"),
                    },
                ]
            );

        } catch (error) {

            Alert.alert(
                "Error",
                "Registration failed"
            );

            console.error(error);
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

            <Button
                title="Register"
                onPress={handleRegister}
            />

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
});

export default RegisterScreen;