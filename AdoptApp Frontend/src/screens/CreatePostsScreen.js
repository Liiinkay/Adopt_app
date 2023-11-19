import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// Obtén la altura de la pantalla y resta la altura estimada del TabBar
const windowHeight = Dimensions.get('window').height;

const CreatePostsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#E91E63', flexDirection: 'row' }]}
            onPress={() => navigation.navigate('CreateAdoptPost')}>
            <Text style={styles.textLeft}>Adopción</Text>
            {/* Coloca aquí la imagen para el botón de Adopción si es necesario */}
          </TouchableOpacity>
    
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FFC107', flexDirection: 'row-reverse' }]}
            onPress={() => navigation.navigate('Busqueda')}>
            <Text style={styles.textRight}>Búsqueda</Text>
            {/* Coloca aquí la imagen para el botón de Búsqueda si es necesario */}
          </TouchableOpacity>
    
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#9C27B0', flexDirection: 'row' }]}
            onPress={() => navigation.navigate('Informativa')}>
            <Text style={styles.textLeft}>Informativa</Text>
            {/* Coloca aquí la imagen para el botón de Informativa si es necesario */}
          </TouchableOpacity>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 5, // Margen alrededor de los botones
      },
      button: {
        flex: 1,
        margin: 5, // Añade un margen entre los botones
        justifyContent: 'center', // Centra el contenido verticalmente
        alignItems: 'center', // Centra el contenido horizontalmente
        borderRadius: 10, // Bordes redondeados para los botones
        flexDirection: 'row', // Organiza los elementos en fila
        padding: 10, // Añade padding dentro del botón
      },
      textLeft: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 20, // Aumenta el margen izquierdo para el texto
        flex: 1, // Permite que el texto ocupe todo el espacio disponible
      },
      textRight: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        marginRight: 20, // Aumenta el margen derecho para el texto
        flex: 1, // Permite que el texto ocupe todo el espacio disponible
      },
    });

export default CreatePostsScreen;
