import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const SaveButton = () => {
  const [saved, setSaved] = useState(false);

  const toggleSave = () => {
    setSaved(!saved);
  };

  return (
    <TouchableOpacity onPress={toggleSave}>
      <Ionicons
        name={saved ? 'bookmark' : 'bookmark-outline'}
        size={24}
        color={saved ? '#F3B63F' : 'black'} 
      />
    </TouchableOpacity>
  );
};

export default SaveButton;
