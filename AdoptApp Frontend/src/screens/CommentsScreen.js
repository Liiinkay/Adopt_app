import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const COMMENTS_PER_PAGE = 5; // Ajusta esto según tus necesidades

const CommentsScreen = ({ navigation, post }) => {
  const { postId } = route.params; // Asumiendo que pasas el ID del post como parámetro
  const [comments, setComments] = useState([]); // Estado inicial vacío para los comentarios
  const [newComment, setNewComment] = useState(''); // Estado para manejar el nuevo comentario
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la paginación

  // Simulando la carga de comentarios (reemplaza esto con tu llamada a la API)
  useEffect(() => {
    const loadComments = async () => {
      // Aquí cargarías los comentarios del backend
      const loadedComments = new Array(20).fill('').map((_, i) => ({
        id: String(i),
        text: `Comentario ${i + 1} para el post ${postId}`,
      }));
      setComments(loadedComments);
    };

    loadComments();
  }, [postId]);

  const addComment = () => {
    // Lógica para añadir un comentario al backend
    console.log('Agregar comentario:', newComment);
    setNewComment('');
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
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
        ListHeaderComponent={(
          <View>
            <TextInput
              style={styles.input}
              onChangeText={setNewComment}
              value={newComment}
              placeholder="Escribe tu comentario aquí..."
            />
            <Button title="Agregar Comentario" onPress={addComment} />
          </View>
        )}
      />
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <Button
            title="<"
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(currentPage - 1)}
          />
          <Text>Página {currentPage} de {totalPages}</Text>
          <Button
            title=">"
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage(currentPage + 1)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  commentText: {
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default CommentsScreen;
