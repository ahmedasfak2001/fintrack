import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { Picker } from "@react-native-picker/picker";
import {
    TextInput,
    Button,
    Alert,

} from "react-native";


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
        <View style={styles.container}>

            <Text style={styles.title}>
                Edit Expense
            </Text>

            <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />

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
            <Button
                title="Update Expense"
                onPress={handleUpdateExpense}
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

export default EditExpenseScreen;