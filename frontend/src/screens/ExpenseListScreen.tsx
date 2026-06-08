import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

const ExpenseListScreen = () => {

    const [expenses, setExpenses] = useState([]);

    // useEffect(() => {
    //     fetchExpenses();
    // }, []);

    useFocusEffect(
        useCallback(() => {

            fetchExpenses();

        }, [])
    );

    const fetchExpenses = async () => {

        try {

            const token =
                await AsyncStorage.getItem("token");

            const response =
                await api.get(
                    "/api/expenses?page=0&size=10",
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

    return (
        <View style={styles.container}>

            <FlatList
                data={expenses}
                keyExtractor={(item: any) => item.id}
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
});

export default ExpenseListScreen;