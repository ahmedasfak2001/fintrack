// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://192.168.31.80:8080",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { navigate } from "../utils/NavigationService";

const api = axios.create({
  // baseURL: "http://192.168.31.80:8080",
  baseURL: "https://fintrack-production-mdaaq.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

let isSessionAlertVisible = false;

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const status =
      error.response?.status;

    if (
      (status === 401 ||
        status === 403) &&
      !isSessionAlertVisible
    ) {

      isSessionAlertVisible = true;

      await AsyncStorage.removeItem(
        "token"
      );

      Alert.alert(
        "Session Expired",
        "You were inactive. Please login again.",
        [
          {
            text: "OK",
            onPress: () => {

              isSessionAlertVisible = false;

              navigate(
                "Login"
              );
            },
          },
        ]
      );
    }

    return Promise.reject(error);
  }
);

export default api;