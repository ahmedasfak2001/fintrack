import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SummaryResponse } from "../types/SummaryResponse";
import api from "../api/api";

const DashboardScreen = ({ navigation }: any) => {

    const [summary, setSummary] = useState<SummaryResponse | null>(null);

    const logout = async () => {

        await AsyncStorage.removeItem("token");

        navigation.replace("Login");
    };

    useEffect(() => {

        fetchSummary();

    }, []);
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

    return (
        <View style={styles.container}>
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

            <Button
                title="Add Expense"
                onPress={() =>
                    navigation.navigate("AddExpense")
                }
            />

            <Button
                title="View Expenses"
                onPress={() =>
                    navigation.navigate("Expenses")
                }
            />

            <Button
                title="Logout"
                onPress={logout}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
});

export default DashboardScreen;