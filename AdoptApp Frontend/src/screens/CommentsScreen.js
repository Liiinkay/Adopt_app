import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useComments } from '../contexts/CommentProvider';
import { useAuth } from '../contexts/AuthProvider';
import { useUsers } from '../contexts/UserProvider';
import config from '../../config';

const API_URL = config.API_URL;

const COMMENTS_PER_PAGE = 8; // Ajusta esto según tus necesidades

const CommentItem = ({ comment }) => {
  const [user, setUser] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [error, setError] = useState(false);
  const { findOne } = useUsers();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(false);
        const userDetails = await findOne(comment.author);
        setUser(userDetails);
      } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [comment.author, findOne]);

  if (loading) {
    return <ActivityIndicator size={20} color="#F348A4" />;
  }

  if (error) {
    return <Text>No se pudo cargar este comentario</Text>;
  }

  return (
    <View style={styles.commentContainer}>
      <Image source={{ uri: `${API_URL}/api/${user.profile_img}` }} style={styles.profileImage} />
      <View style={styles.commentContent}>
        <Text style={styles.nickname}>{user.nickname}</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
    </View>
  );
};

const CommentsScreen = ({ navigation }) => {
  const route = useRoute();
  const { post } = route.params;
  const { createComment, getCommentsByPost } = useComments();
  const { getUserId } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const loadedComments = await getCommentsByPost(post.id);
        setComments(loadedComments);
      } catch (error) {
        console.error('Error al cargar los comentarios:', error);
      }
    };
    loadComments();
  }, [post.id, getCommentsByPost]);

  const addComment = async () => {
    if (newComment.trim() === '') {
      console.log('No se puede agregar un comentario vacío');
      return;
    }
    try {
      const commentData = {
        text: newComment,
        authorId: getUserId(),
      };
      const newCommentResponse = await createComment(post.id, commentData, post.type); 
      console.log('Comentario creado:', newCommentResponse);
  
      // Agregar el nuevo comentario al estado local
      setComments(prevComments => [
        ...prevComments,
        { text: commentData.text,
          author: commentData.authorId, 
          id: newCommentResponse.id 
        }
      ]);
  
      setNewComment('');
    } catch (error) {
      console.error('Error al crear el comentario:', error);
    }
  };

  // Obtener los comentarios para la página actual
  const indexOfLastComment = currentPage * COMMENTS_PER_PAGE;
  const indexOfFirstComment = indexOfLastComment - COMMENTS_PER_PAGE;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);

  return (
    <View style={styles.container}>
      <FlatList
        data={currentComments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentItem comment={item} />}
        ListHeaderComponent={(
          <View>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={setNewComment}
                value={newComment}
                placeholder="Escribe tu comentario aquí..."
                maxLength={100}
              />
              <TouchableOpacity style={styles.sendButton} onPress={addComment}>
                <Text style={styles.sendButtonText}>Agregar Comentario</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(currentPage - 1)}
          >
            <Text style={styles.pageButtonText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumberText}>Página {currentPage} de {totalPages}</Text>
          <TouchableOpacity 
            style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage(currentPage + 1)}
          >
            <Text style={styles.pageButtonText}>{">"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5', // Color de fondo similar al ManageUsersScreen
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10, // Bordes redondeados para el input
    padding: 10,
    backgroundColor: '#fff', // Fondo blanco para el input
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  nickname: {
    fontWeight: 'bold',
    color: '#333', // Color de texto para el nickname
  },
  commentText: {
    fontSize: 16,
    color: '#424242', // Color de texto para el comentario
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff', // Fondo blanco para el contenedor de paginación
    borderRadius: 10, // Bordes redondeados
    padding: 10,
  },
  pageButton: {
    backgroundColor: '#F348A4', // Botones de paginación color rosa
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Botón deshabilitado en gris
  },
  pageButtonText: {
    color: '#fff', // Texto de los botones en blanco
  },
  pageNumberText: {
    color: '#000', // Número de página en negro
  },
  sendButton: {
    backgroundColor: '#F348A4', // Color del botón
    padding: 10,
    borderRadius: 10, // Bordes redondeados
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Margen superior
  },
  sendButtonText: {
    color: '#fff', // Texto blanco
    fontWeight: 'bold', // Texto en negrita
  },
});


export default CommentsScreen;
