import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    RefreshControl,
    ScrollView,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SummaryResponse } from "../types/SummaryResponse";
import api from "../api/api";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { COLORS } from "../constants/colors";
import { MonthlyComparisonResponse } from "../types/MonthlyComparisonResponse";
import { DailyAverageResponse } from "../types/DailyAverageResponse";
import { SpendingInsightResponse } from "../types/SpendingInsightResponse";
import { BiggestExpenseResponse } from "../types/BiggestExpenseResponse";
import { SavingsPotentialResponse } from "../types/SavingsPotentialResponse";
import { showError, showSuccess } from "../utils/toast";

const DashboardScreen = ({ navigation }: any) => {

    const [summary, setSummary] = useState<SummaryResponse | null>(null);

    const [refreshing, setRefreshing] = useState(false);

    const [loading, setLoading] = useState(true);

    const [comparison,
        setComparison] =
        useState<
            MonthlyComparisonResponse | null
        >(null);
    const [insight,
        setInsight] =
        useState<
            SpendingInsightResponse | null
        >(null);
    const [biggestExpense,
        setBiggestExpense] =
        useState<
            BiggestExpenseResponse | null
        >(null);
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
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSummary();
        setRefreshing(false);
    };

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        showSuccess(
            "Logged out successfully"
        );
        navigation.replace("Login");
    };

    useFocusEffect(
        useCallback(() => {
            fetchSummary();
        }, [])
    );

    const [dailyAverage,
        setDailyAverage] =
        useState<
            DailyAverageResponse | null
        >(null);

    const [savingsPotential,
        setSavingsPotential] =
        useState<
            SavingsPotentialResponse | null
        >(null);
    const [welcomeMessage,
        setWelcomeMessage] =
        useState("");

    const fetchSummary = async () => {

        try {
            setLoading(true);
            const message =
                await AsyncStorage.getItem(
                    "welcomeMessage"
                );

            if (message) {
                setWelcomeMessage(message);
            }
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

            const comparisonResponse =
                await api.get(
                    "/api/expenses/comparison",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setComparison(
                comparisonResponse.data
            );

            const dailyAverageResponse =
                await api.get(
                    "/api/expenses/daily-average",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setDailyAverage(
                dailyAverageResponse.data
            );
            const insightResponse =
                await api.get(
                    "/api/expenses/spending-insight",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setInsight(
                insightResponse.data
            );

            const biggestExpenseResponse =
                await api.get(
                    "/api/expenses/biggest-expense",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setBiggestExpense(
                biggestExpenseResponse.data
            );

            const savingsResponse =
                await api.get(
                    "/api/expenses/savings-potential",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setSavingsPotential(
                savingsResponse.data);

        } catch (error) {

            console.error(error);
            showError(
                "Failed to load dashboard data"
            );
        } finally {

            setLoading(false);
        }
    };
    if (loading) {

        return (

            <View
                style={
                    styles.loadingContainer
                }
            >

                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading Dashboard...
                </Text>

            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={
                styles.contentContainer
            }
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <Text style={styles.title}>
                {welcomeMessage}
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

            <View style={styles.comparisonCard}>

                <Text style={styles.cardTitle}>
                    Monthly Comparison
                </Text>

                <Text style={styles.compareText}>
                    Current: ₹
                    {comparison?.currentMonthExpense ?? 0}
                </Text>

                <Text style={styles.compareText}>
                    Previous: ₹
                    {comparison?.previousMonthExpense ?? 0}
                </Text>

                {(comparison?.previousMonthExpense ?? 0) > 0 ? (

                    <Text style={styles.compareResult}>
                        {(comparison?.percentageChange ?? 0) >= 0
                            ? "▲"
                            : "▼"}{" "}
                        {Math.abs(
                            comparison?.percentageChange ?? 0
                        ).toFixed(2)}%
                    </Text>

                ) : (

                    <Text style={styles.compareResult}>
                        First month of tracking
                    </Text>
                )}
            </View>
            <View style={styles.comparisonCard}>
                <Text style={styles.cardTitle}>
                    Daily Average Spending
                </Text>
                <Text style={styles.cardValue}>
                    ₹
                    {
                        dailyAverage?.dailyAverage
                            ?.toFixed(2) ?? "0.00"
                    }
                </Text>
                <Text style={styles.compareText}>
                    Per Day
                </Text>
            </View>
            <View style={styles.insightCard}>
                <Text style={styles.cardTitle}>
                    Spending Insight
                </Text>
                <Text style={styles.insightText}>
                    {insight?.message ??
                        "Loading..."}
                </Text>
            </View>
            <View style={styles.insightCard}>

                <Text style={styles.cardTitle}>
                    Biggest Expense This Month
                </Text>

                <Text style={styles.cardValue}>
                    ₹ {biggestExpense?.amount ?? 0}
                </Text>

                <Text style={styles.compareText}>
                    {
                        biggestExpense?.description
                        ?? "No expenses"
                    }
                </Text>

            </View>
            <View style={styles.insightCard}>

                <Text style={styles.cardTitle}>
                    Savings Potential
                </Text>

                <Text style={styles.cardValue}>
                    ₹ {savingsPotential?.amount ?? 0}
                </Text>

                <Text style={styles.compareText}>
                    {savingsPotential?.message}
                </Text>

            </View>
            <Text style={styles.sectionTitle}>
                Category Breakdown
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingRight: 10,
                }}
            >

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

            </ScrollView>

            <Text style={styles.sectionTitle}>
                Quick Actions
            </Text>

            <View style={styles.actionGrid}>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() =>
                        navigation.navigate(
                            "AddExpense"
                        )
                    }
                >
                    <Text style={styles.actionIcon}>
                        ➕
                    </Text>

                    <Text style={styles.actionText}>
                        Add Expense
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() =>
                        navigation.navigate(
                            "Expenses"
                        )
                    }
                >
                    <Text style={styles.actionIcon}>
                        📋
                    </Text>

                    <Text style={styles.actionText}>
                        Expenses
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() =>
                        navigation.navigate(
                            "MonthlySummary"
                        )
                    }
                >
                    <Text style={styles.actionIcon}>
                        📊
                    </Text>

                    <Text style={styles.actionText}>
                        Analytics
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() =>
                        navigation.navigate(
                            "Budget"
                        )
                    }
                >
                    <Text style={styles.actionIcon}>
                        💰
                    </Text>

                    <Text style={styles.actionText}>
                        Budget
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={exportReport}
                >
                    <Text style={styles.actionIcon}>
                        📄
                    </Text>

                    <Text style={styles.actionText}>
                        Export
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={logout}
                >
                    <Text style={styles.actionIcon}>
                        🚪
                    </Text>

                    <Text style={styles.actionText}>
                        Logout
                    </Text>
                </TouchableOpacity>

            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16
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
    actionGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 10,
    },
    actionCard: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: "center",
        marginBottom: 12,
        elevation: 2,
    },
    actionIcon: {
        fontSize: 28,
        marginBottom: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: "600",
    },
    contentContainer: {
        paddingBottom: 40,
    },
    categoryCard: {
        width: 140,
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 14,
        marginRight: 12,
        elevation: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryName: {
        fontSize: 14,
        color: "#64748B",
        fontWeight: "600",
    },
    categoryAmount: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 8,
    },
    comparisonCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
    },

    compareText: {
        fontSize: 16,
        marginTop: 4,
    },

    compareResult: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 10,
    },
    insightCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginTop: 12,
        elevation: 3,
    },

    insightText: {
        fontSize: 16,
        marginTop: 8,
        lineHeight: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
            COLORS.background,
    },

    loadingText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: "600",
        color: "#64748B",
    },
});

export default DashboardScreen;