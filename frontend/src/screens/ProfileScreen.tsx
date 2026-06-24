import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useFocusEffect } from "@react-navigation/native";
import { showError, showSuccess } from "../utils/toast";

const ProfileScreen = ({ navigation }: any) => {

    // we are fetching data from backend
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");

    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const [currentExpense, setCurrentExpense] = useState(0);

    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const remainingBudget = monthlyBudget - currentExpense;

     const exportReport = async () => {

        try {

            const token =
                await AsyncStorage.getItem("token");

            const response =
                await api.get(
                    "/api/expenses/export",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                        responseType: "text",
                    }
                );

            const fileUri =
                FileSystem.documentDirectory +
                "expenses.csv";
            await FileSystem.writeAsStringAsync(
                fileUri,
                response.data,
                {
                    encoding:
                        FileSystem.EncodingType.UTF8,
                }
            );
            await Sharing.shareAsync(fileUri);
            showSuccess(
                "Report exported successfully"
            );

        } catch (error) {
            console.error(error);
            showError(
                "Failed to export report"
            );
        }
    };

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

            setUserName(response.data.name);

            setEmail(response.data.email);

            setMonthlyBudget(
                response.data.monthlyBudget || 0
            );

            setCurrentExpense(
                response.data.currentExpense || 0
            );

            setEnabled(
                response.data.enabled || false
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

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

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

                <Text
                    style={[
                        styles.verified,
                        {
                            color: enabled ? "green" : "#E67E22",
                        },
                    ]}
                >
                    {enabled
                        ? "✅ Email Verified"
                        : "⚠️ Email Not Verified"}
                </Text>
                {
                    !enabled && (
                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={() =>
                                navigation.navigate(
                                    "ResendVerification"
                                )
                            }
                        >
                            <Text style={styles.verifyButtonText}>
                                Verify Email
                            </Text>
                        </TouchableOpacity>
                    )
                }
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
                {/* <TouchableOpacity onPress={() =>
                    navigation.navigate(
                        "ResetPassword"
                    )
                }> */}
                <Text style={styles.menuItem}>
                    🔒 Change Password
                </Text>
                {/* </TouchableOpacity> */}

                <TouchableOpacity onPress={() =>
                    navigation.navigate(
                        "Budget"
                    )
                }>
                    <Text style={styles.menuItem}>
                        📊 Budget Settings
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    
                    onPress={exportReport}
                >

                    <Text style={styles.menuItem}>
                        📥 Export Expenses
                    </Text>
                </TouchableOpacity>

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
    verifyButton: {
        marginTop: 10,
        backgroundColor: "#F39C12",
        padding: 10,
        borderRadius: 8,
    },

    verifyButtonText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "600",
    },

});