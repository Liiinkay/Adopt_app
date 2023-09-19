import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import PostDetailScreen from "../screens/PostDetailScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TabNav" component={TabNavigator}/>
            <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}/>
        </Stack.Navigator>
    )
}

export default AppNavigator;
