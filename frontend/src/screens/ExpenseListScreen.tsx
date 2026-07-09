import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Alert,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/api";
import { COLORS } from "../constants/colors";
import { showError, showSuccess } from "../utils/toast";
import { useTheme } from "../theme/useTheme";
import { Dropdown } from "react-native-element-dropdown";

const ExpenseListScreen = ({ navigation }: any) => {

    const { theme } = useTheme();
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState<string[]>([]);

    const [selectedCategory, setSelectedCategory] =
        useState<string | null>(null);
    const [searchText, setSearchText] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const categoryOptions = [
        {
            label: "All Categories",
            value: "",
        },

        ...categories.map(category => ({
            label: category,
            value: category,
        })),
    ];
    const monthOptions = Array.from({ length: 24 }, (_, index) => {
        const date = new Date();

        date.setMonth(date.getMonth() - index);

        return {
            label: date.toLocaleString("default", {
                month: "long",
                year: "numeric",
            }),
            value: `${date.getFullYear()}-${date.getMonth() + 1}`,
        };
    });
    const today = new Date();

    const [selectedMonthYear, setSelectedMonthYear] = useState(
        `${today.getFullYear()}-${today.getMonth() + 1}`
    );
    const [year, month] = selectedMonthYear.split("-");
    const onRefresh = async () => {

        setRefreshing(true);

        await fetchExpenses(false);

        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {

            console.log(
                "Expense List Refreshed"
            );

            fetchExpenses(true);
            fetchCategories();

        }, [])
    );

    useEffect(() => {

        const timer = setTimeout(() => {

            fetchExpenses(false);

        }, 500);

        return () => clearTimeout(timer);

    }, [
        selectedCategory,
        searchText,
        selectedMonthYear
    ]);

    // const fetchExpenses = async () => {
    const fetchExpenses = async (
        showLoader: boolean = true
    ): Promise<void> => {

        try {

            if (showLoader) {
                setLoading(true);
            }

            const token =
                await AsyncStorage.getItem("token");
    
            let url =
                `/api/expenses?page=0&size=100` +
                `&month=${month}` +
                `&year=${year}`;

            if (selectedCategory) {

                url +=
                    `&category=${selectedCategory}`;
            }

            if (searchText.trim()) {

                url +=
                    `&search=${searchText.trim()}`;
            }

            const response =
                await api.get(
                    url,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            console.log(response.data);
            console.log(url);

            setExpenses(response.data.content);

        } catch (error) {

            console.error(error);
            showError(
                "Failed to load expenses"
            );
        } finally {

            if (showLoader) {
                setLoading(false);
            }
        }
    };

    const fetchCategories = async () => {

        try {

            const token =
                await AsyncStorage.getItem("token");

            const response =
                await api.get(
                    "/api/expenses/categories",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setCategories(response.data);

        } catch (error) {

            console.error(error);
            showError(
                "Failed to load categories"
            );
        }
    };

    const confirmDelete = (
        expenseId: string
    ) => {

        Alert.alert(
            "Delete Expense",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                        deleteExpense(expenseId),
                },
            ]
        );
    };
    const deleteExpense = async (
        expenseId: string
    ) => {

        try {

            const token =
                await AsyncStorage.getItem("token");

            await api.delete(
                `/api/expenses/${expenseId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );
            showSuccess(
                "Expense deleted successfully"
            );
            fetchExpenses(false);

        } catch (error) {

            console.error(error);

            showError(
                "Failed to delete expense"
            );
        }
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
                    Loading Expenses...
                </Text>

            </View>
        );
    }

    const themedCard = {
        backgroundColor: theme.card,
        borderColor: theme.border,
        borderWidth: 1,
    };
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
        >
            <TextInput
                placeholder="🔍 Search Expenses..."
                placeholderTextColor={
                    theme.secondaryText
                }
                value={searchText}
                onChangeText={setSearchText}
                style={[
                    styles.searchInput,
                    {
                        backgroundColor:
                            theme.card,
                        borderColor:
                            theme.border,
                        color:
                            theme.text,
                    },
                ]}
            />
            <Dropdown
                maxHeight={300}
                data={monthOptions}
                labelField="label"
                valueField="value"
                value={selectedMonthYear}
                onChange={(item) => setSelectedMonthYear(item.value)}
                placeholder="Select Month"

                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    height: 50,
                    marginBottom: 10,
                }}

                containerStyle={{
                    backgroundColor: theme.card,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                }}

                placeholderStyle={{
                    color: theme.secondaryText,
                }}

                selectedTextStyle={{
                    color: theme.text,
                }}

                itemTextStyle={{
                    color: theme.text,
                }}

                activeColor={
                    theme.card === "#FFFFFF"
                        ? "#EEF2FF"
                        : "#334155"
                }

                renderRightIcon={() => (
                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 18,
                        }}
                    >
                        ▼
                    </Text>
                )}
            />

            <Dropdown
                maxHeight={300}
                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    height: 50,
                    marginBottom: 10,
                }}
                containerStyle={{
                    backgroundColor: theme.card,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                }}
                placeholderStyle={{
                    color: theme.secondaryText,
                    fontSize: 16,
                    opacity: 1,
                }}
                selectedTextStyle={{
                    color: theme.text,
                }}
                itemTextStyle={{
                    color: theme.text,
                }}
                inputSearchStyle={{
                    color: theme.text,
                    backgroundColor: theme.card,
                    borderRadius: 8,
                    borderColor: theme.border,
                    paddingHorizontal: 10,
                }}
                search
                searchPlaceholder="Search Category..."
                data={categoryOptions}
                labelField="label"
                valueField="value"
                placeholder="Filter by Category"
                value={selectedCategory}
                onChange={(item) => {
                    setSelectedCategory(item.value);
                }}
                activeColor={
                    theme.card === "#FFFFFF"
                        ? "#EEF2FF"
                        : "#334155"
                }
                renderRightIcon={() => (
                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 18,
                        }}
                    >
                        ▼
                    </Text>
                )}
            />

            <FlatList
                data={expenses}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={{
                    paddingBottom: 30,
                    flexGrow: 1,
                }}
                keyExtractor={(item: any) => item.id}

                ListEmptyComponent={
                    <View style={styles.emptyContainer}>

                        <Text style={styles.emptyIcon}>
                            📭
                        </Text>

                        <Text
                            style={[
                                styles.emptyTitle,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                        >
                            No Expenses Found
                        </Text>

                        <Text
                            style={[
                                styles.emptySubtitle,
                                {
                                    color:
                                        theme.secondaryText,
                                },
                            ]}
                        >
                            Start tracking your spending by adding your first expense.
                        </Text>

                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() =>
                                navigation.navigate(
                                    "AddExpense"
                                )
                            }
                        >
                            <Text style={styles.emptyButtonText}>
                                ➕ Add Expense
                            </Text>
                        </TouchableOpacity>

                    </View>
                }

                renderItem={({ item }: any) => (

                    <View
                        style={[
                            styles.card,
                            themedCard,
                        ]}
                    >

                        <View style={styles.cardHeader}>

                            <Text
                                style={[
                                    styles.categoryText,
                                    {
                                        color:
                                            theme.text,
                                    },
                                ]}
                            >
                                {item.category}
                            </Text>

                            <Text
                                style={[
                                    styles.amountText,
                                    {
                                        color:
                                            theme.text,
                                    },
                                ]}
                            >
                                ₹ {item.amount}
                            </Text>

                        </View>

                        <Text
                            style={[
                                styles.descriptionText,
                                {
                                    color:
                                        theme.text,
                                },
                            ]}
                        >
                            {item.description}
                        </Text>

                        <Text
                            style={[
                                styles.dateText,
                                {
                                    color:
                                        theme.secondaryText,
                                },
                            ]}
                        >
                            {item.expenseDate}
                        </Text>

                        <View style={styles.actionRow}>

                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() =>
                                    navigation.navigate(
                                        "EditExpense",
                                        {
                                            expense: item,
                                        }
                                    )
                                }
                            >
                                <Text style={styles.actionText}>
                                    ✏️ Edit
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() =>
                                    confirmDelete(item.id)
                                }
                            >
                                <Text style={styles.actionText}>
                                    🗑 Delete
                                </Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 60,
    },
    searchInput: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    categoryText: {
        fontSize: 16,
        fontWeight: "bold",
    },

    amountText: {
        fontSize: 22,
        fontWeight: "bold",
    },

    descriptionText: {
        marginTop: 10,
        fontSize: 15,
    },

    dateText: {
        marginTop: 6,
        color: "#64748B",
        fontSize: 12,
    },

    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },

    editButton: {
        flex: 1,
        backgroundColor: "#2563EB",
        padding: 10,
        borderRadius: 10,
        marginRight: 8,
        alignItems: "center",
    },

    deleteButton: {
        flex: 1,
        backgroundColor: "#DC2626",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },

    actionText: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },

    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#64748B",
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 40,
    },

    loadingText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: "600",
        color: "#64748B",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        minHeight: 400,
    },

    emptyIcon: {
        fontSize: 60,
        marginBottom: 15,
    },

    emptyTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },

    emptySubtitle: {
        textAlign: "center",
        color: "#64748B",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },

    emptyButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },

    emptyButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ExpenseListScreen;