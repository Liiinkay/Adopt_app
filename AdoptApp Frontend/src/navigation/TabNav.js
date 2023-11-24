import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'; 

import CreatePostsScreen from "../screens/CreatePostScreen";
import DrawerGroup from "./DrawerNav";
import AdminScreen from "../screens/AdminScreen";
import HelpCenterScreen from "../screens/HelpCenterScreen";

const Tab = createBottomTabNavigator();

const TabGroup = () => {
    return( 
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let iconColor;
                    if (route.name === 'Posts') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Crear') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Cuenta') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    } else if (route.name === 'Centros y ayuda') {
                        iconName = focused ? 'information-circle' : 'information-circle-outline';
                    }
                    iconColor = focused ? 'white' : 'grey'; // Color uniforme para todos los íconos
                    return <Ionicons name={iconName} size={size} color={iconColor} />;
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { backgroundColor: 'black' }
            })}
        >
            <Tab.Screen 
                name="Posts" 
                component={DrawerGroup}
                options={{ headerShown: false }}
            />
            <Tab.Screen name="Crear" component={CreatePostsScreen}/>
            <Tab.Screen name="Centros y ayuda" component={HelpCenterScreen}/>
            <Tab.Screen name="Admin" component={AdminScreen}/>
        </Tab.Navigator>
    )
}

export default TabGroup;