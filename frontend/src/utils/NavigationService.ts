import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export const navigate = (screenName: string) => {

    if (navigationRef.isReady()) {

        navigationRef.navigate(screenName as never);
    }
};