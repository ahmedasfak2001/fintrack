import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, RefreshControl, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SummaryResponse } from "../types/SummaryResponse";
import api from "../api/api";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { COLORS } from "../constants/colors";

const DashboardScreen = ({ navigation }: any) => {

    const [summary, setSummary] = useState<SummaryResponse | null>(null);

    const [refreshing, setRefreshing] = useState(false);
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

        } catch (error) {

            console.error(error);

            Alert.alert(
                "Error",
                "Failed to export report"
            );
        }
    };
    const onRefresh = async () => {

        setRefreshing(true);

        await fetchSummary();

        setRefreshing(false);
    };

    const logout = async () => {

        await AsyncStorage.removeItem("token");

        navigation.replace("Login");
    };

    // useEffect(() => {

    //     fetchSummary();

    // }, []);
    useFocusEffect(
        useCallback(() => {

            fetchSummary();

        }, [])
    );

    const fetchSummary = async () => {

        try {

            const token =
                await AsyncStorage.getItem("token");

            const response =
                await api.get(
                    "/api/expenses/summary",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setSummary(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    // return (
    //     <View style={styles.container}>
    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <Text style={styles.title}>
                Welcome to FinTrack Dashboard
            </Text>

            <View style={styles.summaryContainer}>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Total Expenses
                    </Text>

                    <Text style={styles.cardValue}>
                        ₹ {summary?.totalExpense ?? 0}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Total Entries
                    </Text>

                    <Text style={styles.cardValue}>
                        {summary?.expenseCount ?? 0}
                    </Text>
                </View>

            </View>

            <Text style={styles.sectionTitle}>
                Category Breakdown
            </Text>

            {
                summary &&
                Object.entries(summary.categoryBreakdown)
                    .sort(
                        ([, amountA], [, amountB]) =>
                            Number(amountB) - Number(amountA)
                    )
                    .map(([category, amount]) => (

                        <View
                            key={category}
                            style={styles.categoryCard}
                        >

                            <Text
                                style={styles.categoryName}
                            >
                                {category}

                            </Text>

                            <Text
                                style={styles.categoryAmount}
                            >
                                ₹ {amount}
                            </Text>

                        </View>

                    ))
            }
            <View style={{ marginBottom: 10 }}>
                <Button
                    title="Add Expense"
                    onPress={() =>
                        navigation.navigate("AddExpense")
                    }
                />
            </View>
            <View style={{ marginBottom: 10 }}>
                <Button
                    title="View Expenses"
                    onPress={() =>
                        navigation.navigate("Expenses")
                    }
                />
            </View>
            <View style={{ marginBottom: 10 }}>
                <Button
                    title="Export CSV Report"
                    onPress={exportReport}
                />
            </View>
            <View style={{ marginBottom: 10 }}>
                <Button
                    title="Budget vs Actual"
                    onPress={() =>
                        navigation.navigate(
                            "Budget"
                        )
                    }
                />
            </View>
            <View style={{ marginBottom: 10 }}>
                <Button

                    title="Monthly Summary"
                    onPress={() =>
                        navigation.navigate(
                            "MonthlySummary"
                        )
                    }
                />
            </View>
            <View style={{ marginBottom: 10 }}>

                <Button
                    title="Monthly Trend"
                    onPress={() =>
                        navigation.navigate(
                            "Trend"
                        )
                    }
                />
            </View>

            <Button
                title="Logout"
                onPress={logout}
            />
        </ScrollView >
        //  </View>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    summaryContainer: {
        width: "100%",
        marginBottom: 20,
    },

    // card: {
    //     borderWidth: 1,
    //     borderRadius: 10,
    //     padding: 15,
    //     marginBottom: 10,
    // },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 14,
        color: "#64748B",
    },
    cardValue: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },

    categoryCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 14,
        marginBottom: 10,
        elevation: 2,
    },

    categoryName: {
        fontSize: 16,
        fontWeight: "600",
    },

    categoryAmount: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 6,
    },
});

export default DashboardScreen;