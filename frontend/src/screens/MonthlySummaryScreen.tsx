import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
} from "react-native";

import { PieChart } from "react-native-chart-kit";

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
    const screenWidth =
        Dimensions.get("window").width;

    const chartData =
        summary
            ? Object.entries(
                summary.categoryBreakdown
            ).map(
                ([category, amount], index) => ({
                    name: category,
                    amount: Number(amount),

                    color: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#8BC34A",
                        "#E91E63",
                        "#009688",
                        "#795548",
                    ][index % 10],

                    legendFontColor: "#333",
                    legendFontSize: 12,
                })
            )
            : [];

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
                Expense Distribution
            </Text>

            {
                chartData.length > 0 && (

                    <PieChart
                        data={chartData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            color: () => "#000",
                        }}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />

                )
            }
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