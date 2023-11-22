import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const fakeComments = [
    // Estructura de ejemplo para los comentarios
    { id: '1', text: 'Este es un comentario.', replies: [] },
    { id: '2', text: 'Otro comentario aquí.', replies: [] },
    // Agrega más comentarios de ejemplo aquí
];

const CommentItem = ({ comment }) => {
    return (
        <View style={styles.commentItem}>
            <Text style={styles.commentText}>{comment.text}</Text>
            {/* Aquí podrías agregar lógica para mostrar respuestas, si las hay */}
        </View>
    );
};

const PostDetailCommentsScreen = () => {
    const [comments, setComments] = useState(fakeComments);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        const newCommentObj = {
            id: (comments.length + 1).toString(), // Genera un ID simple para el ejemplo
            text: newComment,
            replies: []
        };
        setComments([...comments, newCommentObj]);
        setNewComment('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Escribe un comentario..."
                    multiline
                />
                <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={comments}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <CommentItem comment={item} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#F3B63F',
        borderRadius: 5,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        padding: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 5,
    },
    sendButton: {
        backgroundColor: '#F3B63F',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentItem: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    commentText: {
        fontSize: 16,
        color: '#333',
    },
    // Añade otros estilos que necesites aquí
});

export default PostDetailCommentsScreen;
