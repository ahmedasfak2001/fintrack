import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

import api from "../api/api";
import { AddExpenseRequest } from "../types/AddExpenseRequest";

const AddExpenseScreen = ({ navigation }: any) => {

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

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

            if (response.data.length > 0) {
                setCategory(response.data[0]);
            }

        } catch (error) {

            console.error(
                "Error fetching categories:",
                error
            );
        }
    };

    const handleAddExpense = async () => {

        try {

            const token =
                await AsyncStorage.getItem("token");

            const request: AddExpenseRequest = {
                amount: Number(amount),
                category,
                description,
                expenseDate: new Date()
                    .toISOString()
                    .split("T")[0],
            };

            const response =
                await api.post(
                    "/api/expenses",
                    request,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            // Alert.alert(
            //     "Success",
            //     response.data
            // );

            Alert.alert(
                "Success",
                response.data,
                [
                    {
                        text: "OK",
                        onPress: () =>
                            navigation.navigate("Expenses"),
                    },
                ]
            );

            setAmount("");
            setDescription("");

            if (categories.length > 0) {
                setCategory(categories[0]);
            }

        } catch (error) {

            console.error(error);

            Alert.alert(
                "Error",
                "Failed to add expense"
            );
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Add Expense
            </Text>

            <TextInput
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />

            <Picker
                selectedValue={category}
                onValueChange={(value) =>
                    setCategory(value)
                }
                style={styles.picker}
            >
                {categories.map((category) => (
                    <Picker.Item
                        key={category}
                        label={category}
                        value={category}
                    />
                ))}
            </Picker>

            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />

            <Button
                title="Add Expense"
                onPress={handleAddExpense}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    picker: {
        marginBottom: 15,
    },
});

export default AddExpenseScreen;