import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'; 

import HomeScreen from "../screens/HomeScreen";
import CreatePostsScreen from "../screens/CreatePostsScreen";
import UserAccountScreen from "../screens/UserAccountScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return( 
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                let iconColor;
                if (route.name === 'Posts') {
                    iconName = focused ? 'home' : 'home-outline';
                    iconColor = focused ? 'white' : 'grey'; // Cambiar color cuando está activo o inactivo
                } else if (route.name === 'Crear') {
                    iconName = focused ? 'add-circle' : 'add-circle-outline';
                    iconColor = focused ? 'white' : 'grey'; // Cambiar color cuando está activo o inactivo
                } else if (route.name === 'Cuenta') {
                    iconName = focused ? 'person-circle' : 'person-circle-outline';
                    iconColor = focused ? 'white' : 'grey'; // Cambiar color cuando está activo o inactivo
                }
                return <Ionicons name={iconName} size={size} color={iconColor} />;
            },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            tabBarStyle: { backgroundColor: 'black' }
        })}
        >
            <Tab.Screen name="Posts" component={HomeScreen}/>
            <Tab.Screen name="Crear" component={CreatePostsScreen}/>
            <Tab.Screen name="Cuenta" component={UserAccountScreen}/>
        </Tab.Navigator>
    )
}

export default TabNavigator;
