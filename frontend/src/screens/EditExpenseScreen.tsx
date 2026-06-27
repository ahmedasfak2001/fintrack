import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
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
import { showError, showSuccess } from "../utils/toast";
import { useTheme } from "../theme/useTheme";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import AnimatedActionButton from "../components/AnimatedActionButton";


const EditExpenseScreen = ({
    route,
    navigation,
}: any) => {

    const { theme } = useTheme();
    const { expense } = route.params;
    const [success, setSuccess] = useState(false);
    const [amount, setAmount] =
        useState(expense.amount.toString());

    const [category, setCategory] =
        useState(expense.category);

    const [description, setDescription] =
        useState(expense.description);

    const [categories, setCategories] =
        useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [expenseDate, setExpenseDate] =
        useState(
            expense?.expenseDate
                ? new Date(
                    expense.expenseDate
                )
                : new Date()
        );

    const [showDatePicker, setShowDatePicker] =
        useState(false);

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
            setLoading(true);
            const token =
                await AsyncStorage.getItem("token");
            const request = {
                amount: Number(amount),
                category,
                description,
                expenseDate:
                    expenseDate
                        .toISOString()
                        .split("T")[0],
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
            setSuccess(true);
            showSuccess(response.data);
            setTimeout(() => {
                setSuccess(false);
                navigation.goBack();
            }, 1000);

        }
        catch (error) {

            console.error(error);

            showError(
                "Failed to update expense"
            );
        } finally {

            setLoading(false);
        }

    };

    return (
        <ScrollView
            style={[
                styles.container,
                {
                    backgroundColor: theme.background,
                },
            ]}
            contentContainerStyle={{
                paddingBottom: 30,
            }}
        >

            <Text
                style={[
                    styles.subtitle,
                    { color: theme.secondaryText },
                ]}
            >
                Update your expense details
            </Text>
            <Text
                style={[
                    styles.label,
                    { color: theme.secondaryText },
                ]}
            >
                Amount
            </Text>
            <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.card,
                        color: theme.text,
                        borderColor: theme.border,
                    },
                ]}
                placeholderTextColor={theme.secondaryText}
            />
            <Text
                style={[
                    styles.label,
                    { color: theme.secondaryText },
                ]}
            >
                Category
            </Text>

            <Dropdown
                maxHeight={300}
                data={categories.map((item) => ({
                    label: item,
                    value: item,
                }))}
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
                    { color: theme.secondaryText },
                ]}
            >
                Description
            </Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.card,
                        color: theme.text,
                        borderColor: theme.border,
                    },
                ]}
                placeholderTextColor={theme.secondaryText}
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
                    styles.updateButton,
                    loading &&
                    styles.disabledButton,
                ]}
                onPress={handleUpdateExpense}
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
                                styles.updateButtonText
                            }
                        >
                            Update Expense
                        </Text>

                    )
                }

            </TouchableOpacity> */}
            <AnimatedActionButton
                title="Update Expense"
                successTitle="Updated"
                loading={loading}
                success={success}
                onPress={handleUpdateExpense}
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

    picker: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 18,
    },

    subtitle: {
        textAlign: "center",
        color: "#64748B",
        marginBottom: 20,
    },
    updateButton: {
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

    updateButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    dropdown: {
        height: 55,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 18,
    },
});

export default EditExpenseScreen;