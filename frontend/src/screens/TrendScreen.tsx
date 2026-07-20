import React, {
    useState,
    useCallback,
} from "react";

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import { ActivityIndicator } from "react-native";

import { useTheme } from "../theme/useTheme";

import { COLORS } from "../constants/colors";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/api";

import { LineChart } from "react-native-gifted-charts";

import { useFocusEffect } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { showError } from "../utils/toast";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

const TrendScreen = () => {

    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [trendData, setTrendData] = useState<any[]>([]);
    const screenWidth = Dimensions.get("window").width;
    const [pdfLoading, setPdfLoading] = useState(false);

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
            const response = await api.get(
                `/api/expenses/summary/trend?month=${month}&year=${year}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setTrendData(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    const exportPdf = async () => {
        try {
            setPdfLoading(true);

            const token = await AsyncStorage.getItem("token");

            const fileUri =
                FileSystem.cacheDirectory +
                `FinTrack_Report_${month}_${year}.pdf`;

            const url =
                `${api.defaults.baseURL}/api/expenses/export/pdf?month=${month}&year=${year}`;

            const result = await FileSystem.downloadAsync(
                url,
                fileUri,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(result.uri);

            } else {
                showError("Sharing is not available.");
            }


        } catch (error) {
            console.log(error);
            showError("Failed to export PDF");

        } finally {
            setPdfLoading(false);
        }
    };

    const lineData = trendData.map(item => ({
        value: Number(item.total),
        label: String(Number(item.date.slice(8))),

    }));


    const maxValue = Math.max(...lineData.map(item => item.value), 0);
    console.log(lineData);
    console.log(Math.max(...lineData.map(item => item.value)));
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
                        marginTop: 20,
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

            <TouchableOpacity
                style={styles.downloadButton}
                onPress={exportPdf}
                disabled={pdfLoading}
            >
                {pdfLoading && (
                    <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                        style={{ marginRight: 8 }}
                    />
                )}

                <Text style={styles.downloadText}>
                    {pdfLoading
                        ? "Preparing PDF..."
                        : "📄 Download Monthly Report"}
                </Text>
            </TouchableOpacity>

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
                    <>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >

                            <LineChart
                                data={lineData}
                                curved
                                areaChart
                                height={300}
                                maxValue={Math.ceil(maxValue / 1000) * 1000}
                                noOfSections={7}

                                yAxisLabelWidth={65}

                                formatYLabel={(value) =>
                                    Number(value).toLocaleString()
                                }

                                hideDataPoints={false}
                                dataPointsRadius={5}
                                thickness={3}

                                color={COLORS.primary}
                                startFillColor={COLORS.primary}
                                endFillColor={COLORS.primary}
                                startOpacity={0.35}
                                endOpacity={0.02}

                                spacing={55}
                                initialSpacing={20}

                                yAxisThickness={0}
                                xAxisThickness={1}

                                xAxisColor={theme.border}
                                rulesColor={theme.border}
                                rulesType="solid"

                                yAxisTextStyle={{
                                    color: theme.secondaryText,
                                }}

                                xAxisLabelTextStyle={{
                                    color: theme.secondaryText,
                                }}
                                isAnimated
                                animateOnDataChange

                                showVerticalLines
                                focusEnabled
                                showDataPointOnFocus
                                showStripOnFocus
                                showTextOnFocus={false}
                                focusedDataPointRadius={7}
                                focusedDataPointColor={COLORS.primary}

                                pointerConfig={{
                                    pointerStripHeight: 220,
                                    pointerStripColor: theme.border,
                                    pointerColor: COLORS.primary,
                                    radius: 7,
                                    pointerLabelWidth: 150,
                                    pointerLabelHeight: 80,
                                    activatePointersOnLongPress: false,

                                    pointerLabelComponent: (items: any[]) => {
                                        const point = items[0];

                                        if (!point) return null;

                                        const index = lineData.findIndex(
                                            x => x.label === point.label && x.value === point.value
                                        );
                                        const selected = trendData.find(
                                            item =>
                                                String(Number(item.date.slice(8))) === String(point.label)
                                        );

                                        if (!selected) return null;
                                        console.log(selected);

                                        const isLast = index >= lineData.length - 3;
                                        
                                        return (
                                            <View
                                                style={{
                                                    width: 140,
                                                    minHeight: 70,
                                                    backgroundColor: theme.card,
                                                    borderRadius: 12,
                                                    borderWidth: 1,
                                                    borderColor: theme.border,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 10,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    elevation: 8,
                                                    shadowColor: "#000",
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 5,
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 2,
                                                    },
                                                    marginLeft: isLast ? -110 : 0,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: theme.text,
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {selected.date}
                                                </Text>

                                                <Text
                                                    style={{
                                                        color: COLORS.primary,
                                                        marginTop: 4,
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    ₹ {Number(selected.total).toLocaleString()}
                                                </Text>
                                            </View>
                                        );
                                    },
                                }}
                            />
                        </ScrollView>
                    </>
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
    downloadButton: {
        backgroundColor: COLORS.primary,
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 20,
    },

    downloadText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default TrendScreen;