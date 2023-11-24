import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import { useAuth } from '../contexts/AuthProvider';

import config from '../../config';
import EditProfileScreen from '../screens/EditProfileScreen';
import MyPostsScreen from '../screens/MyPostsScreen';

const apiUrl = config.API_URL;
const Drawer = createDrawerNavigator();

const drawerScreens = [
    {
        name: 'Home',
        label: 'Inicio',
        iconName: 'home',
        component: HomeScreen
    },
    {
        name: 'Account',
        label: 'Mi cuenta',
        iconName: 'person',
        component: EditProfileScreen
    },
    {
        name: 'MyPosts',
        label: 'Mis Posts',
        iconName: 'podium',
        component: MyPostsScreen
    },
];

const CustomDrawerItem = ({ label, onPress, iconName }) => (
    <DrawerItem 
        label={label}
        onPress={onPress}
        icon={() => <Ionicons name={iconName} size={22} color="#F348A4" />}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
    />
);
const getUserInfo = async (userId, token) => {
    try {
      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: 'GET',
        headers: {

          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
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
            {drawerScreens.map((screen, index) => (
                <CustomDrawerItem
                    key={index}
                    label={screen.label}
                    onPress={() => props.navigation.navigate(screen.name)}
                    iconName={screen.iconName}
                />
            ))}
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
            {drawerScreens.map((screen, index) => (
                <Drawer.Screen
                    key={index}
                    name={screen.name}
                    component={screen.component}
                    options={{
                        drawerLabel: screen.label,
                        drawerIcon: () => <Ionicons name={screen.iconName} size={22} color="black" />,
                    }}
                />
            ))}
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
    },
    drawerItem: {
        borderBottomWidth: 1, // Ancho del borde
        borderBottomColor: '#E0E0E0'
    },
});

export default DrawerGroup;
