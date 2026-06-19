import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Button,
    Alert,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import api from "../api/api";
import { COLORS } from "../constants/colors";
import { showError, showSuccess } from "../utils/toast";

const ExpenseListScreen = ({ navigation }: any) => {

    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState<string[]>([]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchText, setSearchText] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const onRefresh = async () => {

        setRefreshing(true);

        await fetchExpenses();

        setRefreshing(false);
    };

    // useEffect(() => {
    //     fetchExpenses();
    // }, []);

    // useFocusEffect(
    //     useCallback(() => {

    //         fetchExpenses();

    //     }, [])
    // );

    useFocusEffect(
        useCallback(() => {

            console.log(
                "Expense List Refreshed"
            );

            fetchExpenses();
            fetchCategories();

        }, [])
    );

    useEffect(() => {

        fetchExpenses();

    }, [
        selectedCategory,
        searchText,
    ]);

    // const fetchExpenses = async () => {
    const fetchExpenses = async (): Promise<void> => {

        try {

            setLoading(true);

            const token =
                await AsyncStorage.getItem("token");

            // const response =
            //     await api.get(
            //         "/api/expenses?page=0&size=100",
            // const url =
            //     selectedCategory
            //         ? `/api/expenses?page=0&size=100&category=${selectedCategory}`
            //         : "/api/expenses?page=0&size=100";
            let url =
                "/api/expenses?page=0&size=100";

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

            setExpenses(response.data.content);

        } catch (error) {

            console.error(error);
            showError(
                "Failed to load expenses"
            );
        } finally {

            setLoading(false);
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
            fetchExpenses();

        } catch (error) {

            console.error(error);

            // Alert.alert(
            //     "Error",
            //     "Failed to delete expense"
            // );

            showError(
                "Failed to delete expense"
            );
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
                    Loading Expenses...
                </Text>

            </View>
        );
    }
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="🔍 Search Expenses..."
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
            />
            <Picker
                selectedValue={selectedCategory}
                onValueChange={setSelectedCategory}
            >

                <Picker.Item
                    label="All Categories"
                    value=""
                />

                {
                    categories.map(category => (
                        <Picker.Item
                            key={category}
                            label={category}
                            value={category}
                        />
                    ))
                }

            </Picker>
            <FlatList
                data={expenses}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                keyExtractor={(item: any) => item.id}

                ListEmptyComponent={
                    <View style={styles.emptyContainer}>

                        <Text style={styles.emptyIcon}>
                            📭
                        </Text>

                        <Text style={styles.emptyTitle}>
                            No Expenses Found
                        </Text>

                        <Text style={styles.emptySubtitle}>
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
                // renderItem={({ item }: any) => (
                //     <View style={styles.card}>
                //         <Text>
                //             ₹ {item.amount}
                //         </Text>

                //         <Text>
                //             {item.category}
                //         </Text>

                //         <Text>
                //             {item.description}
                //         </Text>
                //     </View>
                // )}
                renderItem={({ item }: any) => (

                    <View style={styles.card}>

                        <View style={styles.cardHeader}>

                            <Text style={styles.categoryText}>
                                {item.category}
                            </Text>

                            <Text style={styles.amountText}>
                                ₹ {item.amount}
                            </Text>

                        </View>

                        <Text style={styles.descriptionText}>
                            {item.description}
                        </Text>

                        <Text style={styles.dateText}>
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
        padding: 15,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
        fontSize: 16,
    },
    card: {

        backgroundColor: "#FFFFFF",
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
        backgroundColor:
            COLORS.background,
    },

    loadingText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: "600",
        color: "#64748B",
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 80,
        paddingHorizontal: 20,
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