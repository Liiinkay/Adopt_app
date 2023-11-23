import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostDetailScreen from "../screens/PostDetailScreen";
import UserProfile from "../screens/UserProfileScreen";
import TabGroup from "./TabNav";
import CreateAdoptPostScreen from "../screens/CreateAdoptPostScreen";

const MainStack = createNativeStackNavigator();

const MainStackGroup = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Tabs" component={TabGroup} options={{ headerShown: false }}/>
    <MainStack.Screen name="PostDetailScreen" component={PostDetailScreen} />
    <MainStack.Screen name="UserProfile" component={UserProfile} />
    <MainStack.Screen name="CreateAdoptPost" component={CreateAdoptPostScreen} options={{ headerShown: false }}/>
  </MainStack.Navigator>
);

export default MainStackGroup;