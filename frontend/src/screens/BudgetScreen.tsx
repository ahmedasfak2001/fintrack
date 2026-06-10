import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TextInput,
    Button,
    TouchableOpacity
} from "react-native";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import api from "../api/api";

import {
    BudgetSummaryResponse,
} from "../types/BudgetSummaryResponse";
import * as Progress from "react-native-progress";
import { COLORS } from "../constants/colors";

const BudgetScreen = () => {

    const [budget, setBudget] = useState("");

    const [loading, setLoading] = useState(false);

    const fetchBudget = async () => {

        try {

            const token =
                await AsyncStorage.getItem(
                    "token"
                );

            const response =
                await api.get(
                    "/api/expenses/budget",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setBudget(
                response.data.monthlyBudget
                    .toString()
            );

        } catch (error) {

            console.error(error);
        }
    };

    const [summary, setSummary] =
        useState<BudgetSummaryResponse | null>(
            null
        );

    useEffect(() => {

        fetchBudgetSummary();
        fetchBudget();

    }, []);

    const fetchBudgetSummary =
        async () => {

            try {

                const token =
                    await AsyncStorage.getItem(
                        "token"
                    );

                const response =
                    await api.get(
                        "/api/expenses/budget-summary",
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

    const updateBudget = async () => {

        try {

            setLoading(true);

            const token =
                await AsyncStorage.getItem(
                    "token"
                );

            await api.put(
                "/api/expenses/budget",
                {
                    monthlyBudget:
                        Number(budget),
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            await fetchBudgetSummary();

            Alert.alert(
                "Success",
                "Budget updated"
            );

        } catch (error) {

            console.error(error);

            Alert.alert(
                "Error",
                "Failed to update budget"
            );
        } finally {

            setLoading(false);
        }
    };

    const usage =
        (summary?.usagePercentage ?? 0) / 100;

    const usagePercentage =
        summary?.usagePercentage ?? 0;

    return (

        <ScrollView
            style={styles.container}
        >

            <Text style={styles.title}>
                Budget vs Actual
            </Text>
            <Text style={styles.label}>
                Monthly Budget
            </Text>

            <TextInput
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                style={styles.input}
            />

            <TouchableOpacity
                style={[
                    styles.updateButton,
                    loading && { opacity: 0.7 }
                ]}
                onPress={updateBudget}
                disabled={loading}
            >
                <Text style={styles.updateButtonText}>
                    {
                        loading
                            ? "Updating..."
                            : "Update Budget"
                    }
                </Text>
            </TouchableOpacity>
            <View style={styles.progressContainer}>

                <Text style={styles.progressText}>
                    {usagePercentage.toFixed(0)}% Used
                </Text>

                <Progress.Bar
                    progress={usage}
                    width={null}
                    height={20}
                    borderRadius={10}
                />
                {
                    usagePercentage >= 100 ? (

                        <View
                            style={styles.dangerCard}
                        >
                            <Text style={styles.statusText}>
                                🔴 Budget Exceeded
                            </Text>
                        </View>

                    ) : usagePercentage >= 80 ? (

                        <View
                            style={styles.warningCard}
                        >
                            <Text style={styles.statusText}>
                                🟡 Near Budget Limit
                            </Text>
                        </View>

                    ) : (

                        <View
                            style={styles.safeCard}
                        >
                            <Text style={styles.statusText}>
                                🟢 On Track
                            </Text>
                        </View>

                    )
                }

                <Text style={styles.percentage}>
                    {usagePercentage.toFixed(2)}%
                </Text>

            </View>
            <Text style={styles.remainingHighlight}>
                Remaining: ₹ {summary?.remaining ?? 0}
            </Text>
            <View style={styles.summaryGrid}>

                <View style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>
                        Budget
                    </Text>

                    <Text style={styles.cardValue}>
                        ₹ {summary?.budget ?? 0}
                    </Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>
                        Spent
                    </Text>

                    <Text style={styles.cardValue}>
                        ₹ {summary?.spent ?? 0}
                    </Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>
                        Remaining
                    </Text>

                    <Text style={styles.cardValue}>
                        ₹ {summary?.remaining ?? 0}
                    </Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.cardTitle}>
                        Usage
                    </Text>

                    <Text style={styles.cardValue}>
                        {summary?.usagePercentage?.toFixed(0)}%
                    </Text>
                </View>

            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },

    label: {
        fontSize: 16,
    },

    progressContainer: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        elevation: 3,
    },

    progressText: {
        fontSize: 16,
        marginBottom: 10,
    },

    percentage: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "bold",
    },

    danger: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
    },
    input: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        elevation: 2,
    },
    summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 20,
    },

    summaryCard: {
        width: "48%",
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
    },

    cardTitle: {
        color: "#64748B",
        fontSize: 14,
    },

    cardValue: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 5,
    },

    updateButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 20,
    },

    updateButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },

    safeCard: {
        backgroundColor: "#DCFCE7",
        padding: 14,
        borderRadius: 12,
        marginVertical: 15,
    },

    warningCard: {
        backgroundColor: "#FEF3C7",
        padding: 14,
        borderRadius: 12,
        marginVertical: 15,
    },

    dangerCard: {
        backgroundColor: "#FEE2E2",
        padding: 14,
        borderRadius: 12,
        marginVertical: 15,
    },

    statusText: {
        fontWeight: "bold",
        textAlign: "center",
    },
    remainingHighlight: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        marginVertical: 15,
    }
});

export default BudgetScreen;