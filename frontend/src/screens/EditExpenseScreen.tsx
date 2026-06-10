import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { Picker } from "@react-native-picker/picker";
import {
    TextInput,
    Button,
    Alert,
} from "react-native";
import { COLORS } from "../constants/colors";


const EditExpenseScreen = ({
    route,
    navigation,
}: any) => {

    const { expense } = route.params;

    const [amount, setAmount] =
        useState(expense.amount.toString());

    const [category, setCategory] =
        useState(expense.category);

    const [description, setDescription] =
        useState(expense.description);

    const [categories, setCategories] =
        useState<string[]>([]);

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

        } catch (error) {

            console.error(error);
        }
    };

    const handleUpdateExpense = async () => {

        try {

            const token =
                await AsyncStorage.getItem("token");
            const request = {
                amount: Number(amount),
                category,
                description,
                expenseDate: expense.expenseDate,
            };
            const response =
                await api.put(
                    `/api/expenses/${expense.id}`,
                    request,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            Alert.alert(
                "Success",
                response.data,
                [
                    {
                        text: "OK",
                        // onPress: () =>
                        //     navigation.navigate(
                        //         "Expenses"
                        //     ),
                        onPress: () => {

                            setTimeout(() => {

                                navigation.goBack();

                            }, 500);
                        },
                    },
                ]
            );

        }
        catch (error) {

            console.error(error);

            Alert.alert(
                "Error",
                "Failed to update expense"
            );
        }
        // catch (error: any) {

        //     console.log(
        //         "STATUS:",
        //         error.response?.status
        //     );

        //     console.log(
        //         "DATA:",
        //         error.response?.data
        //     );

        //     Alert.alert(
        //         "Error",
        //         JSON.stringify(
        //             error.response?.data
        //         )
        //     );
        // }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                paddingBottom: 30,
            }}
        >

            <Text style={styles.subtitle}>
                Update your expense details
            </Text>
            <Text style={styles.label}>
                Amount
            </Text>
            <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />
            <Text style={styles.label}>
                Category
            </Text>
            <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
            >
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
            <Text style={styles.label}>
                Description
            </Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />

            {/* <Button
                title="Update Expense"
                onPress={() =>
                    Alert.alert(
                        "Next Step"
                    )
                }
            /> */}
            <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateExpense}
            >
                <Text style={styles.updateButtonText}>
                    Update Expense
                </Text>
            </TouchableOpacity>

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
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 25,
        textAlign: "center",
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        color: "#64748B",
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        marginBottom: 18,
        elevation: 2,
    },

    picker: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 18,
    },

    updateButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 10,
    },

    updateButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    subtitle: {
        textAlign: "center",
        color: "#64748B",
        marginBottom: 20,
    },
});

export default EditExpenseScreen;