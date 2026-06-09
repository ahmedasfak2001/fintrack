import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/api";

const MonthlySummaryScreen = () => {

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {

        setRefreshing(true);

        await fetchSummary();

        setRefreshing(false);
    };

    const [summary, setSummary] =
        useState<any>(null);

    useEffect(() => {

        fetchSummary();

    }, []);

    const fetchSummary = async () => {

        try {

            const token =
                await AsyncStorage.getItem("token");

            const response =
                await api.get(
                    "/api/expenses/summary/monthly",
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
                Monthly Summary
            </Text>

            <View style={styles.card}>
                <Text style={styles.label}>
                    Current Month
                </Text>

                <Text style={styles.value}>
                    {summary?.month} {summary?.year}
                </Text>
            </View>


            <View style={styles.card}>
                <Text style={styles.label}>
                    Total Expense
                </Text>

                <Text style={styles.value}>
                    ₹ {summary?.totalExpense ?? 0}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>
                    Total Entries
                </Text>

                <Text style={styles.value}>
                    {summary?.expenseCount ?? 0}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>
                Category Breakdown
            </Text>

            {
                summary &&
                Object.entries(
                    summary.categoryBreakdown
                )
                    .sort(
                        ([, a], [, b]) =>
                            Number(b) - Number(a)
                    )
                    .map(
                        ([category, amount]) => (

                            <View
                                key={category}
                                style={styles.row}
                            >
                                <Text>
                                    {category}
                                </Text>

                                <Text>
                                    ₹ {String(amount)}
                                </Text>
                            </View>

                        )
                    )
            }

        </ScrollView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 15,
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },

    card: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },

    label: {
        fontSize: 16,
    },

    value: {
        fontSize: 22,
        fontWeight: "bold",
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
});

export default MonthlySummaryScreen;