import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostDetailAdoptScreen from "../screens/PostDetailAdoptScreen";
import UserProfile from "../screens/UserProfileScreen";
import TabGroup from "./TabNav";
import CreateAdoptPostScreen from "../screens/CreateAdoptPostScreen";
import CreateInformativePostScreen from "../screens/CreateInformativePostScreen"
import CreateSearchPostScreen from "../screens/CreateSearchPostScreen";

const MainStack = createNativeStackNavigator();

const MainStackGroup = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Tabs" component={TabGroup} options={{ headerShown: false }}/>
    <MainStack.Screen name="PostDetailAdopt" component={PostDetailAdoptScreen} options={{ headerShown: false }} />
    <MainStack.Screen name="UserProfile" component={UserProfile} />
    <MainStack.Screen name="CreateAdoptPost" component={CreateAdoptPostScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="CreateSearchPost" component={CreateSearchPostScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="CreateInformativePost" component={CreateInformativePostScreen} options={{ headerShown: false }}/>
  </MainStack.Navigator>
);

export default MainStackGroup;