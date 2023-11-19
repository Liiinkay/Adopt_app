import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen'
import { useAuth } from '../contexts/AuthProvider'; 

const Drawer = createDrawerNavigator();

const DrawerContent = (props) => {
    const { logOut } = useAuth(); // Obtiene la función signOut del contexto

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.userInfoSection}>
                <Image
                    source={{ uri: 'url_por_defecto' }}
                    style={styles.profilePic}
                />
                <Text style={styles.nickname}>{'Nombre de usuario'}</Text>
            </View>

            <DrawerItemList {...props} />

            {/* Agregando nuevas opciones */}
            <DrawerItem 
                label="Mis publicaciones"
                onPress={() => {/* Navegación a Mis publicaciones */}}
                icon={() => <Ionicons name="list" size={22} color="black" />}
            />
            <DrawerItem 
                label="Mis postulaciones"
                onPress={() => {/* Navegación a Mis postulaciones */}}
                icon={() => <Ionicons name="hand-left" size={22} color="black" />}
            />
            <DrawerItem 
                label="Guardados"
                onPress={() => {/* Navegación a Guardados */}}
                icon={() => <Ionicons name="bookmark" size={22} color="black" />}
            />
            <DrawerItem 
                label="Cerrar sesión"
                onPress={logOut}
                icon={() => <Ionicons name="exit" size={22} color="black" />}
            />
        </DrawerContentScrollView>
    );
};

const DrawerGroup = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      {/* Aquí puedes agregar más pantallas si necesitas que estén en el Drawer */}
    </Drawer.Navigator>
    );
}

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
});

export default DrawerGroup;
