import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
} from "react-native";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import api from "../api/api";

import {
    LineChart
} from "react-native-chart-kit";

const TrendScreen = () => {

    const [trendData, setTrendData] =
        useState<any[]>([]);

    const screenWidth =
        Dimensions.get("window").width;

    useEffect(() => {
        fetchTrend();
    }, []);

    const fetchTrend = async () => {

        try {

            const token =
                await AsyncStorage.getItem("token");

            const response =
                await api.get(
                    "/api/expenses/summary/trend",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            setTrendData(
                response.data
            );

        } catch (error) {

            console.error(error);
        }
    };

    const chartData = {

        labels:
            trendData.map(
                item =>
                    item.date.slice(8)
            ),

        datasets: [
            {
                data:
                    trendData.map(
                        item =>
                            Number(item.total)
                    ),
            },
        ],
    };

    return (

        <ScrollView
            style={styles.container}
        >

            <Text style={styles.title}>
                Monthly Trend
            </Text>

            {
                trendData.length > 0 && (

                    <LineChart
                        data={chartData}
                        width={
                            screenWidth - 30
                        }
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",

                            decimalPlaces: 0,

                            color: (opacity = 1) =>
                                `rgba(37, 99, 235, ${opacity})`,

                            labelColor: (opacity = 1) =>
                                `rgba(0, 0, 0, ${opacity})`,

                            propsForDots: {
                                r: "5",
                            },
                        }}
                        bezier
                    />

                )
            }

        </ScrollView>
    );
};

const styles =
    StyleSheet.create({

        container: {
            flex: 1,
            padding: 15,
        },

        title: {
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
        },
    });

export default TrendScreen;