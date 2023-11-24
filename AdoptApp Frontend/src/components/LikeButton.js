import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de importar los iconos de Ionicons desde tu fuente
import { usePosts } from "../contexts/PostProvider";
import { Text } from 'react-native';
import { useAuth } from '../contexts/AuthProvider';

const LikeButton = ({ postId }) => {
  const { getUserId } = useAuth();
  const userId = getUserId();
  const { getLikesByPostId, likePost, unlikePost } = usePosts();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState( 0);
  const iconName = isLiked ? 'heart' : 'heart-outline'; // Cambia el icono dependiendo del estado
  const iconColor = isLiked ? 'red' : 'black'; // Cambia el color del icono

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        if (!userId) return;
        if (!postId) return;
        const likes = await getLikesByPostId(postId);
        const userLiked = likes.some(like => String(like) === String(userId));
        setIsLiked(userLiked);
        setLikesCount(likes.length);
      } catch (error) {
        console.log('Error al verificar likes:', error);
      }
    };

    checkIfLiked();
  }, [postId, userId]);

  const handleLike = async () => {
    console.log('Like button pressed');
    try {
      if (isLiked) {
        console.log('Unlike')
        await unlikePost(postId, userId);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        console.log('Like')
        await likePost(postId, userId);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.log(error.message);
      if (error.message.includes('Liked yet')) {
        console.log('Ya diste like a este post.');
      } else {
        console.error('Error al actualizar like:', error);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.likeButton} onPress={() => {
      console.log('Like button pressed');
      handleLike();
    }}>
      <Ionicons name={iconName} size={24} color={iconColor} />
      <Text style={styles.likesCountText}>{likesCount}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  likeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
  },
  likesCountText: {
      marginLeft: 8,
      fontSize: 16,
  },
});

export default LikeButton;
