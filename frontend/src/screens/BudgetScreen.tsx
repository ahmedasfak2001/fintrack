import React, {
    useCallback,
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
import { useTheme } from "../theme/useTheme";

import {
    BudgetSummaryResponse,
} from "../types/BudgetSummaryResponse";
import * as Progress from "react-native-progress";
import { COLORS } from "../constants/colors";
import { showError, showSuccess } from "../utils/toast";
import { useFocusEffect } from "@react-navigation/native";

const BudgetScreen = ({ navigation }: any) => {

    const { theme } = useTheme();
    const [budget, setBudget] = useState("");

    const [loading, setLoading] = useState(false);

    const fetchBudget = async () => {

        try {

            const token =
                await AsyncStorage.getItem(
                    "token"
                );
            const today = new Date();

            const month = today.getMonth() + 1;
            const year = today.getFullYear();

            const url = `/api/expenses/budget?month=${month}&year=${year}`;

            console.log("Budget URL:", url);
            const response = await api.get(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Budget Response:", response.data);
            // const response =
            //     await api.get(
            //         "/api/expenses/budget",
            //         {
            //             headers: {
            //                 Authorization:
            //                     `Bearer ${token}`,
            //             },
            //         }
            //     );

            setBudget(
                response.data.budget
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

    useFocusEffect(
        useCallback(() => {
            fetchBudgetSummary();
            fetchBudget();
        }, [])
    );

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
                console.log(
                    "Budget Summary:",
                    response.data
                );

                console.log(
                    "Usage Type:",
                    typeof response.data.usagePercentage
                );

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

            // await api.put(
            //     "/api/expenses/budget",
            //     {
            //         monthlyBudget:
            //             Number(budget),
            //     },
            //     {
            //         headers: {
            //             Authorization:
            //                 `Bearer ${token}`,
            //         },
            //     }
            // );
            const today = new Date();

            await api.put(
                "/api/expenses/budget",
                {
                    budget: Number(budget),
                    month: today.getMonth() + 1,
                    year: today.getFullYear(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchBudgetSummary();

            showSuccess(
                "Budget updated"
            );

        } catch (error) {

            console.error(error);

            showError(
                "Failed to update budget"
            );
        } finally {

            setLoading(false);
        }
    };

    const usagePercentage =
        parseFloat(
            String(
                summary?.usagePercentage ?? 0
            )
        ) || 0;

    const usage =
        usagePercentage / 100;

    return (

        <ScrollView
            style={[
                styles.container,
                {
                    backgroundColor: theme.background,
                },
            ]}
            contentContainerStyle={{
                paddingBottom: 120
            }}
        >

            <Text
                style={[
                    styles.title,
                    {
                        color: theme.text,
                    },
                ]}
            >
                Budget vs Actual
            </Text>
            <Text
                style={[
                    styles.label,
                    {
                        color: theme.text,
                        paddingBottom: 10
                    },
                ]}
            >
                Monthly Budget
            </Text>

            <TextInput
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                        borderWidth: 1,
                    },
                ]}
            />

            <TouchableOpacity
                style={[
                    styles.updateButton,
                    loading && { opacity: 0.7 }
                ]}
                onPress={async () => {
                    await updateBudget();
                    navigation.goBack();
                }}
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
            <View
                style={[
                    styles.progressContainer,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        borderWidth: 1,
                    },
                ]}
            >

                <Text
                    style={[
                        styles.progressText,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    {(usagePercentage ?? 0).toFixed(0)}% Used
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

                <Text
                    style={[
                        styles.percentage,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    {(usagePercentage ?? 0).toFixed(2)}%
                </Text>

            </View>
            <Text
                style={[
                    styles.remainingHighlight,
                    {
                        color: theme.text,
                    },
                ]}
            >
                Remaining: ₹ {summary?.remaining ?? 0}
            </Text>
            <View style={styles.summaryGrid}>

                <View
                    style={[
                        styles.summaryCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                            borderWidth: 1,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.cardTitle,
                            {
                                color: theme.secondaryText,
                            },
                        ]}
                    >
                        Budget
                    </Text>

                    <Text
                        style={[
                            styles.cardValue,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        ₹ {summary?.budget ?? 0}
                    </Text>
                </View>

                <View
                    style={[
                        styles.summaryCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                            borderWidth: 1,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.cardTitle,
                            {
                                color: theme.secondaryText,
                            },
                        ]}
                    >
                        Spent
                    </Text>

                    <Text
                        style={[
                            styles.cardValue,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        ₹ {summary?.spent ?? 0}
                    </Text>
                </View>

                <View
                    style={[
                        styles.summaryCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                            borderWidth: 1,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.cardTitle,
                            {
                                color: theme.secondaryText,
                            },
                        ]}
                    >
                        Remaining
                    </Text>

                    <Text
                        style={[
                            styles.cardValue,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        ₹ {summary?.remaining ?? 0}
                    </Text>
                </View>

                <View
                    style={[
                        styles.summaryCard,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                            borderWidth: 1,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.cardTitle,
                            {
                                color: theme.secondaryText,
                            },
                        ]}
                    >
                        Usage
                    </Text>

                    <Text
                        style={[
                            styles.cardValue,
                            {
                                color: theme.text,
                            },
                        ]}
                    >
                        {Number(
                            summary?.usagePercentage ?? 0
                        ).toFixed(0)}%
                    </Text>
                </View>

            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
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