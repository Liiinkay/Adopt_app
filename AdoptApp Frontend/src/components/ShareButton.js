import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de importar los iconos de Ionicons desde tu fuente

const ShareButton = () => {
  const sharePost = () => {
    // Agrega aquí la lógica para compartir el post (puede ser un enlace o una acción específica)
    alert('¡Post compartido!');
  };

  return (
    <TouchableOpacity onPress={sharePost}>
      <Ionicons
        name="share-social" // Cambia 'share-social' por el nombre del icono de Ionicons que deseas utilizar para compartir
        size={25}
        color="black" // Cambia 'black' al color que desees para el botón de "compartir"
      />
    </TouchableOpacity>
  );
};

export default ShareButton;
