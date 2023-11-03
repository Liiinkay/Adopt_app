import React from 'react';
import { TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const ShareButton = () => {

  const share = async() => {
    const options = {
      message: '!Comparte esta publicación a tus amigos!'
    }
    try {
      const ShareResponse = await Share.share(options);
      console.log(ShareResponse);
    } catch(e) {
      console.log('Error: ', e);
    }
  }
  return (
    <TouchableOpacity onPress={share}>
      <Ionicons
        name="share-social"
        size={25}
        color="black" 
      />
    </TouchableOpacity>
  );
};

export default ShareButton;
