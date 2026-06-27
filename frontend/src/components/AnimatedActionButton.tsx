import React, { useEffect, useRef } from "react";

import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Animated,
    StyleSheet,
} from "react-native";

import { COLORS } from "../constants/colors";

// type Props = {
//     title: string;
//     loading: boolean;
//     success: boolean;
//     onPress: () => void;
// };
type Props = {
    title: string;
    successTitle?: string;
    loading: boolean;
    success: boolean;
    onPress: () => void;
};

// const AnimatedActionButton = ({
//     title,
//     loading,
//     success,
//     onPress,
// }: Props) => {
const AnimatedActionButton = ({
    title,
    successTitle = "Saved",
    loading,
    success,
    onPress,
}: Props) => {

    const scaleAnim =
        useRef(
            new Animated.Value(1)
        ).current;

    useEffect(() => {

        if (loading) {

            Animated.sequence([
                Animated.spring(
                    scaleAnim,
                    {
                        toValue: 0.95,
                        useNativeDriver: true,
                    }
                ),

                Animated.spring(
                    scaleAnim,
                    {
                        toValue: 1,
                        useNativeDriver: true,
                    }
                ),

            ]).start();
        }

    }, [loading]);

    return (

        <Animated.View
            style={{
                transform: [
                    {
                        scale: scaleAnim,
                    },
                ],
            }}
        >

            <TouchableOpacity
                style={[
                    styles.button,

                    success && {
                        backgroundColor:
                            "#22C55E",
                    },

                    loading && {
                        opacity: 0.8,
                    },
                ]}
                onPress={onPress}
                disabled={
                    loading || success
                }
            >

                {
                    loading ? (

                        <ActivityIndicator
                            color="#FFFFFF"
                        />

                    ) : success ? (

                        <Text
                            style={
                                styles.buttonText
                            }
                        >
                            {/* ✓ Saved */}
                            ✓ {successTitle}
                        </Text>

                    ) : (

                        <Text
                            style={
                                styles.buttonText
                            }
                        >
                            {title}
                        </Text>

                    )
                }

            </TouchableOpacity>

        </Animated.View>

    );
};

export default AnimatedActionButton;

const styles = StyleSheet.create({

    button: {
        backgroundColor:
            COLORS.primary,

        paddingVertical: 14,

        borderRadius: 12,

        alignItems: "center",
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

});