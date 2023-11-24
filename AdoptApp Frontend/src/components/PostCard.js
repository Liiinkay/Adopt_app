import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import LikeButton from "./LikeButton";
import { useAuth } from "../contexts/AuthProvider";

import config from '../../config';
import { useUsers } from "../contexts/UserProvider";

const apiUrl = config.API_URL;

const PostCard = ({ post, navigation }) => {
    const images = post?.images?.map(img => `${apiUrl}/api/${img}`) || [];
    console.log(post);
    const [userInfo, setUserInfo] = useState(null);
    const { getUserId } = useAuth();
    const { savePost } = useUsers()

    const timeSince = (date) => {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      let interval = seconds / 31536000; // Años
  
      if (interval > 1) {
          return Math.floor(interval) + " años";
      }
      interval = seconds / 2592000; // Meses
      if (interval > 1) {
          return Math.floor(interval) + " meses";
      }
      interval = seconds / 86400; // Días
      if (interval > 1) {
          return Math.floor(interval) + " días";
      }
      interval = seconds / 3600; // Horas
      if (interval > 1) {
          return Math.floor(interval) + " horas";
      }
      interval = seconds / 60; // Minutos
      if (interval > 1) {
          return Math.floor(interval) + " minutos";
      }
      return Math.floor(seconds) + " segundos";
    };

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

    const onSaved = async () => {
      try {
        const result = await savePost({
          idPost: post.id,
        });

        console.log("Post guardado: ", result);
        Alert.alert('El post se ha guardado correctamente 😊');
      } catch (error) {
        console.error('Error saving post:', error);
      }
    };

    const onReported = () => {
      console.log('Reported');
    };

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

    const navigateToUserProfile = () => {
      navigation.navigate('UserProfile', { userId: post.authorID });
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

    const editPost = () => {
      navigation.navigate('EditPost', { post });
    };

    return (
      <View style={styles.cardContainer}>
          {/* Header del post con imagen de usuario, nombre y botón de menú */}
          <View style={styles.header}>
            {/* Envuelve la sección del nombre e imagen de perfil con Pressable */}
            <Pressable style={styles.profileContainer} onPress={navigateToUserProfile} onLongPress={editPost}>
              <Image 
                source={{ uri: userProfileImage }}
                style={styles.userImage}
              />
              <View style={styles.headerContainer}>
                <Text style={styles.name}> @{userInfo ? userInfo.nickname : 'Loading...'}</Text>
                <Text style={styles.username}>Hace {timeSince(post.createdDate)}</Text>
              </View>
            </Pressable>
            <Menu>
              <MenuTrigger>
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={onSaved} text='Guardar' />
                {/* <MenuOption onSelect={onReported} text='Reportar' /> */}
              </MenuOptions>
            </Menu>
            </View>

            {/* Pressable para el resto del contenido del PostCard */}
            <Pressable onPress={navigateToDetailScreen} onLongPress={editPost}>
              {/* Descripción del post */}
              <Text style={styles.content}>{post.title}</Text>

              {/* Imágenes del post */}
              {renderImages()}

              {/* Footer del post con botón de 'me gusta' y contador de 'likes' */}
              <View style={styles.footer}>
                <LikeButton postId={post.id} />
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
    marginTop: 5,
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
    marginBottom: 5,
  },
  image: {
      width: '32%',
      aspectRatio: 1,
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
    marginTop: 5,
  },

});

export default PostCard;