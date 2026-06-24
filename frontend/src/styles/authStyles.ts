import { StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export const authStyles = StyleSheet.create({

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

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    disabledButton: {
        opacity: 0.7,
    },

    linkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 25,
    },
    
    linkText: {
        color: "#64748B",
        fontSize: 15,
    },

    link: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: "bold",
    },

});