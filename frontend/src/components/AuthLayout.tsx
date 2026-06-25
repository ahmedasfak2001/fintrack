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

import { useTheme } from "../theme/useTheme";

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

    const scaleAnim = useRef(
        new Animated.Value(0.95)
    ).current;

    const { darkMode, theme } = useTheme();

    useEffect(() => {

        Animated.parallel([

            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }
            ),

            Animated.timing(
                slideAnim,
                {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }
            ),

            Animated.timing(
                scaleAnim,
                {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true
                }
            )

        ]).start();

    }, []);

    return (

        <ImageBackground
            source={
                darkMode
                    ? require("../assets/register-bg-dark.png")
                    : require("../assets/register-bg.png")
            }
            style={styles.background}
            resizeMode="cover"
        >

            <View
                style={[
                    styles.overlay,
                    {
                        backgroundColor: darkMode
                            ? "rgba(0,0,0,0.45)"
                            : "rgba(0,0,0,0.20)",
                    },
                ]}
            >

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={
                        Platform.OS === "ios"
                            ? "padding"
                            : "height"
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
                                    backgroundColor: darkMode
                                        ? "rgba(30,41,59,0.92)"
                                        : "rgba(255,255,255,0.95)",

                                    borderColor: theme.border,
                                    borderWidth: 1,

                                    opacity: fadeAnim,

                                    transform: [
                                        { translateY: slideAnim },
                                        { scale: scaleAnim },
                                    ],
                                },
                            ]}
                        >

                            <Image
                                source={
                                    darkMode
                                        ? require("../assets/logo-dark.png")
                                        : require("../assets/logo.png")
                                }
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
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },

    // card: {
    //     backgroundColor:
    //         "rgba(255,255,255,0.95)",

    //     borderRadius: 24,

    //     padding: 25,

    //     shadowColor: "#000",

    //     shadowOffset: {
    //         width: 0,
    //         height: 4,
    //     },

    //     shadowOpacity: 0.15,

    //     shadowRadius: 10,

    //     elevation: 8,
    // },
    card: {
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