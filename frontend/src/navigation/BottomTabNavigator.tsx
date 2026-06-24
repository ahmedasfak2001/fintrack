import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "../screens/DashboardScreen";
import ExpenseListScreen from "../screens/ExpenseListScreen";
import TrendScreen from "../screens/TrendScreen";
import BudgetScreen from "../screens/BudgetScreen";
import ProfileScreen from "../screens/ProfileScreen";

import {
  House,
  Receipt,
  ChartColumn,
  Target,
  User,
  Plus,
} from "lucide-react-native";
import AddExpenseScreen from "../screens/AddExpenseScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home")
            return <House color={color} size={size} />;

          if (route.name === "Expenses")
            return <Receipt color={color} size={size} />;

          if (route.name === "Add")
            return <Plus color={color} size={size} />;

          if (route.name === "Trends")
            return <ChartColumn color={color} size={size} />;

          if (route.name === "Budget")
            return <Target color={color} size={size} />;

          if (route.name === "Profile")
            return <User color={color} size={size} />;

          return null;
        },

        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#888",
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Expenses" component={ExpenseListScreen} />
      <Tab.Screen name="Add" component={AddExpenseScreen}/>
      <Tab.Screen name="Trends" component={TrendScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}