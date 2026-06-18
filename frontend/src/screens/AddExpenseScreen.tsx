import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

import api from "../api/api";
import { AddExpenseRequest } from "../types/AddExpenseRequest";
import { COLORS } from "../constants/colors";

const AddExpenseScreen = ({ navigation }: any) => {

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);

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
            setLoading(true);
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
                            navigation.goBack(),
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
        } finally {

            setLoading(false);
        }

    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                paddingBottom: 30,
            }}
        >

            <Text style={styles.title}>
                Add Expense
            </Text>
            <Text style={styles.label}>
                Amount
            </Text>
            <TextInput
                placeholder="₹ Enter amount"
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
            <Text style={styles.label}>
                Description
            </Text>
            <TextInput
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />

            {/* <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddExpense}
            >
                <Text style={styles.addButtonText}>
                    Add Expense
                </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
                style={[
                    styles.saveButton,
                    loading &&
                    styles.disabledButton,
                ]}
                onPress={handleAddExpense}
                disabled={loading}
            >

                {
                    loading ? (

                        <ActivityIndicator
                            color="#FFFFFF"
                        />

                    ) : (

                        <Text
                            style={
                                styles.saveButtonText
                            }
                        >
                            Save Expense
                        </Text>

                    )
                }

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
        elevation: 2,
    },

    addButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 10,
    },

    addButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    saveButton: {
        backgroundColor:
            COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },

    disabledButton: {
        opacity: 0.7,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddExpenseScreen;