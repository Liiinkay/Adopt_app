import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostDetailAdoptScreen from "../screens/PostDetailAdoptScreen";
import UserProfile from "../screens/UserProfileScreen";
import TabGroup from "./TabNav";
import CreateAdoptPostScreen from "../screens/CreateAdoptPostScreen";
import CreateInformativePostScreen from "../screens/CreateInformativePostScreen"
import CreateSearchPostScreen from "../screens/CreateSearchPostScreen";
import ManageUsersScreen from "../screens/ManageUserScreen";
import AdminScreen from "../screens/AdminScreen";

const MainStack = createNativeStackNavigator();

const MainStackGroup = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Tabs" component={TabGroup} options={{ headerShown: false }}/>
    <MainStack.Screen name="PostDetailAdopt" component={PostDetailAdoptScreen} options={{ headerShown: false }} />
    <MainStack.Screen name="UserProfile" component={UserProfile} />
    <MainStack.Screen name="CreateAdoptPost" component={CreateAdoptPostScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="CreateSearchPost" component={CreateSearchPostScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="CreateInformativePost" component={CreateInformativePostScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="Admin" component={AdminScreen}/>
    <MainStack.Screen name="ManageUsers" component={ManageUsersScreen}/>
  </MainStack.Navigator>
);

export default MainStackGroup;