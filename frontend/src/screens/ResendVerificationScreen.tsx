// import React, { useState } from "react";

// import {
//     View,
//     TextInput,
//     Button,
//     Alert,
// } from "react-native";

// import api from "../api/api";

// export default function ResendVerificationScreen({ navigation }: any) {

//     const [email, setEmail] =
//         useState("");

//     const resendEmail = async () => {

//         try {

//             await api.post(
//                 "/api/users/resend-verification",
//                 {
//                     email,
//                 }
//             );

//             Alert.alert(
//                 "Success",
//                 "Verification email sent.",
//                 [
//                     {
//                         text: "Go To Login",
//                         onPress: () =>
//                             navigation.navigate("Login"),
//                     },
//                 ]
//             );

//         } catch (error: any) {

//             Alert.alert(
//                 "Error",
//                 error?.response?.data?.message ||
//                 "Something went wrong"
//             );
//         }
//     };

//     return (
//         <View>

//             <TextInput
//                 placeholder="Enter email"
//                 value={email}
//                 onChangeText={setEmail}
//             />

//             <Button
//                 title="Send Verification Email"
//                 onPress={resendEmail}
//             />

//         </View>
//     );
// }

import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from "react-native";

import api from "../api/api";
import AuthLayout from "../components/AuthLayout";
import { COLORS } from "../constants/colors";
import { showError, showSuccess } from "../utils/toast";

export default function ResendVerificationScreen({ navigation }: any) {

    const [email, setEmail] = useState("");

    const [loading, setLoading] =
        useState(false);

    const resendEmail = async () => {

        try {

            setLoading(true);

            await api.post(
                "/api/users/resend-verification",
                {
                    email,
                }
            );

            showSuccess(
                "Verification email sent"
            );

            Alert.alert(
                "Success",
                "Verification email sent successfully.",
                [
                    {
                        text: "Go To Login",
                        onPress: () =>
                            navigation.navigate("Login"),
                    },
                ]
            );

        } catch (error: any) {

            showError(
                error?.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <AuthLayout>

                <Text style={styles.title}>
                    Verify Your Email
                </Text>

                <Text style={styles.subtitle}>
                    Enter your registered email address and we'll send a fresh verification link.
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
                        loading &&
                        styles.disabledButton,
                    ]}
                    onPress={resendEmail}
                    disabled={loading}
                >

                    {
                        loading ? (

                            <ActivityIndicator
                                color="#FFFFFF"
                            />

                        ) : (

                            <Text style={styles.buttonText}>
                                Send Verification Email
                            </Text>

                        )
                    }

                </TouchableOpacity>

                <View style={styles.backContainer}>

                    <Text style={styles.backText}>
                        Already verified?{" "}
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
}

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