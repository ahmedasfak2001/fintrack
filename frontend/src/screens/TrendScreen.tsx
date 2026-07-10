import React, {
    useEffect,
    useState,
    useCallback,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
} from "react-native";

import {
    ActivityIndicator,
} from "react-native";

import { useTheme }
    from "../theme/useTheme";

import { COLORS }
    from "../constants/colors";

import AsyncStorage
    from "@react-native-async-storage/async-storage";

import api from "../api/api";

import {
    LineChart
} from "react-native-chart-kit";
import { useFocusEffect }
    from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";

const TrendScreen = () => {

    const { theme } = useTheme();

    const [loading, setLoading] =
        useState(true);

    const [trendData, setTrendData] =
        useState<any[]>([]);

    const screenWidth =
        Dimensions.get("window").width;

    const monthOptions = Array.from({ length: 24 }, (_, index) => {
        const date = new Date();

        date.setMonth(date.getMonth() - index);

        return {
            label: date.toLocaleString("default", {
                month: "long",
                year: "numeric",
            }),
            value: `${date.getFullYear()}-${date.getMonth() + 1}`,
        };
    });

    const today = new Date();

    const [selectedMonthYear, setSelectedMonthYear] = useState(
        `${today.getFullYear()}-${today.getMonth() + 1}`
    );

    const [year, month] = selectedMonthYear.split("-");

    useFocusEffect(
        useCallback(() => {
            fetchTrend();
        }, [selectedMonthYear])
    );


    const fetchTrend = async () => {

        try {

            setLoading(true);

            const token =
                await AsyncStorage.getItem("token");

            // const response =
            //     await api.get(
            //         "/api/expenses/summary/trend",
            const response = await api.get(
                `/api/expenses/summary/trend?month=${month}&year=${year}`,
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

        } finally {

            setLoading(false);
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

    const totalSpending =
        trendData.reduce(
            (sum, item) =>
                sum + Number(item.total),
            0
        );

    const highestDay =
        trendData.length > 0
            ? Math.max(
                ...trendData.map(
                    item =>
                        Number(item.total)
                )
            )
            : 0;

    const averageDaily =
        trendData.length > 0
            ? (
                totalSpending /
                trendData.length
            ).toFixed(0)
            : "0";

    if (loading) {

        return (

            <View
                style={[
                    styles.loadingContainer,
                    {
                        backgroundColor:
                            theme.background,
                    },
                ]}
            >

                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />

                <Text
                    style={{
                        color:
                            theme.secondaryText,
                        marginTop: 10,
                    }}
                >
                    Loading Trend...
                </Text>

            </View>
        );
    }

    return (

        <ScrollView
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
        >
            <Text
                style={[
                    styles.title,
                    {
                        color:
                            theme.text,
                    },
                ]}
            >
                Spending Trend
            </Text>

            <Dropdown
                maxHeight={300}
                data={monthOptions}
                labelField="label"
                valueField="value"
                value={selectedMonthYear}
                onChange={(item) => setSelectedMonthYear(item.value)}
                placeholder="Select Month"

                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    height: 50,
                    marginBottom: 20,
                }}

                containerStyle={{
                    backgroundColor: theme.card,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
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
                    styles.title,
                    {
                        color:
                            theme.text,
                    },
                ]}
            >
                Monthly Trend
            </Text>

            {
                trendData.length > 0 ? (

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={
                            false
                        }
                    >
                        <LineChart
                            data={chartData}
                            width={
                                Math.max(
                                    screenWidth - 30,
                                    trendData.length * 60
                                )
                            }
                            height={260}
                            bezier
                            chartConfig={{
                                backgroundColor:
                                    theme.card,

                                backgroundGradientFrom:
                                    theme.card,

                                backgroundGradientTo:
                                    theme.card,

                                decimalPlaces: 0,

                                color: (
                                    opacity = 1
                                ) =>
                                    `rgba(59,130,246,${opacity})`,

                                labelColor:
                                    (opacity = 1) =>
                                        theme.text,

                                propsForDots: {
                                    r: "5",
                                },
                            }}
                            style={{
                                borderRadius: 16,
                            }}
                        />

                    </ScrollView>

                ) : (

                    <View
                        style={[
                            styles.emptyCard,
                            {
                                backgroundColor:
                                    theme.card,
                                borderColor:
                                    theme.border,
                            },
                        ]}
                    >

                        <Text
                            style={{
                                fontSize: 50,
                            }}
                        >
                            📈
                        </Text>

                        <Text
                            style={{
                                color:
                                    theme.text,
                                fontWeight:
                                    "bold",
                                fontSize: 18,
                                marginTop: 10,
                            }}
                        >
                            No Trend Data
                        </Text>

                        <Text
                            style={{
                                color:
                                    theme.secondaryText,
                                textAlign:
                                    "center",
                                marginTop: 8,
                            }}
                        >
                            Add expenses to view
                            spending trends.
                        </Text>

                    </View>

                )
            }

            <View style={styles.statsRow}>

                <View
                    style={[
                        styles.statCard,
                        {
                            backgroundColor:
                                theme.card,
                            borderColor:
                                theme.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statValue,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    >
                        ₹ {totalSpending}
                    </Text>

                    <Text
                        style={[
                            styles.statLabel,
                            {
                                color:
                                    theme.secondaryText,
                            },
                        ]}
                    >
                        Total
                    </Text>
                </View>

                <View
                    style={[
                        styles.statCard,
                        {
                            backgroundColor:
                                theme.card,
                            borderColor:
                                theme.border,
                            marginHorizontal: 8,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statValue,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    >
                        ₹ {highestDay}
                    </Text>

                    <Text
                        style={[
                            styles.statLabel,
                            {
                                color:
                                    theme.secondaryText,
                            },
                        ]}
                    >
                        Highest
                    </Text>
                </View>

                <View
                    style={[
                        styles.statCard,
                        {
                            backgroundColor:
                                theme.card,
                            borderColor:
                                theme.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statValue,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    >
                        ₹ {averageDaily}
                    </Text>

                    <Text
                        style={[
                            styles.statLabel,
                            {
                                color:
                                    theme.secondaryText,
                            },
                        ]}
                    >
                        Average
                    </Text>
                </View>

            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({

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

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    statsRow: {
        flexDirection: "row",
        marginBottom: 20,
    },

    statCard: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        padding: 15,
        alignItems: "center",
        marginTop: 20
    },

    statValue: {
        fontSize: 18,
        fontWeight: "bold",
    },

    statLabel: {
        marginTop: 5,
        fontSize: 12,
    },

    emptyCard: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        marginTop: 20,
    },
});

export default TrendScreen;