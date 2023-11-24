import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHelpCenters } from '../contexts/HelpCenterProvider';


const HelpCenterItem = ({ center, onEdit, onDelete, onPress }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => onPress(center)}>
        <Text style={styles.itemText}>{center?.title}</Text>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => onEdit(center?.id)}>
          <Ionicons name="pencil-outline" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(center?.id)}>
          <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
);

const ModalDetail = ({ center, isVisible, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Detalle del Centro</Text>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalLabel}>ID:</Text>
                        <Text style={styles.modalValue}>{center?.id}</Text>

                        <Text style={styles.modalLabel}>Título:</Text>
                        <Text style={styles.modalValue}>{center?.title}</Text>

                        <Text style={styles.modalLabel}>Descripción:</Text>
                        <Text style={styles.modalValue}>{center?.description}</Text>

                        <Text style={styles.modalLabel}>Latitud:</Text>
                        <Text style={styles.modalValue}>{center?.latitude}</Text>

                        <Text style={styles.modalLabel}>Longitud:</Text>
                        <Text style={styles.modalValue}>{center?.longitude}</Text>

                        <Text style={styles.modalLabel}>URL de la Imagen:</Text>
                        <Text style={styles.modalValue}>{center?.imageURL}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.buttonClose}
                        onPress={onClose}
                    >
                        <Text style={styles.textStyle}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const ManageHelpCentersScreen = ({ navigation }) => {
    const [centers, setCenters] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const itemsPerPage = 9;
    const { findAllCoordinates, removeCoordinates } = useHelpCenters()

    useEffect(() => {
        const loadCoordinates = async () => {
            try {
                const data = await findAllCoordinates();
                setCenters(data);
            } catch (error) {
                console.error("Error al cargar los centros de ayuda:", error);
            }
        };

        // Llama a la función de carga
        loadCoordinates();
    }, []);

    const handlePressCenter = (center) => {
        setSelectedCenter(center);
        setModalVisible(true);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleEdit = (centerId) => {
        console.log('Editar', centerId);
        // Implementa la lógica de edición aquí
    };
    const handleDelete = async (centerId) => {
        if (!centerId) {
            console.error('El ID del centro no está definido.');
            return;
        }
        try {
            await removeCoordinates(centerId);
            setCenters(centers.filter(center => center.id !== centerId));
            setModalVisible(false); // Cierra el modal si está abierto
        } catch (error) {
            console.error('Error al eliminar el centro:', error);
        }
    };

    const filteredCenters = centers.filter(center => 
        center.id.toString().includes(searchQuery)
    );
    const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);
    const paginatedCenters = filteredCenters.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
    );

    const changePage = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name="search" size={20} color="#000"/>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por ID..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
            {centers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay centros de ayuda animal creados</Text>
                </View>
            ) : (
            <>
                <FlatList
                data={paginatedCenters}
                renderItem={({ item }) => (
                    <HelpCenterItem 
                    center={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPress={handlePressCenter}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                />
            </>
            )}
            
            {/* Modal para mostrar detalles del centro */}
            <ModalDetail
                center={selectedCenter}
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            <View style={styles.paginationContainer}>
                <TouchableOpacity 
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                    disabled={currentPage === 1}
                    onPress={() => changePage(currentPage - 1)}
                >
                    <Text style={styles.pageButtonText}>{"<"}</Text>
                </TouchableOpacity>
                    <Text style={styles.pageNumberText}>Página {currentPage}</Text>
                <TouchableOpacity 
                    style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                    disabled={currentPage === totalPages}
                    onPress={() => changePage(currentPage + 1)}
                >
                    <Text style={styles.pageButtonText}>{">"}</Text>
                </TouchableOpacity>
                {/* Add button */}
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('CreateHelpCenter')}
                >
                    <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
            </View>
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
        color: '#FFA726', // Cambiado a un tono naranja
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
    editButton: {
        backgroundColor: '#FFB74D', // Color naranja claro
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
        backgroundColor: '#EF5350', // Color rojo claro
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    pageButton: {
        backgroundColor: '#FFA726', // Botones de paginación color naranja
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
    centerImage: {
        width: '100%', // o el tamaño que prefieras
        height: 200, // o el tamaño que prefieras
        resizeMode: 'cover',
        marginVertical: 10,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50, 
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#FFB74D',
        width: 60, 
        height: 60, 
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
    },
    modalView: {
        margin: 20,
        width: '80%', // Tamaño del modal
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'flex-start', // Alinea el contenido a la izquierda
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
        width: '100%', // Asegúrate de que el título se centre correctamente
    },
    modalContent: {
        marginBottom: 15,
    },
    modalLabel: {
        fontWeight: 'bold',
        // otros estilos que necesites
    },
    modalValue: {
        marginBottom: 5,
        // otros estilos que necesites
    },
    buttonClose: {
        backgroundColor: '#F348A4',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        alignSelf: 'center', 
        marginTop: 15,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ManageHelpCentersScreen;
