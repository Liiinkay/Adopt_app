import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, ScrollView } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from 'react-native-swiper';
import LikeButton from "../components/LikeButton";
import config from '../../config';

const apiUrl = config.API_URL;

const PostDetailLostScreen = ({ navigation, route }) => {
    const { post, userInfo } = route.params;
    const images = post.images.map(img => `${apiUrl}/api/${img}`);
    console.log(post);

    

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
                    <Text style={styles.headerTitle}>Post</Text>
                    <Menu>
                            <MenuTrigger>
                                <Ionicons name="ellipsis-vertical" size={24} color="white" />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => alert('Opción 1')} text='Guardar' />
                                <MenuOption onSelect={() => alert('Opción 2')} text='Reportar' />
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
                    <Text style={styles.sectionTitle}>Información relevante</Text>
                    {/* Sección de Última Vez Visto */}
                    <View style={styles.lastSeenSection}>
                        <Text style={styles.sectionTitle}>Última vez visto</Text>
                        <Text style={styles.trackDetailText}>{post.track_detail}</Text>
                        

                        {post.latitude && post.longitude && (
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: parseFloat(post.latitude),
                                    longitude: parseFloat(post.longitude),
                                    latitudeDelta: 0.003,  // Menor valor para más zoom
                                    longitudeDelta: 0.003, // Menor valor para más zoom
                                }}
                                scrollEnabled={false}
                                zoomEnabled={true}
                                pitchEnabled={false}
                                rotateEnabled={false}
                            >
                                <Marker
                                    coordinate={{ latitude: parseFloat(post.latitude), longitude: parseFloat(post.longitude) }}
                                    draggable={false} // Hace que el marcador no sea arrastrable
                                />
                            </MapView>
                        )}
                    </View>

                </View>
                <Text style={styles.sectionTitle}>Comentarios</Text>
            </>
        </ScrollView>
        <TouchableOpacity style={styles.commentsButton} onPress={navigation.navigate('Comments', { post })}>
        <Text style={styles.commentsButtonText}>Ver comentarios</Text>
      </TouchableOpacity>
    </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    // Estilos similares a PostDetailAdoptScreen pero con los colores ajustados
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F3B63F', // Color naranja
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
    },
    safeArea: {
        flex: 1,
    },
    commentItem: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    commentText: {
        fontWeight: 'normal',
        fontSize: 16,
        color: '#333',
    },
    noCommentsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    postView: {
        marginHorizontal: 15,
        marginTop: 10, 
    },
    sliderContainer: {
        height: 250,
        backgroundColor: '#eaeaea',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20, // Aumenta el margen inferior
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20, // Aumenta el margen inferior
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
    },
    postTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 10,
    },
    postDescription: {
        fontSize: 15,
        color: 'gray',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#F8F8F8',
        marginVertical: 10,
    },
    map: {
        width: '100%',
        height: 200, // ajusta según tus necesidades
    },
});

export default PostDetailLostScreen;
