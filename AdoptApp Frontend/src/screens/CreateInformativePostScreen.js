import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthProvider';
import { usePosts } from '../contexts/PostProvider';

const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('El título es obligatorio').max(30, 'El título no puede exceder los 30 caracteres'),
    descripcion: Yup.string().required('La descripción es obligatoria').max(500, 'La descripción no puede exceder los 500 caracteres'),
});

const CreateInformativePostScreen = ({ navigation, route }) => {
    const [imagenes, setImagenes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getUserId } = useAuth();
    const { createInformativePost, updateInformativePost } = usePosts();
    const { post } = route.params || {};

    const handleFormSubmit = async (values) => {
        setIsLoading(true);
        const formData = transformData(values);
        const userId = getUserId();

        try {
            if (post) {
                // Actualizar un post existente
                await updateInformativePost(post.id, formData);
                Alert.alert('Publicación actualizada', 'Tu publicación ha sido actualizada correctamente.');
            } else {
                // Crear un nuevo post
                await createInformativePost(formData, userId);
                Alert.alert('Publicación creada', 'Tu publicación ha sido creada correctamente.');
            }
            navigation.navigate('Tabs');
        } catch (error) {
            console.error('Error en la petición:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const transformData = (values) => {
        const formData = new FormData();
        formData.append('title', values.titulo);
        formData.append('description', values.descripcion);
        formData.append('type', 'informative');
        
        imagenes.forEach((img, index) => {
            const localUri = img.localUri;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            formData.append('images', { uri: localUri, name: filename, type });
        });

        return formData;
    }

    const eliminarImagen = (index) => {
        setImagenes(imagenes.filter((_, idx) => idx !== index));
    };

    const handleImagePicker = async () => {
        let permisoResultado = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permisoResultado.granted === false) {
            alert('Se requieren permisos para acceder a tus imágenes.');
            return;
        }

        const pickerResultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResultado.canceled && typeof pickerResultado.uri === 'string') {
            setImagenes([...imagenes, { localUri: pickerResultado.uri }]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{post ? 'Editar publicación' : 'Crear publicación'}</Text>
                <Ionicons name="paw" size={24} color="white" style={{ marginRight: 16 }} />
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Formik
                    initialValues={{
                        titulo: post ? post.title : '',
                        descripcion: post ? post.description : '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
                        <>
                            <Text style={styles.mainTitle}>Publicación informativa</Text>

                            <Text style={styles.inputLabel}>Título</Text>
                            <TextInput
                                value={values.titulo}
                                onChangeText={handleChange('titulo')}
                                onBlur={handleBlur('titulo')}
                                placeholder="Escribe un título..."
                                maxLength={30}
                                style={styles.input}
                            />
                            {touched.titulo && errors.titulo && <Text style={styles.errorText}>{errors.titulo}</Text>}

                            <Text style={styles.inputLabel}>Descripción</Text>
                            <TextInput
                                value={values.descripcion}
                                onChangeText={handleChange('descripcion')}
                                onBlur={handleBlur('descripcion')}
                                placeholder="Escribe una descripción"
                                maxLength={500}
                                style={styles.input}
                                multiline
                            />
                            {touched.descripcion && errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}

                            {/* Sección de imágenes */}
                            {imagenes.map((img, index) => (
                                <View key={index} style={styles.imagenWrapper}>
                                    <Image source={{ uri: img.localUri }} style={styles.imagenPrevisualizacion} />
                                    <TouchableOpacity style={styles.removeButton} onPress={() => eliminarImagen(index)}>
                                        <Ionicons name="close-circle" size={24} color="#F348A4" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {imagenes.length < 3 && (
                                <TouchableOpacity
                                    style={[styles.button, styles.imageButton]}
                                    onPress={handleImagePicker}
                                >
                                    <Ionicons name="image" size={24} color="#F348A4" />
                                    <Text>Agregar Imágenes</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[styles.publishButton, !(isValid && dirty) && styles.disabledButton]}
                                onPress={handleSubmit}
                                disabled={!(isValid && dirty)}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.publishButtonText}>{post ? 'Actualizar' : 'Publicar'}</Text>
                                        <Ionicons name="send" size={24} color="#FFFFFF" />
                                    </View>    
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#AA4CF4',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        flex: 1,
    },
    publishButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AA4CF4',
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    publishButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '400',
        marginRight: 8,
    },
    input: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#D3D3D3',
        backgroundColor: '#FFFFFF',
        marginVertical: 10,
        borderRadius: 10,
    },
    contentContainer: {
        padding: 20,
    },
    imageButton: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: 'grey', 
    },
    imagenPrevisualizacion: {
        width: 100,
        height: 100,
        borderRadius: 10,
        margin: 5,
    },
    imagenWrapper: {
        position: 'relative',
        marginRight: 5,
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    errorText: {
        fontSize: 10,
        color: 'red',
        paddingHorizontal: 15,
    },
    inputLabel: {
        fontSize: 16,
        marginTop: 8,
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
        textAlign: 'center',
        backgroundColor: '#F8F8F8', 
        borderRadius: 10,
        marginHorizontal: 20, 
        marginTop: 10, 
        overflow: 'hidden', 
    },
});


export default CreateInformativePostScreen;
