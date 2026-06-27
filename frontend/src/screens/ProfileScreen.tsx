import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { useTheme } from "../theme/useTheme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useFocusEffect } from "@react-navigation/native";
import { showError, showSuccess } from "../utils/toast";
import { COLORS } from "../constants/colors";

const ProfileScreen = ({ navigation }: any) => {

    const {
        theme,
        themeMode,
        setThemeMode,
    } = useTheme();

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
                style={[
                    styles.loadingContainer,
                    {
                        backgroundColor:
                            theme.background,
                    },
                ]}
            >

                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />

                <Text
                    style={[
                        styles.loadingText,
                        {
                            color:
                                theme.secondaryText,
                        },
                    ]}
                >
                    Loading Profile...
                </Text>

            </View>
        );
    }
    return (
        <ScrollView
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
            contentContainerStyle={{
                paddingBottom: 40,
                paddingTop: 40
            }}
            showsVerticalScrollIndicator={false}
        >
            {/* <View style={{ flex: 1 }}> */}
            <Text
                style={[
                    styles.title,
                    {
                        color: theme.text,
                    },
                ]}
            >
                Profile
            </Text>

            {/* User Card */}
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            theme.card,

                        borderColor:
                            theme.border,

                        borderWidth: 1,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.name,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    👤 {userName}
                </Text>

                <Text
                    style={[
                        styles.email,
                        {
                            color:
                                theme.secondaryText,
                        },
                    ]}
                >
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
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            theme.card,

                        borderColor:
                            theme.border,

                        borderWidth: 1,
                    },
                ]}
            >

                <Text
                    style={[
                        styles.sectionTitle,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    Financial Summary
                </Text>

                <Text
                    style={[
                        styles.summaryText,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    Monthly Budget : ₹{monthlyBudget}
                </Text>

                <Text
                    style={[
                        styles.summaryText,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    Current Expense : ₹{currentExpense}
                </Text>

                <Text
                    style={[
                        styles.summaryText,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    Remaining Budget : ₹{remainingBudget}
                </Text>

            </View>

            {/* Future Settings Section */}
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            theme.card,

                        borderColor:
                            theme.border,

                        borderWidth: 1,
                    },
                ]}
            >

                <Text
                    style={[
                        styles.sectionTitle,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    Account
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate(
                            "EditProfile",
                            {
                                name: userName,
                            }
                        )
                    }
                >
                    <Text
                        style={[
                            styles.menuItem,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        ✏️ Edit Profile
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() =>
                    navigation.navigate(
                        "ChangePassword"
                    )
                }>
                    <Text
                        style={[
                            styles.menuItem,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        🔒 Change Password
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() =>
                    navigation.navigate(
                        "Budget"
                    )
                }>
                    <Text
                        style={[
                            styles.menuItem,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        📊 Budget Settings
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity

                    onPress={exportReport}
                >

                    <Text
                        style={[
                            styles.menuItem,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        📥 Export Expenses
                    </Text>
                </TouchableOpacity>

                <Text
                    style={[
                        styles.sectionTitle,
                        {
                            color: theme.text,
                            marginTop: 10,
                        },
                    ]}
                >
                    🎨 Appearance
                </Text>

                <TouchableOpacity
                    style={[
                        styles.themeOption,
                        {
                            borderBottomColor:
                                theme.border,
                        },
                    ]}
                    onPress={() =>
                        setThemeMode("light")
                    }
                >
                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 16,
                        }}
                    >
                        ☀️ Light Mode
                    </Text>

                    {themeMode === "light" && (
                        <Text
                            style={{
                                color: COLORS.primary,
                                fontSize: 18,
                                fontWeight: "bold",
                            }}
                        >
                            ✓
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.themeOption,
                        {
                            borderBottomColor:
                                theme.border,
                        },
                    ]}
                    onPress={() =>
                        setThemeMode("dark")
                    }
                >
                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 16,
                        }}
                    >
                        🌙 Dark Mode
                    </Text>

                    {themeMode === "dark" && (
                        <Text
                            style={{
                                color: COLORS.primary,
                                fontSize: 18,
                                fontWeight: "bold",
                            }}
                        >
                            ✓
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.themeOption,
                        {
                            borderBottomWidth: 0,
                        },
                    ]}
                    onPress={() =>
                        setThemeMode("system")
                    }
                >
                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 16,
                        }}
                    >
                        📱 System Default
                    </Text>

                    {themeMode === "system" && (
                        <Text
                            style={{
                                color: COLORS.primary,
                                fontSize: 18,
                                fontWeight: "bold",
                            }}
                        >
                            ✓
                        </Text>
                    )}
                </TouchableOpacity>

            </View>
            {/* </View> */}

            {/* Logout Button */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>
                    🚪 Logout
                </Text>
            </TouchableOpacity>

        </ScrollView>


    );
};

export default ProfileScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },

    card: {
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: "600",
        color: "#64748B",
    },

    themeOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
    },

});