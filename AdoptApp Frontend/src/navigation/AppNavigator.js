import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AppTabGroup from "./TabNavigator";
import PostDetailScreen from "../screens/PostDetailScreen";
import UserProfile from "../screens/UserProfileScreen";
import AdoptionForm from "../screens/AdoptFormScreen";
import ManagePostsScreen from "../screens/ManagePostsScreen";

const Stack = createNativeStackNavigator();

const AppStackGroup = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TabNav" component={AppTabGroup}/>
            <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}/>
            <Stack.Screen name="UserProfile" component={UserProfile}/>
            <Stack.Screen name="AdoptForm" component={AdoptionForm}/>
            <Stack.Screen name="ManagePosts" component={ManagePostsScreen}/>
        </Stack.Navigator>
    )
}

export default AppStackGroup;
