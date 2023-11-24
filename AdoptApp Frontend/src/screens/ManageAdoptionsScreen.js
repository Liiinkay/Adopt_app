import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { usePosts } from '../contexts/PostProvider'; // Asumiendo que tienes este contexto

const AdoptionItem = ({ adoption, onView }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{adoption.title}</Text>
        <TouchableOpacity style={styles.viewButton} onPress={() => onView(adoption)}>
            <Ionicons name="eye-outline" size={20} color="white" />
        </TouchableOpacity>
    </View>
);

const ManageAdoptionsScreen = ({ navigation }) => {
    const [adoptions, setAdoptions] = useState([]);
    const [filter, setFilter] = useState('Todos');
    const { getAdoptions } = useAdoptions(); // Asumiendo esta función en tu contexto

    useEffect(() => {
        const loadAdoptions = async () => {
            try {
                const data = await getAdoptions();
                setAdoptions(data);
            } catch (error) {
                console.error("Error al cargar las adopciones:", error);
            }
        };

        loadAdoptions();
    }, []);

    const filteredAdoptions = adoptions.filter(adoption => 
        filter === 'Todos' || adoption.status === filter
    );

    return (
        <View style={styles.container}>
            <Menu>
                <MenuTrigger style={styles.filterTrigger}>
                    <Text>Filtro: {filter}</Text>
                    <Ionicons name="md-arrow-dropdown" size={20} color="#000" />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => setFilter('Todos')} text="Todos" />
                    <MenuOption onSelect={() => setFilter('Pendiente')} text="Pendiente" />
                    <MenuOption onSelect={() => setFilter('Aprobada')} text="Aprobada" />
                    <MenuOption onSelect={() => setFilter('Rechazada')} text="Rechazada" />
                </MenuOptions>
            </Menu>

            <FlatList
                data={filteredAdoptions}
                renderItem={({ item }) => (
                    <AdoptionItem 
                        adoption={item}
                        onView={() => navigation.navigate('AdoptionDetail', { adoptionId: item.id })}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5', // Fondo claro para toda la pantalla
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc', // Color del borde para separar cada ítem
        backgroundColor: 'white', // Fondo blanco para cada ítem
        borderRadius: 5,
        marginBottom: 10,
    },
    itemText: {
        color: '#333', // Color del texto
        flex: 1, // Permite que el texto ocupe todo el espacio disponible
        fontSize: 16, // Tamaño del texto
    },
    viewButton: {
        backgroundColor: '#4CAF50', // Verde para el botón de visualizar
        padding: 10,
        borderRadius: 4,
    },
    filterTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
        alignSelf: 'center', // Centra el menú de filtro
        width: '60%', // Ancho del menú de filtro
    },
    filterText: {
        fontSize: 16, // Tamaño del texto del filtro
        color: '#000', // Color del texto
        marginRight: 10, // Margen a la derecha del texto
    },
    filterIcon: {
        color: '#000', // Color del icono del menú desplegable
    },
    // Añade aquí más estilos según necesites...
});


export default ManageAdoptionsScreen;
