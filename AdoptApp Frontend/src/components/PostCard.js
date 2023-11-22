import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";
import ShareButton from "./ShareButton";

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
        return <Image source={{ uri: images[0] }} style={styles.fullImage} />;
      } else if (images.length === 2) {
        return (
          <View style={styles.imageContainer}>
            {images.map((img) => (
              <Image key={img} source={{ uri: img }} style={styles.halfImage} />
            ))}
          </View>
        );
      } else if (images.length >= 3) {
          return (
              <View style={styles.imageContainer}>
                  <Image source={{ uri: images[0] }} style={styles.halfImage} />
                  <View style={styles.quarterImageContainer}>
                      <Image source={{ uri: images[1] }} style={styles.quarterImage} />
                      <Image source={{ uri: images[2] }} style={styles.quarterImage} />
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
          <Text style={styles.content}>{post.title}</Text>
          {renderImages()}
          <View style={styles.footer}>
            <LikeButton />
            <SaveButton />
            <ShareButton />
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
    width: '100%',
    borderRadius: 10, // Establece el radio de borde como desees
    overflow: 'hidden'
},
fullImage: {
    width: '100%',
    height: 200, // o el alto que desees
},
halfImage: {
    width: '49.5%', // Ligeramente menos de la mitad para considerar el espaciado
    height: 200, // o el alto que desees
    overflow: 'hidden'
},
quarterImageContainer: {
    width: '49.5%',
    justifyContent: 'space-between',
},
quarterImage: {
    width: '100%',
    height: 95, // La mitad del alto de halfImage menos algo de espaciado
},
  image: {
      width: '32%', // Tres imágenes en una fila
      aspectRatio: 1, // Imágenes cuadradas
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
  },
  // ...otros estilos que necesites
});

export default PostCard;
