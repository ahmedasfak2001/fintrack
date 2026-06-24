import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

const ProfileScreen = ({ navigation }: any) => {

    // we are fetching data from backend
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");

    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const [currentExpense, setCurrentExpense] = useState(0);

    const [loading, setLoading] = useState(true);

    const remainingBudget = monthlyBudget - currentExpense;

    const fetchProfile = async () => {

        try {
            const token =
                await AsyncStorage.getItem("token");

            const response =
                await api.get(
                    "/api/users/profile",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            console.log(
                "PROFILE RESPONSE",
                response.data
            );

            setUserName(
                response.data.name
            );

            setEmail(
                response.data.email
            );

            setMonthlyBudget(
                response.data.monthlyBudget || 0
            );

            setCurrentExpense(
                response.data.currentExpense || 0
            );

        } catch (error) {

            console.log(
                "PROFILE FETCH ERROR",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchProfile();

    }, []);

    const handleLogout = async () => {

        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {

                        await AsyncStorage.removeItem("token");

                        navigation.reset({
                            index: 0,
                            routes: [{ name: "Login" }],
                        });
                    },
                },
            ]
        );
    };
    if (loading) {

        return (

            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <Text>
                    Loading Profile...
                </Text>

            </View>
        );
    }
    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Profile
            </Text>

            {/* User Card */}
            <View style={styles.card}>
                <Text style={styles.name}>
                    👤 {userName}
                </Text>

                <Text style={styles.email}>
                    📧 {email}
                </Text>

                <Text style={styles.verified}>
                    ✅ Email Verified
                </Text>
            </View>

            {/* Financial Summary */}
            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    Financial Summary
                </Text>

                <Text style={styles.summaryText}>
                    Monthly Budget : ₹{monthlyBudget}
                </Text>

                <Text style={styles.summaryText}>
                    Current Expense : ₹{currentExpense}
                </Text>

                <Text style={styles.summaryText}>
                    Remaining Budget : ₹{remainingBudget}
                </Text>

            </View>

            {/* Future Settings Section */}
            <View style={styles.card}>

                <Text style={styles.sectionTitle}>
                    Account
                </Text>

                <Text style={styles.menuItem}>
                    🔒 Change Password
                </Text>

                <Text style={styles.menuItem}>
                    📊 Budget Settings
                </Text>

                <Text style={styles.menuItem}>
                    📥 Export Expenses
                </Text>

            </View>

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>
                    🚪 Logout
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },

    card: {
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 3,
    },

    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },

    email: {
        fontSize: 16,
        color: "#555",
        marginBottom: 8,
    },

    verified: {
        color: "green",
        fontWeight: "600",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },

    summaryText: {
        fontSize: 16,
        marginBottom: 6,
    },

    menuItem: {
        fontSize: 16,
        marginBottom: 12,
    },

    logoutButton: {
        backgroundColor: "#E53935",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },

    logoutText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },

});