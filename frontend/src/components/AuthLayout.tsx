import React, { useEffect, useRef } from "react";

import {
    Animated,
} from "react-native";

import {
    ImageBackground,
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Text
} from "react-native";

type Props = {
    children: React.ReactNode;
};

const AuthLayout = ({
    children,
}: Props) => {

    const fadeAnim =
        useRef(
            new Animated.Value(0)
        ).current;

    const slideAnim =
        useRef(
            new Animated.Value(30)
        ).current;

    useEffect(() => {

        Animated.parallel([

            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }
            ),

            Animated.timing(
                slideAnim,
                {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: true,
                }
            ),

        ]).start();

    }, []);

    return (

        <ImageBackground
            source={require("../assets/register-bg.png")}
            style={styles.background}
            resizeMode="cover"
        >

            <View style={styles.overlay}>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={
                        Platform.OS === "ios"
                            ? "padding"
                            : undefined
                    }
                >

                    <ScrollView
                        contentContainerStyle={
                            styles.scrollContent
                        }
                        keyboardShouldPersistTaps="handled"
                    >
                        <Animated.View
                            style={[
                                styles.card,
                                {
                                    opacity: fadeAnim,
                                    transform: [
                                        {
                                            translateY: slideAnim,
                                        },
                                    ],
                                },
                            ]}
                        >

                            <Image
                                source={require("../assets/logo.png")}
                                style={styles.logo}
                                resizeMode="contain"
                            />

                            {children}

                            {/* </View> */}
                        </Animated.View>

                    </ScrollView>

                </KeyboardAvoidingView>

            </View>

        </ImageBackground>

    );
};

export default AuthLayout;

const styles = StyleSheet.create({

    background: {
        flex: 1,
    },

    overlay: {
        flex: 1,
        backgroundColor:
            "rgba(0,0,0,0.20)",
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    card: {
        backgroundColor:
            "rgba(255,255,255,0.95)",

        borderRadius: 24,

        padding: 25,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.15,

        shadowRadius: 10,

        elevation: 8,
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: "center",
        marginBottom: 10,
    },

    appName: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        color: "#4F46E5",
        marginBottom: 20,
    },
});