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
    TextInput
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import api from "../api/api";

const ExpenseListScreen = ({ navigation }: any) => {

    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState<string[]>([]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchText, setSearchText] = useState("");
    const [refreshing, setRefreshing] = useState(false);
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

            fetchExpenses();

        } catch (error) {

            console.error(error);

            Alert.alert(
                "Error",
                "Failed to delete expense"
            );
        }
    };

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

                        <Text>
                            ₹ {item.amount}
                        </Text>

                        <Text>
                            {item.category}
                        </Text>

                        <Text>
                            {item.description}
                        </Text>

                        <Button
                            title="Edit"
                            onPress={() =>
                                navigation.navigate(
                                    "EditExpense",
                                    {
                                        expense: item,
                                    }
                                )
                            }
                        />

                        <Button
                            title="Delete"
                            onPress={() =>
                                confirmDelete(item.id)
                            }
                        />

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
    card: {
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 8,
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
});

export default ExpenseListScreen;