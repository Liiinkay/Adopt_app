import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'; 

import CreatePostsScreen from "../screens/CreatePostScreen";
import DrawerGroup from "./DrawerNav";

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
            tabBarStyle: { backgroundColor: 'black' }
        })}
        >
            <Tab.Screen 
                name="Posts" 
                component={DrawerGroup}
                options={{ headerShown: false }}
            />
            <Tab.Screen name="Crear" component={CreatePostsScreen}/>
        </Tab.Navigator>
    )
}

export default TabGroup;
