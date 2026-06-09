import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, RefreshControl, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SummaryResponse } from "../types/SummaryResponse";
import api from "../api/api";
import { useFocusEffect } from "@react-navigation/native";

const DashboardScreen = ({ navigation }: any) => {

    const [summary, setSummary] = useState<SummaryResponse | null>(null);

    const [refreshing, setRefreshing] = useState(false);

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
                // Object.entries(summary.categoryBreakdown)
                Object.entries(summary.categoryBreakdown)
                    .sort(
                        ([, amountA], [, amountB]) =>
                            Number(amountB) - Number(amountA)
                    )
                    .map(([category, amount]) => (

                        <View
                            key={category}
                            style={styles.breakdownRow}
                        >
                            <Text>
                                {category}
                            </Text>

                            <Text>
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

                    title="Monthly Summary"
                    onPress={() =>
                        navigation.navigate(
                            "MonthlySummary"
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
        padding: 15,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    summaryContainer: {
        width: "100%",
        marginBottom: 20,
    },

    card: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },

    cardTitle: {
        fontSize: 16,
    },

    cardValue: {
        fontSize: 24,
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },

    breakdownRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
});

export default DashboardScreen;