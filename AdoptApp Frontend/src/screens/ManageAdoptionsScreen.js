import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { usePosts } from '../contexts/PostProvider'; // Asumiendo que tienes este contexto
import { useAuth } from '../contexts/AuthProvider';

const AdoptionItem = ({ item, onView, onDelete }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.title}</Text>
        <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.viewButton} onPress={() => onView(item)}>
                <Ionicons name="eye-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
        </View>
    </View>
);

const PostModal = ({ post, isVisible, onClose, onChangeState }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>{post.title || "No disponible"}</Text>
                    <Text style={styles.description}>{post.description || "No disponible"}</Text>
                    <Text style={styles.info}>ID: {post.id || "No disponible"}</Text>
                    <Text style={styles.info}>Edad: {post.age || "No disponible"}</Text>
                    <Text style={styles.info}>Género: {post.gender || "No disponible"}</Text>
                    <Text style={styles.info}>Estado: {post.state || "No disponible"}</Text>
                    <Text style={styles.info}>Información médica: {post.medical_information || "No disponible"}</Text>
                    <Text style={styles.info}>Personalidad: {post.personality || "No disponible"}</Text>

                    <TouchableOpacity style={styles.changeStateButton} onPress={() => onChangeState(post.id)}>
                        <Ionicons name="swap-horizontal-outline" size={20} color="white" />
                        <Text style={styles.buttonText}>Cambiar Estado</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.buttonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const ManageAdoptionsScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [filter, setFilter] = useState('Mis Publicaciones');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { getUserPostsJson, getPostsAppliedByUserId } = usePosts();
    const { getUserId } = useAuth();
    const userId = getUserId();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = filter === 'Mis Publicaciones'
                    ? await getUserPostsJson(userId)
                    : await getPostsAppliedByUserId(userId);
                setPosts(data);
                setFilteredPosts(data);
            } catch (error) {
                console.log('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, [filter, userId]);

    useEffect(() => {
        const filteredData = posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosts(filteredData);
    }, [searchQuery, posts]);

    const viewPostDetails = (post) => {
        setSelectedPost(post);
        setModalVisible(true);
    };

    const deletePost = async (postId) => {
        // Aquí implementa la lógica para eliminar el post
        console.log(`Eliminar post con ID: ${postId}`);
    };

    return (
        <View style={styles.container}>
            <Menu>
                <MenuTrigger style={styles.filterTrigger}>
                    <Text style={styles.filterText}>{filter}</Text>
                    <Ionicons name="chevron-down-outline" size={20} color="#000" />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => setFilter('Mis Publicaciones')} text="Mis Publicaciones" />
                    <MenuOption onSelect={() => setFilter('Mis Postulaciones')} text="Mis Postulaciones" />
                </MenuOptions>
            </Menu>

            <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name="search" size={20} color="#000"/>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredPosts}
                renderItem={({ item }) => (
                    <AdoptionItem 
                        item={item}
                        onView={viewPostDetails}
                        onDelete={deletePost}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => <Text style={styles.emptyMessage}>No hay posts disponibles</Text>}
            />

            {/* Modal para mostrar detalles del post */}
            {selectedPost && <PostModal
                post={selectedPost}
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
            />}
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
    actionsContainer: {
        flexDirection: 'row',
    },
    viewButton: {
        backgroundColor: '#4CAF50', // Verde para el botón de visualizar
        padding: 10,
        borderRadius: 4,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: '#EF5350', // Rojo para el botón de eliminar
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
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
        marginTop: 20,
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
        // Estilos adicionales para el contenido del modal si es necesario
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    info: {
        fontSize: 14,
        marginBottom: 5,
    },
    changeStateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'center',
    },
    closeButton: {
        backgroundColor: '#F348A4',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        marginLeft: 5,
    },
});

export default ManageAdoptionsScreen;
