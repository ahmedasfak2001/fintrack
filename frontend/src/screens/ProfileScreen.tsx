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
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }: any) => {

    const {
        theme,
        themeMode,
        setThemeMode,
    } = useTheme();

    // we are fetching data from backend
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [createdAt, setCreatedAt] = useState("");

    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const [currentExpense, setCurrentExpense] = useState(0);

    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const remainingBudget = monthlyBudget - currentExpense;

    const exportPdf = async () => {

        try {

            const token = await AsyncStorage.getItem("token");

            const today = new Date();

            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            const url =
                `${api.defaults.baseURL}/api/expenses/export/pdf?month=${month}&year=${year}`;

            const fileUri =
                FileSystem.cacheDirectory +
                `FinTrack_Report_${month}_${year}.pdf`;

            console.log("Downloading...");
            const info = await FileSystem.getInfoAsync(fileUri);
            console.log(info);
            console.log(fileUri);

            const result = await FileSystem.downloadAsync(
                url,
                fileUri,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(result);
            const isAvailable = await Sharing.isAvailableAsync();

            if (isAvailable) {

                await Sharing.shareAsync(result.uri);
                showSuccess(
                    "Report exported successfully"
                );

            } else {
                alert("Sharing is not available on this device.");
                showError(
                    "Failed to export report"
                );

            }

        } catch (error) {

            console.log(error);
            showError(
                "Failed to export report"
            );

        }
    };

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

            const [profileResponse, monthlySummaryResponse] = await Promise.all([
                api.get("/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                api.get("/api/expenses/summary/monthly", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            console.log(
                "PROFILE RESPONSE",
                profileResponse.data
            );

            setUserName(profileResponse.data.name);

            setEmail(profileResponse.data.email);

            setMonthlyBudget(
                profileResponse.data.monthlyBudget || 0
            );

            // setCurrentExpense(
            setCurrentExpense(
                monthlySummaryResponse.data.totalExpense || 0
            );

            setEnabled(
                profileResponse.data.enabled || false
            );

            setCreatedAt(
                profileResponse.data.createdAt
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

            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                    {userName?.charAt(0).toUpperCase()}
                </Text>
            </View>

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
                ]}>
                <View style={styles.nameRow}>
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

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(
                                "EditProfile",
                                { name: userName }
                            )
                        }
                    >
                        <Ionicons
                            name="create-outline"
                            size={22}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                </View>

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
                <Text
                    style={[
                        styles.email,
                        {
                            color:
                                theme.secondaryText,
                        },
                    ]}
                >
                    📅 Joined:
                    {" "}
                    {new Date(
                        createdAt
                    ).toLocaleDateString()}
                </Text>
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

                <TouchableOpacity
                    onPress={exportPdf}
                >
                    <Text
                        style={[
                            styles.menuItem,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        📥 Download Monthly PDF
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
            <View
                style={{
                    marginTop: 30,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color:
                            theme.secondaryText,
                        fontSize: 13,
                    }}
                >
                    FinTrack v6.1.0
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
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: COLORS.primary,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },

    avatarText: {
        color: "#FFFFFF",
        fontSize: 36,
        fontWeight: "bold",
    },
    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    exportButton: {
        backgroundColor: "#2563EB",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },

    exportButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

});