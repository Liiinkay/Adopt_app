import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import user from '../assets/data/user';
import { Ionicons } from '@expo/vector-icons';

const UserAccountScreen = ({ navigation }) => {
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      {/* Sección de imagen de perfil */}
      <Image
        src={user.image} // Reemplaza con la URL o ruta de la imagen de perfil
        style={styles.imagenPerfil}
      />

      {/* Sección de nombre y username */}
      <Text style={styles.nombre}>{user.name}</Text>
      <Text style={styles.username}>@{user.username}</Text>

      {/* Sección de opciones */}
      <TouchableOpacity style={styles.opcion}>
        <Ionicons name='person-outline' color={'#F348A4'} size={25}/>
        <Text style={styles.opcionTexto}>Perfil de Usuario</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigate("ManagePosts", {user})} style={styles.opcion}>
        <Ionicons name='library-outline' color={'#F348A4'} size={25}/>
        <Text style={styles.opcionTexto}>Gestión de Publicaciones</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.opcion}>
        <Ionicons name='settings-outline' color={'#F348A4'} size={25}/>
        <Text style={styles.opcionTexto}>Configuración</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagenPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  opcion: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: '80%',
    alignItems: 'center',
    marginVertical: 5,
    flexDirection: 'row'
  },
  opcionTexto: {
    fontSize: 16,
    marginLeft: 5
  },
});

export default UserAccountScreen;
