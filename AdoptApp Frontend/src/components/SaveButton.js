import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importa los iconos de Ionicons desde tu fuente

const SaveButton = () => {
  const [saved, setSaved] = useState(false);

  const toggleSave = () => {
    setSaved(!saved);
  };

  return (
    <TouchableOpacity onPress={toggleSave}>
      <Ionicons
        name={saved ? 'bookmark' : 'bookmark-outline'} // Cambia 'bookmark' y 'bookmark-outline' por los nombres de tus iconos de Ionicons
        size={25}
        color={saved ? 'black' : 'black'} // Cambia 'green' al color que desees para el botón de "guardar" activo
      />
    </TouchableOpacity>
  );
};

export default SaveButton;
