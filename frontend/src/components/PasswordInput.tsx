// import React, { useState } from "react";
// import {
//     View,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";

// interface PasswordInputProps {
//     value: string;
//     onChangeText: (text: string) => void;
//     placeholder: string;
// }

// const PasswordInput = ({
//     value,
//     onChangeText,
//     placeholder
// }: PasswordInputProps) => {

//     const [secure, setSecure] = useState(true);

//     return (
//         <View style={styles.container}>
//             <TextInput
//                 style={styles.input}
//                 placeholder={placeholder}
//                 placeholderTextColor="#999"
//                 value={value}
//                 onChangeText={onChangeText}
//                 secureTextEntry={secure}
//             />

//             <TouchableOpacity
//                 onPress={() => setSecure(!secure)}
//             >
//                 <Ionicons
//                     name={secure ? "eye-off" : "eye"}
//                     size={22}
//                     color="#555"
//                 />
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default PasswordInput;

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#F8FAFC",
//         borderWidth: 1,
//         borderColor: "#E2E8F0",
//         borderRadius: 12,
//         paddingHorizontal: 14,
//         marginBottom: 16,
//     },

//     input: {
//         flex: 1,
//         height: 55
//     }
// });

import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/useTheme";

interface PasswordInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
}

const PasswordInput = ({
    value,
    onChangeText,
    placeholder,
}: PasswordInputProps) => {

    const [secure, setSecure] = useState(true);

    const { theme } = useTheme();

    return (

        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.card,
                    borderColor:
                        theme.border,
                },
            ]}
        >

            <TextInput
                style={[
                    styles.input,
                    {
                        color:
                            theme.text,
                    },
                ]}
                placeholder={placeholder}
                placeholderTextColor={
                    theme.secondaryText
                }
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secure}
            />

            <TouchableOpacity
                onPress={() =>
                    setSecure(!secure)
                }
            >
                <Ionicons
                    name={
                        secure
                            ? "eye-off"
                            : "eye"
                    }
                    size={22}
                    color={
                        theme.secondaryText
                    }
                />
            </TouchableOpacity>

        </View>
    );
};

export default PasswordInput;

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
    },

    input: {
        flex: 1,
        height: 55,
        fontSize: 16,
    },
});