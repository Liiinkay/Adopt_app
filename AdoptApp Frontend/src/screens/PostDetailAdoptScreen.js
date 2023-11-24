import React, { useState, useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, ScrollView } from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from 'react-native-swiper';
import { Ionicons } from "@expo/vector-icons";
import LikeButton from "../components/LikeButton";
import config from '../../config';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthProvider';
import { usePosts } from "../contexts/PostProvider";


const apiUrl = config.API_URL;

const PostDetailAdoptScreen = ({ navigation }) => {
    const { getUserId } = useAuth();
    const { getFormsByPostId } = usePosts();
    const userId = getUserId();
    const route = useRoute(); 
    const { post, userInfo } = route.params;
    const images = post.images.map(img => `${apiUrl}/api/${img}`);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const checkIfUserSubmittedForm = async () => {
            try {
                const forms = await getFormsByPostId(post.id);
                console.log(forms);
                const userSubmitted = forms.some(form => form.idApplicant === userId);
                setHasSubmitted(userSubmitted);
            } catch (error) {
                console.error('Error al verificar los formularios:', error);
            }
        };

        checkIfUserSubmittedForm();
    }, [post.id, userId, getFormsByPostId]);

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
                    <View style={styles.postView}>

                        <View style={styles.sliderContainer}>
                            <Swiper
                                showsButtons={false}
                                loop={false}
                                onIndexChanged={(index) => console.log('Current image index:', index)}
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
                        <View style={styles.userInfoContainer}>
                            <Image source={{ uri: userInfo ? `${apiUrl}/api/${userInfo.profile_img}` : 'url_por_defecto' }} style={styles.userImage} />
                            <View style={styles.userInfoText}>
                                <Text style={styles.userName}>{userInfo.n}</Text>
                                <Text style={styles.timeSince}>{`Hace ${timeSince(post.createdDate)}`}</Text>
                            </View>
                            <Text style={styles.likesCount}>{`${post.likesCount}`}</Text>
                            <LikeButton />
                        </View>
                        <Text style={styles.postTitle}>{post?.title}</Text>
                        <Text style={styles.postDescription}>{post?.description}</Text>
                        <Text style={styles.sectionTitle}>Información adicional</Text>
                            {/* tabla de información */}
                            <View style={styles.petInfoContainer}>
                                
                                <Text style={styles.petInfoText}>Edad: {post?.age}</Text>
                                <Text style={styles.petInfoText}>Sexo: {post?.gender}</Text>
                                <Text style={styles.petInfoText}>Temperamento: {post?.personality}</Text>
                                <Text style={styles.petInfoText}>Información médica: {post?.medical_information}</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Formulario</Text>
                            {
                                hasSubmitted ? (
                                    <View style={styles.thankYouMessage}>
                                        <Text style={styles.thankYouText}>Muchas gracias por su postulación!</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.adoptButton}
                                        onPress={() => navigation.navigate('AdoptForm', { post, userId })}
                                    >
                                        <Text style={styles.adoptButtonText}>Postular a adopción</Text>
                                    </TouchableOpacity>
                                )
                            }
                        <Text style={styles.sectionTitle}>Preguntas y Respuestas</Text>
                        <TouchableOpacity style={styles.adoptButton} onPress={() => navigation.navigate('Questions', { post })}>
                            <Text style={styles.adoptButtonText}>Ver comentarios</Text>
                        </TouchableOpacity>
                    </View>
                </>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Fondo claro
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F348A4', // Color rosa para la cabecera
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
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
        fontSize: 14,
        color: 'gray',
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
    petInfoContainer: {
        flexDirection: 'row', // Hace que los elementos se dispongan en fila
        flexWrap: 'wrap', // Permite el ajuste de elementos en líneas múltiples
        justifyContent: 'space-between', // Espacia los elementos uniformemente
        backgroundColor: 'white', // Fondo blanco para la tabla
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1, // Borde ligero para la tabla
        borderColor: '#e0e0e0', // Color del borde
    },
    petInfoText: {
        fontSize: 14,
        marginBottom: 5,
        width: '48%', // Ancho para cada elemento, dos por fila
        textAlign: 'left', // Alineación del texto
    },
    adoptButton: {
        backgroundColor: '#F348A4',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    adoptButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Mensaje de agradecimiento
    thankYouMessage: {
        backgroundColor: '#F348A4',
        borderRadius: 25,
        paddingVertical: 20, // Aumento del padding vertical
        paddingHorizontal: 20, // Añadido padding horizontal
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginHorizontal: 10, // Margen horizontal para no ocupar todo el ancho
    },
    thankYouText: {
        color: 'white',
        fontSize: 18, // Tamaño de fuente aumentado
        fontWeight: 'bold',
        textAlign: 'center', // Asegura que el texto esté centrado
    },
    timeSince: {
        fontSize: 14,
        color: 'grey',
    },
    likesCount: {
        fontSize: 14,
        color: 'grey',
        marginRight: 8,
        // Ajusta estos estilos según sea necesario
    },
});

export default PostDetailAdoptScreen;
