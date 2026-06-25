// import React, {
//     createContext,
//     useEffect,
//     useState,
//     ReactNode,
// } from "react";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { lightTheme } from "./lightTheme";
// import { darkTheme } from "./darkTheme";

// type ThemeType = typeof lightTheme;

// type ThemeContextType = {
//     darkMode: boolean;
//     theme: ThemeType;
//     toggleTheme: () => void;
//     setDarkMode: (value: boolean) => void;
// };

// export const ThemeContext =
//     createContext<ThemeContextType | undefined>(
//         undefined
//     );

// type Props = {
//     children: ReactNode;
// };

// export const ThemeProvider = ({
//     children,
// }: Props) => {

//     const [darkMode, setDarkMode] =
//         useState(false);

//     const [loading, setLoading] =
//         useState(true);

//     useEffect(() => {
//         loadTheme();
//     }, []);

//     const loadTheme = async () => {

//         try {

//             const savedTheme =
//                 await AsyncStorage.getItem(
//                     "theme"
//                 );

//             if (savedTheme === "dark") {
//                 setDarkMode(true);
//             }

//         } catch (error) {

//             console.log(
//                 "Failed to load theme:",
//                 error
//             );

//         } finally {

//             setLoading(false);

//         }

//     };

//     const toggleTheme = async () => {

//         try {

//             const newValue = !darkMode;

//             setDarkMode(newValue);

//             await AsyncStorage.setItem(
//                 "theme",
//                 newValue ? "dark" : "light"
//             );

//         } catch (error) {

//             console.log(
//                 "Failed to save theme:",
//                 error
//             );

//         }

//     };

//     const handleSetDarkMode = async (
//         value: boolean
//     ) => {

//         try {

//             setDarkMode(value);

//             await AsyncStorage.setItem(
//                 "theme",
//                 value ? "dark" : "light"
//             );

//         } catch (error) {

//             console.log(
//                 "Failed to save theme:",
//                 error
//             );

//         }

//     };

//     const theme =
//         darkMode
//             ? darkTheme
//             : lightTheme;

//     if (loading) {
//         return null;
//     }

//     return (
//         <ThemeContext.Provider
//             value={{
//                 darkMode,
//                 theme,
//                 toggleTheme,
//                 setDarkMode: handleSetDarkMode,
//             }
//             }
//         >
//             {children}
//         </ThemeContext.Provider>
//     );
// };

import React, {
    createContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    useColorScheme,
} from "react-native";

import { lightTheme } from "./lightTheme";
import { darkTheme } from "./darkTheme";

type ThemeType = typeof lightTheme;

export type ThemeMode =
    | "light"
    | "dark"
    | "system";

type ThemeContextType = {
    theme: ThemeType;

    darkMode: boolean;

    themeMode: ThemeMode;

    setThemeMode: (
        mode: ThemeMode
    ) => void;
};

export const ThemeContext =
    createContext<ThemeContextType | undefined>(
        undefined
    );

type Props = {
    children: ReactNode;
};

export const ThemeProvider = ({

    children,
}: Props) => {

    const systemTheme =
        useColorScheme();

    const [themeMode, setThemeModeState] =
        useState<ThemeMode>(
            "system"
        );

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadTheme();

    }, []);

    const loadTheme = async () => {

        try {

            const savedTheme =
                await AsyncStorage.getItem(
                    "themeMode"
                );

            if (
                savedTheme === "light" ||
                savedTheme === "dark" ||
                savedTheme === "system"
            ) {

                setThemeModeState(
                    savedTheme
                );

            }

        } catch (error) {

            console.log(
                "Failed to load theme:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    const setThemeMode = async (
        mode: ThemeMode
    ) => {

        try {

            setThemeModeState(
                mode
            );

            await AsyncStorage.setItem(
                "themeMode",
                mode
            );

        } catch (error) {

            console.log(
                "Failed to save theme:",
                error
            );

        }

    };

    const darkMode =

        themeMode === "system"

            ? systemTheme === "dark"

            : themeMode === "dark";

    const theme =

        darkMode
            ? darkTheme
            : lightTheme;

    if (loading) {

        return null;

    }

    return (

        <ThemeContext.Provider
            value={{
                theme,
                darkMode,
                themeMode,
                setThemeMode,
            }}
        >

            {children}

        </ThemeContext.Provider>

    );
};