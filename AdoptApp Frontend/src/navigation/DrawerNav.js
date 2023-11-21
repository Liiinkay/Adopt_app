import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import { useAuth } from '../contexts/AuthProvider';

import config from '../../config';

const apiUrl = config.API_URL;
const Drawer = createDrawerNavigator();

const CustomDrawerItem = ({ label, onPress, iconName }) => (
    <DrawerItem 
        label={label}
        onPress={onPress}
        icon={() => <Ionicons name={iconName} size={22} color="black" />}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
    />
);
const getUserInfo = async (userId, token) => {
    try {
      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: 'GET',
        headers: {
          // Incluir headers si es necesario, como un token de autenticación
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Suponiendo que se necesite un token
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data; // Retorna los datos del usuario
    } catch (error) {
      console.error("Could not fetch user data:", error);
    }
};

const DrawerContent = (props) => {
    const { logOut, getUserId, userToken } = useAuth();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const userId = getUserId();
                if (userId) {
                    const userData = await getUserInfo(userId, userToken);
                    setUserInfo(userData);
                }
            } catch (error) {
                console.error("Error al cargar la información del usuario:", error);
            }
        };
    
        loadUserInfo();
    }, [getUserId, userToken]); 


    return (
        <DrawerContentScrollView {...props}>
             <View style={styles.userInfoSection}>
                <Image
                    source={{ uri: userInfo ? `${apiUrl}/api/${userInfo.profile_img}` : 'url_por_defecto' }}
                    style={styles.profilePic}
                />
                <Text style={styles.nickname}>{userInfo ? userInfo.nickname : 'Nombre de usuario'}</Text>
            </View>
            <DrawerItemList {...props} />
            <CustomDrawerItem 
                label="Cerrar sesión"
                onPress={logOut}
                iconName="exit"
            />
        </DrawerContentScrollView>
    );
};

const DrawerGroup = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
            <Drawer.Screen         
                name="Home" 
                component={HomeScreen}
                options={{
                    drawerLabel: 'Inicio',
                    drawerIcon: () => <Ionicons name="home" size={22} color="black" />,
                }}
            />
            {/* Aquí puedes agregar más pantallas si necesitas que estén en el Drawer */}
            {/* Otras opciones del Drawer aquí */}
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    userInfoSection: {
        alignItems: 'center',
        padding: 20,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    nickname: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    drawerLabel: {
        fontWeight: 'bold',
        // Añade más estilos si necesitas
    },
    drawerItem: {
        // Añade más estilos si necesitas
    },
});

export default DrawerGroup;
