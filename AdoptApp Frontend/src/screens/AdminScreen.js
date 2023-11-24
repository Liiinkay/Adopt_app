import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de usar el nombre correcto del icono

const AdminScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Contenido</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('ManageUsers')}>
                    <Icon name="people" size={20} color="white" />
                    <Text style={styles.buttonText}>Gestionar Usuarios</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('MyPosts')}>
                    <Icon name="clipboard" size={20} color="white" />
                    <Text style={styles.buttonText}>Gestionar Posts</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('ManageHelpCenters')}>
                    <Icon name="help-buoy" size={20} color="white" />
                    <Text style={styles.buttonText}>Gestionar Centros</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    buttonContainer: {
        backgroundColor: '#FFFFFF', // Cambiado a rosa
        padding: 15,
        borderRadius: 10, // Esquinas ligeramente redondeadas
        marginVertical: 10,
        width: '90%',
        elevation: 3, // Sombra para efecto elevado
        shadowColor: '#000', // Color de sombra
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginVertical: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#F348A4',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10, // Agregado para separar el texto del icono
    }
});

export default AdminScreen;