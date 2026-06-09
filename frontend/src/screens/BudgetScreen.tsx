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
} from "react-native";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import api from "../api/api";

import {
    BudgetSummaryResponse,
} from "../types/BudgetSummaryResponse";
import * as Progress from "react-native-progress";

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

            <Button
                title={
                    loading
                        ? "Updating..."
                        : "Update Budget"
                }
                onPress={updateBudget}
            />
            <View style={styles.progressContainer}>

                <Text style={styles.progressText}>
                    Budget Usage
                </Text>

                <Progress.Bar
                    progress={usage}
                    width={null}
                    height={20}
                    borderRadius={10}
                />
                {
                    usagePercentage >= 80 &&
                    usagePercentage < 100 && (

                        <Text style={styles.warning}>
                            ⚠️ Warning:
                            You have used more than
                            80% of your budget.
                        </Text>
                    )
                }
                {
                    usagePercentage >= 100 && (

                        <Text style={styles.danger}>
                            🚨 Budget Exceeded!
                            Reduce spending immediately.
                        </Text>
                    )
                }

                <Text style={styles.percentage}>
                    {usagePercentage.toFixed(2)}%
                </Text>

            </View>

            <View style={styles.card}>
                <Text style={styles.label}>
                    Monthly Budget
                </Text>

                <Text style={styles.value}>
                    ₹ {summary?.budget ?? 0}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>
                    Spent
                </Text>

                <Text style={styles.value}>
                    ₹ {summary?.spent ?? 0}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>
                    Remaining
                </Text>

                <Text style={styles.value}>
                    ₹ {summary?.remaining ?? 0}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>
                    Usage %
                </Text>

                <Text style={styles.value}>
                    {
                        summary?.usagePercentage
                            ?.toFixed(2)
                    } %
                </Text>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
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
        marginBottom: 15,
    },

    label: {
        fontSize: 16,
    },

    value: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 5,
    },
    progressContainer: {
        marginBottom: 20,
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

    warning: {
        fontSize: 16,
        marginBottom: 15,
    },

    danger: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
});

export default BudgetScreen;