import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '../contexts/PostProvider'; // Asumiendo que tienes este contexto
import { useAuth } from '../contexts/AuthProvider';

const PostItem = ({ post, onEdit, onDelete, onPress }) => (
    <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => onPress(post)}>
            <Text style={styles.itemText}>{post?.title}</Text>
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => onEdit(post?.id)}>
                <Ionicons name="pencil-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(post?.id)}>
                <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
        </View>
    </View>
);

const MyPostsScreen = ({ navigation }) => {
    const { getUserId } = useAuth();
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('Todos');
    const { getUserPostsJson, deletePost } = usePosts();

    useEffect(() => {
        const loadUserPosts = async () => {
            console.log(getUserId());
            try {
                const data = await getUserPostsJson(getUserId()); // Obtiene posts del usuario
                setPosts(data);
            } catch (error) {
                console.error("Error al cargar los posts:", error);
            }
        };

        loadUserPosts();
    }, []);

    const handlePressPost = (post) => {
        console.log('Presionado', post);
        // Implementa la lógica al presionar un post aquí
    };

    const handleEdit = (postId) => {
        console.log('Editar', postId);
        // Implementa la lógica de edición aquí
    };

    const handleDelete = async (postId) => {
        if (!postId) {
            console.error('El ID del post no está definido.');
            return;
        }
        try {
            await deletePost(postId);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error al eliminar el post:', error);
        }
    };

    const filteredPosts = posts.filter(post => {
        return (filter === 'Todos' || post.type === filter) &&
               post.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return (
        <View style={styles.container}>
            <View style={styles.searchAndFilterSection}>
            <Ionicons style={styles.searchIcon} name="search" size={20} color="#000"/>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por título..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Menu>
                    <MenuTrigger style={styles.filterTrigger}>
                        <Text>{filter}</Text>
                        <Ionicons name="chevron-down-outline" size={20} color="#000" />
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => setFilter('Todos')} text="Todos" />
                        <MenuOption onSelect={() => setFilter('Adopción')} text="Adopción" />
                        <MenuOption onSelect={() => setFilter('Perdido')} text="Perdido" />
                        <MenuOption onSelect={() => setFilter('Informativo')} text="Informativo" />
                    </MenuOptions>
                </Menu>
            </View>
            {posts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay posts creados</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPosts}
                    renderItem={({ item }) => (
                        <PostItem 
                            post={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onPress={handlePressPost}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
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
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 10,
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
        flex: 1, // Asegura que el texto no se superponga con los botones
    },
    actionsContainer: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    editButton: {
        backgroundColor: '#FFB74D',
    },
    deleteButton: {
        backgroundColor: '#EF5350',
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
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    pageButton: {
        backgroundColor: '#FFA726',
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
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
        width: '100%',
    },
    modalContent: {
        marginBottom: 15,
    },
    modalLabel: {
        fontWeight: 'bold',
    },
    modalValue: {
        marginBottom: 5,
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
    searchAndFilterSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
    },
    filterTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
});

export default MyPostsScreen;
