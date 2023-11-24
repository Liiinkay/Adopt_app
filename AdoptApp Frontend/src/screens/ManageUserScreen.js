import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsers } from '../contexts/UserProvider';

const UserItem = ({ user, onEdit, onDelete, onPress }) => (
    <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => onPress(user)}>
            <Text style={styles.itemText}>{user?.fullName}</Text>
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(user.id)}>
                <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
        </View>
    </View>
);

const ManageUsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { getAllUsers, remove } = useUsers(); // Utiliza las funciones del UserProvider

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await getAllUsers();
                console.log(fetchedUsers);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        };

        loadUsers();
    }, []);

    const handlePressUser = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const handleEdit = (userId) => {
        console.log('Editar', userId);
        // Implementa la lógica de edición aquí
    };

    const handleDelete = async (userId) => {
        try {
            await remove(userId);
            setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };

    const filteredUsers = searchQuery
        ? users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : users;

    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name="search" size={20} color="#000"/>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredUsers}
                renderItem={({ item }) => (
                    <UserItem 
                        user={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPress={handlePressUser}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Detalle del Usuario</Text>
                        {selectedUser && (
                            <View>
                                <Text>ID: {selectedUser.id}</Text>
                                <Text>Nombre: {selectedUser.name}</Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        marginBottom: 10,
    },
    searchIcon: {
        padding: 10,
        color: '#F348A4',
      },
    searchInput: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 5,
    },
    itemText: {
        color: '#333',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    pageNumber: {
        color: '#007bff',
    },
    editButton: {
        backgroundColor: '#F3B63F',
        padding: 8,
        borderRadius: 4,
        marginRight: 4,
      },
    actionButton: {
        padding: 8,
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    deleteButton: {
        backgroundColor: '#F348A4',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    pageButton: {
        backgroundColor: '#F348A4', // Botones de paginación color rosa
        padding: 8,
        marginHorizontal: 10,
        borderRadius: 4,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    pageButtonText: {
        color: '#fff',
    },
    pageNumberText: {
        color: '#000',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        // Estilos para el texto del modal
      },
    buttonClose: {
        backgroundColor: '#2196F3',
      },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ManageUsersScreen;