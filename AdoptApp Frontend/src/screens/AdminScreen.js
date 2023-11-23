import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AdminScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('ManageUsers')}>
                <Text style={styles.buttonText}>Gestionar Usuarios</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('ManagePosts')}>
                <Text style={styles.buttonText}>Gestionar Posts</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('ManageHelpCenters')}>
                <Text style={styles.buttonText}>Gestionar Centros</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('ManageReports')}>
                <Text style={styles.buttonText}>Gestionar Reportes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    }
});

export default AdminScreen;
