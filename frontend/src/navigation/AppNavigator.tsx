import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SplashScreen from "../screens/SplashScreen";
import ExpenseListScreen from "../screens/ExpenseListScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import EditExpenseScreen from "../screens/EditExpenseScreen";
import MonthlySummaryScreen from "../screens/MonthlySummaryScreen";
import TrendScreen from "../screens/TrendScreen";
import BudgetScreen from "../screens/BudgetScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">

                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                />

                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                />

                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                />

                <Stack.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                />

                <Stack.Screen
                    name="Expenses"
                    component={ExpenseListScreen}
                />

                <Stack.Screen
                    name="AddExpense"
                    component={AddExpenseScreen}
                />

                <Stack.Screen
                    name="EditExpense"
                    component={EditExpenseScreen}
                />

                <Stack.Screen
                    name="MonthlySummary"
                    component={MonthlySummaryScreen}
                />

                <Stack.Screen
                    name="Trend"
                    component={TrendScreen}
                />

                <Stack.Screen
                    name="Budget"
                    component={BudgetScreen}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}