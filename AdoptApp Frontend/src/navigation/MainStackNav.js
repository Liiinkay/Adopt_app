import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PostDetailAdoptScreen from "../screens/PostDetailAdoptScreen";
import PostDetailLostScreen from "../screens/PostDetailLostScreen";
import UserProfile from "../screens/UserProfileScreen";
import TabGroup from "./TabNav";
import CreateAdoptPostScreen from "../screens/CreateAdoptPostScreen";
import CreateInformativePostScreen from "../screens/CreateInformativePostScreen"
import CreateSearchPostScreen from "../screens/CreateSearchPostScreen";
import ManageUsersScreen from "../screens/ManageUserScreen";
import AdminScreen from "../screens/AdminScreen";
import AdoptFormScreen from "../screens/AdoptFormScreen";
import CommentsScreen from "../screens/CommentsScreen";
import PostDetailInformativeScreen from "../screens/PostDetailInformativeScreen";
import QuestionsScreen from "../screens/QuestionsScreens";
import ManageHelpCentersScreen from "../screens/ManageHelpCenters";
import CreateHelpCenterScreen from "../screens/CreateHelpCenterScreen";

const MainStack = createNativeStackNavigator();

const MainStackGroup = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Tabs" component={TabGroup} options={{ headerShown: false }}/>
    <MainStack.Screen name="PostDetailAdopt" component={PostDetailAdoptScreen} options={{ headerShown: false }} />
    <MainStack.Screen name="PostDetailLost" component={PostDetailLostScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="PostDetailInformative" component={PostDetailInformativeScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="UserProfile" component={UserProfile} />
    <MainStack.Screen name="CreateAdoptPost" component={CreateAdoptPostScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="CreateSearchPost" component={CreateSearchPostScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="CreateInformativePost" component={CreateInformativePostScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="AdoptForm" component={AdoptFormScreen} options={{ headerShown: false }}/>
    <MainStack.Screen name="Comments" component={CommentsScreen} options={{ headerTitle: 'Comentarios' }}/>
    <MainStack.Screen name="Questions" component={QuestionsScreen} options={{ headerTitle: 'Preguntas y respuestas' }}/>
    <MainStack.Screen name="Admin" component={AdminScreen}/>
    <MainStack.Screen name="ManageUsers" component={ManageUsersScreen}/>
    <MainStack.Screen name="ManageHelpCenters" component={ManageHelpCentersScreen}/>
    <MainStack.Screen name="CreateHelpCenter" component={CreateHelpCenterScreen} options={{ headerShown: false }}/>
  </MainStack.Navigator>
);

export default MainStackGroup;