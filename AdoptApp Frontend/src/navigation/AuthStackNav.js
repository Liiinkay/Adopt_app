import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from "../screens/WelcomeScreen";

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#F348A4', // Color rosa para el fondo del header
      },
      headerTintColor: '#fff', // Color blanco para los textos y botones del header
      headerTitleStyle: {
        fontWeight: 'bold', // Estilo opcional para el título del header
      }
    }}
  >
    <AuthStack.Screen 
      name="Welcome" 
      component={WelcomeScreen} 
      options={{ headerShown: false }}
    />
    <AuthStack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerTitle: 'Inicio de sesión' }}
    />
    <AuthStack.Screen 
      name="SignUp" 
      component={SignUpScreen} 
      options={{ headerTitle: 'Crear cuenta' }}
    />
  </AuthStack.Navigator>
);

export default AuthStackNavigator;
