import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import LikeButton from "./LikeButton";

import config from '../../config';

const apiUrl = config.API_URL;

const PostCard = ({ post, navigation }) => {
    const images = post?.images?.map(img => `${apiUrl}/api/${img}`) || [];

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
      const fetchUserInfo = async () => {
        const url = `${apiUrl}/api/users/${post.authorID}`;
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setUserInfo(data);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
  
      fetchUserInfo();
    }, [post.authorId]);

    const navigateToDetailScreen = () => {
      let screenName = "PostDetailScreen"; // Pantalla por defecto
      if (post.type === 'adopt') {
          screenName = "PostDetailAdopt";
      } else if (post.type === 'lost') {
          screenName = "PostDetailLost";
      } else if (post.type === 'informative') {
          screenName = "PostDetailInformative";
      }

      navigation.navigate(screenName, { post, userInfo });
    };

    // Renderiza las imágenes basadas en la cantidad
    const renderImages = () => {
      if (images.length === 1) {
        return (
          <View style={styles.imageContainer}>
            <Image source={{ uri: images[0] }} style={styles.fullImage} />
          </View>
        );
      } else if (images.length === 2) {
        return (
          <View style={styles.imageContainer}>
            {images.map((img, index) => (
              <Image
                key={img}
                source={{ uri: img }}
                style={[styles.halfImage, index !== 0 && { marginLeft: 5 }]} // Añade margen izquierdo a la segunda imagen
              />
            ))}
          </View>
        );
      } else if (images.length >= 3) {
        return (
          <View style={styles.imageContainer}>
            <Image source={{ uri: images[0] }} style={styles.halfImage} />
            <View style={styles.quarterImageContainer}>
              {images.slice(1).map((img, index) => (
                <Image
                  key={img}
                  source={{ uri: img }}
                  style={[styles.quarterImage, index !== 0 && { marginTop: 5 }]} // Añade margen superior a partir de la segunda imagen
                />
              ))}
            </View>
          </View>
        );
      }
    };

    // URL de la imagen del perfil del usuario o un placeholder
    const userProfileImage = userInfo && userInfo.profile_img
      ? `${apiUrl}/api/${userInfo.profile_img}`
      : 'https://example.com/default-profile-pic.jpg';

    return (
      <View style={styles.cardContainer}>
        <Pressable
          style={styles.container}
          onPress={navigateToDetailScreen}>

          {/* Header del post con imagen de usuario, nombre y botón de menú */}
          <View style={styles.header}>
            <View style={styles.profileContainer}>
              <Image 
                source={{ uri: userProfileImage }}
                style={styles.userImage}
              />
              <View style={styles.headerContainer}>
                <Text style={styles.name}> @{userInfo ? userInfo.nickname : 'Loading...'}</Text>
                <Text style={styles.username}>{post.age} years - {post.gender}</Text>
              </View>
            </View>
            <Menu>
              <MenuTrigger>
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => alert('Guardar')} text='Guardar' />
                <MenuOption onSelect={() => alert('Reportar')} text='Reportar' />
              </MenuOptions>
            </Menu>
          </View>

          {/* Descripción del post */}
          <Text style={styles.content}>{post.title}</Text>

          {/* Imágenes del post */}
          {renderImages()}

          {/* Footer del post con botón de 'me gusta' y contador de 'likes' */}
          <View style={styles.footer}>
            <Text style={styles.likesCount}>{post.likesCount}</Text>
            <LikeButton style={styles.likeButton} />
          </View>

        </Pressable>
      </View>
    );
};

const styles = StyleSheet.create({
  cardContainer: {
      borderColor: 'lightgrey',
      backgroundColor: 'white',
      borderBottomWidth: StyleSheet.hairlineWidth,
      padding: 10,
      marginVertical: 1,
  },
  container: {
      flexDirection: 'column',
  },
  profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainer: {
      marginLeft: 10,
  },
  userImage: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
  },
  name: {
      fontWeight: 'bold',
  },
  username: {
      color: 'grey',
  },
  content: {
      marginTop: 5,
  },

  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  fullImage: {
    width: '100%',
    height: 200,
  },
  halfImage: {
    width: '49.5%',
    height: 200,
  },
  quarterImageContainer: {
    width: '49.5%',
    justifyContent: 'space-between',
  },
  quarterImage: {
    width: '100%',
    height: 95,
    marginBottom: 5, // Añade margen en la parte inferior para el espaciado entre las imágenes
  },
  image: {
        width: '32%', // Tres imágenes en una fila
        aspectRatio: 1, // Imágenes cuadradas
  },
  likesCount: {
    fontSize: 14,
    color: 'grey',
    marginRight: 8,
  },
  likeButton: {
    marginLeft: 'auto', 
    padding: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 5,
  },

});

export default PostCard;
