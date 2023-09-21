import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de importar los iconos de Ionicons desde tu fuente

const LikeButton = () => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <TouchableOpacity onPress={toggleLike}>
      <Ionicons
        name={liked ? 'heart' : 'heart-outline'} // Cambia 'heart' y 'heart-outline' por los nombres de tus iconos de Ionicons
        size={25}
        color={liked ? '#F348A4' : 'black'} // Cambia 'red' al color que desees para el botón de "like" activo
      />
    </TouchableOpacity>
  );
};

export default LikeButton;
