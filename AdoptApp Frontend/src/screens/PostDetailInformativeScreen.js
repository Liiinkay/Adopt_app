import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, ScrollView, Alert } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import LikeButton from "../components/LikeButton";
import config from '../../config';
import { useUsers } from "../contexts/UserProvider";

const apiUrl = config.API_URL;

const PostDetailInformativeScreen = ({ navigation }) => {
    const  route  = useRoute();
    const { post, userInfo } = route.params;
    const images = post.images.map(img => `${apiUrl}/api/${img}`);
    const { savePost } = useUsers();

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <>
                    {/* Header */}
                    <StatusBar barStyle="light-content" backgroundColor="black" />
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Post Informativo</Text>
                        <Menu>
                                <MenuTrigger>
                                    <Ionicons name="ellipsis-vertical" size={24} color="white" />
                                </MenuTrigger>
                                <MenuOptions>
                                    <MenuOption text='Guardar' onSelect={onSaved} />
                                </MenuOptions>
                            </Menu>
                    </View>
                    {/* Contenido del post */}
                    <View style={styles.postView}>
                        {/* Imagenes */}
                        <View style={styles.sliderContainer}>
                            <Swiper
                                showsButtons={true}
                                loop={false}
                            >
                                {images?.map((imageUri, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => navigateToFullScreenImage(imageUri)}
                                    >
                                        <Image source={{ uri: imageUri }} style={styles.postImage} />
                                    </TouchableOpacity>
                                ))}
                            </Swiper>
                        </View>
                        {/* Usuario y like */}
                        <View style={styles.userInfoContainer}>
                            <Image source={{ uri: userInfo ? `${apiUrl}/api/${userInfo.profile_img}` : 'url_por_defecto' }} style={styles.userImage} />
                            <View style={styles.userInfoText}>
                                <Text style={styles.userName}>{userInfo.name}</Text>
                                <Text style={styles.userDescription}>{userInfo.nickname}</Text>
                            </View>
                            <LikeButton />
                        </View>
                        <Text style={styles.postTitle}>{post?.title}</Text>
                        <Text style={styles.postDescription}>{post?.description}</Text>

                        <Text style={styles.sectionTitle}>Comentarios</Text>
                        <TouchableOpacity style={styles.commentsButton} onPress={() => navigation.navigate('Comments', { post })}>
                            <Text style={styles.commentsButtonText}>Ver comentarios</Text>
                        </TouchableOpacity>
                    </View>
                </>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#AA4CF4', // Color naranja, como original
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'white',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Fondo claro para contraste
    },
    postView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    sliderContainer: {
        height: 250,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userInfoText: {
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    userDescription: {
        color: 'gray',
        fontSize: 12,
    },
    postTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    postDescription: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        marginBottom: 10,
        borderBottomWidth: 1, // Línea de separación
        borderBottomColor: '#e0e0e0', // Color de la línea
    },
    map: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    commentsButton: {
        backgroundColor: '#F348A4', // Color rosa original para el botón
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        elevation: 1,
    },
    commentsButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default PostDetailInformativeScreen;
