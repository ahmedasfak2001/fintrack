import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardScreen = ({ navigation }: any) => {

    const logout = async () => {

        await AsyncStorage.removeItem("token");

        navigation.replace("Login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Welcome to FinTrack Dashboard
            </Text>

            <Button
                title="Add Expense"
                onPress={() =>
                    navigation.navigate("AddExpense")
                }
            />

            <Button
                title="View Expenses"
                onPress={() =>
                    navigation.navigate("Expenses")
                }
            />

            <Button
                title="Logout"
                onPress={logout}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default DashboardScreen;