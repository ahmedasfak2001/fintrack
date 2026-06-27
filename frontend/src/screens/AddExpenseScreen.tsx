import React, { useState, useEffect } from "react";
import {
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/api";
import { AddExpenseRequest } from "../types/AddExpenseRequest";
import { COLORS } from "../constants/colors";
import { showError, showSuccess } from "../utils/toast";
import { useTheme } from "../theme/useTheme";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import AnimatedActionButton from "../components/AnimatedActionButton";

const AddExpenseScreen = ({ navigation }: any) => {

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { theme } = useTheme();
    const categoryOptions = categories.map(category => ({
        label: category,
        value: category,
    }));

    const [expenseDate, setExpenseDate] =
        useState(new Date());

    const [showDatePicker, setShowDatePicker] =
        useState(false);

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

        if (!amount.trim()) {
            showError("Amount is required");
            return;
        }

        if (Number(amount) <= 0) {
            showError("Please enter a valid amount");
            return;
        }

        if (!category.trim()) {
            showError("Please select a category");
            return;
        }

        if (!description.trim()) {
            showError("Description is required");
            return;
        }

        try {
            setLoading(true);
            const token =
                await AsyncStorage.getItem("token");

            const request: AddExpenseRequest = {
                amount: Number(amount),
                category,
                description,
                expenseDate: expenseDate
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

            setSuccess(true);

            showSuccess(response.data);

            setTimeout(() => {
                setSuccess(false);
                navigation.goBack();
            }, 1000);

            setAmount("");
            setDescription("");

            if (categories.length > 0) {
                setCategory(categories[0]);
            }

        } catch (error) {

            console.error(error);

            showError(
                "Failed to add expense"
            );
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <ScrollView
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
            contentContainerStyle={{
                paddingBottom: 30,
                paddingTop: 40
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
                Add Expense
            </Text>
            <Text
                style={[
                    styles.label,
                    {
                        color:
                            theme.secondaryText,
                    },
                ]}
            >
                Amount
            </Text>
            <TextInput
                placeholder="₹ Enter amount"
                placeholderTextColor={
                    theme.secondaryText
                }
                style={[
                    styles.input,
                    {
                        backgroundColor:
                            theme.card,
                        borderColor:
                            theme.border,
                        color:
                            theme.text,
                    },
                ]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />
            <Text
                style={[
                    styles.label,
                    {
                        color:
                            theme.secondaryText,
                    },
                ]}
            >
                Category
            </Text>

            <Dropdown
                maxHeight={300}
                data={categoryOptions}
                labelField="label"
                valueField="value"
                value={category}
                placeholder="Select Category"
                search
                searchPlaceholder="Search Category..."
                onChange={(item) =>
                    setCategory(item.value)
                }
                style={[
                    styles.dropdown,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    },
                ]}
                containerStyle={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderWidth: 1,
                    borderRadius: 12,
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
                inputSearchStyle={{
                    color: theme.text,
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: 8,
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
            <Text
                style={[
                    styles.label,
                    {
                        color:
                            theme.secondaryText,
                    },
                ]}
            >
                Description
            </Text>
            <TextInput
                placeholder="Enter description"
                placeholderTextColor={
                    theme.secondaryText
                }
                value={description}
                onChangeText={setDescription}
                style={[
                    styles.input,
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

            <Text
                style={[
                    styles.label,
                    {
                        color: theme.secondaryText,
                    },
                ]}
            >
                Expense Date
            </Text>

            <TouchableOpacity
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    },
                ]}
                onPress={() =>
                    setShowDatePicker(true)
                }
            >
                <Text
                    style={{
                        color: theme.text,
                    }}
                >
                    {expenseDate.toLocaleDateString()}
                </Text>
            </TouchableOpacity>

            {
                showDatePicker && (
                    <DateTimePicker
                        value={expenseDate}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={(
                            event,
                            selectedDate
                        ) => {

                            setShowDatePicker(false);

                            if (selectedDate) {

                                setExpenseDate(
                                    selectedDate
                                );

                            }
                        }}
                    />
                )
            }

            {/* <TouchableOpacity
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

            </TouchableOpacity> */}
            <AnimatedActionButton
                title="Save Expense"
                loading={loading}
                success={success}
                onPress={handleAddExpense}
            />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderRadius: 12,
        padding: 14,
        marginBottom: 18,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    dropdown: {
        height: 55,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 18,
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