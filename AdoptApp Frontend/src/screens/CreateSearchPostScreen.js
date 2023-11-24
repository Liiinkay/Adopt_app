import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthProvider';
import { usePosts } from '../contexts/PostProvider';

const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('El título es obligatorio').max(30, 'El título no puede exceder los 30 caracteres'),
    descripcion: Yup.string().required('La descripción es obligatoria').max(500, 'La descripción no puede exceder los 500 caracteres'),
    ultimoVisto: Yup.string().required('La descripción es obligatoria').max(500, 'La descripción no puede exceder los 500 caracteres'),
});

const defaultRegion = {
    latitude: -33.0458,
    longitude: -71.6197,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const CreateSearchPostScreen = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [imagenes, setImagenes] = useState([]);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState();
    const { getUserId } = useAuth();
    const { createLostPost, updateLostPost } = usePosts();
    const { post } = route.params || {};

    useEffect(() => {
        obtenerUbicacion();
    }, []);

    const handleFormSubmit = async (values) => {
        setIsLoading(true);
        const formData = transformData(values);

        try {
            if (post) {
                // Actualizar un post existente
                await updateLostPost(post.id, formData);
                Alert.alert('Publicación actualizada', 'Tu publicación ha sido actualizada correctamente.');
            } else {
                // Crear un nuevo post
                await createLostPost(formData, getUserId());
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
        // Agregar campos de texto al formData
        formData.append('title', values.titulo);
        formData.append('description', values.descripcion);
        formData.append('track_detail', values.ultimoVisto);
        formData.append('type', 'lost');
        formData.append('state', 'open');
        formData.append('coordinates', '');
    
        if (selectedLocation) {
            formData.append('latitude', selectedLocation.latitude);
            formData.append('longitude', selectedLocation.longitude);
        }
        // Agregar imágenes al formData
        if(imagenes.length != 0){
            imagenes.forEach((img, index) => {
                // Aquí asumo que cada imagen en el array `imagenes` es un objeto con una propiedad `localUri`
                const localUri = img.localUri;
                const filename = localUri.split('/').pop();
                // Inferir el tipo MIME de la imagen
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                
                // Agregar la imagen al formData
                formData.append('images', { uri: localUri, name: filename, type });
            });
        }else {
            formData.append('images', '')
        }
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

    const showMap = () => {
        setIsMapVisible(true);
        obtenerUbicacion();
    };

    const obtenerUbicacion = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permiso de acceso a la ubicación fue denegado');
          return;
        }
      
        try {
            let location = await Location.getCurrentPositionAsync({});
            setSelectedLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        } catch (error) {
            // Manejar errores, como la incapacidad para obtener la ubicación
            alert('No se pudo obtener la ubicación. Por favor, intente de nuevo o conceda permisos más permanentes.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crear</Text>
                <Ionicons name="paw" size={24} color="white" style={{ marginRight: 16 }} />
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Formik
                    initialValues={{
                        titulo: post ? post.title : '',
                        descripcion: post ? post.description : '',
                        ultimoVisto: post ? post.ultimoVisto : '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
                        <>
                            <Text style={styles.mainTitle}>Publicación de búsqueda</Text>

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

                            {/* Sección de dirección */}
                            <Text style={styles.sectionTitle}>Información adicional</Text>

                            <Text style={styles.inputLabel}>Detalles de última vez visto</Text>
                            <TextInput
                                value={values.ultimoVisto}
                                onChangeText={handleChange('ultimoVisto')}
                                onBlur={handleBlur('ultimoVisto')}
                                placeholder="Detalles de última vez visto"
                                maxLength={500}
                                style={styles.input}
                                multiline
                            />

                            {isMapVisible && (
                                <MapView
                                    style={styles.map}
                                    initialRegion={defaultRegion}
                                    onPress={e => setSelectedLocation(e.nativeEvent.coordinate)}
                                >
                                    {selectedLocation && (
                                        <Marker
                                            title="Ubicación Seleccionada"
                                            coordinate={selectedLocation}
                                        />
                                    )}
                                </MapView>
                            )}

                            {!isMapVisible && (
                                <TouchableOpacity onPress={showMap} style={styles.buttonAddHide}>
                                    <Ionicons name="add-circle" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                                    <Text style={styles.buttonText}>Agregar dirección</Text>
                                </TouchableOpacity>
                            )}

                            {isMapVisible && (
                                <TouchableOpacity onPress={() => setIsMapVisible(false)} style={styles.buttonAddHide}>
                                    <Ionicons name="remove-circle" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                                    <Text style={styles.buttonText}>Ocultar mapa</Text>
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
                                        <Text style={styles.publishButtonText}>Publicar</Text>
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
        backgroundColor: '#F3B63F',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#F8F8F8',
        marginVertical: 10,
    },
    publishButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3B63F',
        padding: 10,
        borderRadius: 20,
        marginTop: 20,
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
    buttonAddHide: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3B63F',
        padding: 10,
        borderRadius: 20,
        marginVertical: 10,
    },
    buttonIcon: {
        marginRight: 8,
        color: '#FFFFFF',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '400',
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
    map: {
        width: '100%',
        height: 200, // ajusta según tus necesidades
    },
});


export default CreateSearchPostScreen;
