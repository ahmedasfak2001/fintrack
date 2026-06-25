import {
    NavigationContainer,
    DarkTheme,
    DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

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
import ResendVerificationScreen from "../screens/ResendVerificationScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";

import { navigationRef } from "../utils/NavigationService";
import BottomTabNavigator from "./BottomTabNavigator";
import { useTheme } from "../theme/useTheme";

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ["fintrack://"],
    config: {
        screens: {
            ResetPassword: "reset-password"
        }
    }
};

export default function AppNavigator() {

    const {
        darkMode,
        theme,
    } = useTheme();

    return (
        <>
            <NavigationContainer
                ref={navigationRef}
                linking={linking}
                theme={
                    darkMode
                        ? DarkTheme
                        : DefaultTheme
                }
            >
                <Stack.Navigator initialRouteName="Splash"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: theme.card,
                        },

                        headerTintColor: theme.text,

                        headerTitleStyle: {
                            color: theme.text,
                            fontWeight: "600",
                        },

                        contentStyle: {
                            backgroundColor: theme.background,
                        },
                    }}
                >

                    <Stack.Screen
                        name="Splash"
                        component={SplashScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="MainApp"
                        component={BottomTabNavigator}
                        options={{
                            headerShown: false
                        }}
                    />

                    <Stack.Screen
                        name="Expenses"
                        component={ExpenseListScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="AddExpense"
                        component={AddExpenseScreen}
                        options={{
                            headerShown: false,
                        }}
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
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="Budget"
                        component={BudgetScreen}
                    />

                    <Stack.Screen
                        name="ResendVerification"
                        component={ResendVerificationScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPasswordScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                    <Stack.Screen
                        name="ResetPassword"
                        component={ResetPasswordScreen}
                    />

                    <Stack.Screen
                        name="ChangePassword"
                        component={ChangePasswordScreen}
                    />

                </Stack.Navigator>
            </NavigationContainer>

            <Toast />
        </>
    );
}