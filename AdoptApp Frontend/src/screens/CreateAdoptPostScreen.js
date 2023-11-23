import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthProvider';
import { usePosts } from '../contexts/PostProvider';

// Esquema de validación para el formulario completo
const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('El título es obligatorio').max(30, 'El título no puede exceder los 30 caracteres'),
    descripcion: Yup.string().required('La descripción es obligatoria').max(500, 'La descripción no puede exceder los 500 caracteres'),
    genero: Yup.string().required('El género es obligatorio'),
    edad: Yup.string().max(30, 'La edad no puede exceder los 30 caracteres'),
    personalidad: Yup.string().max(30, 'La personalidad no puede exceder los 30 caracteres'),
    informacionMedica: Yup.string().max(300, 'La información médica no puede exceder los 300 caracteres'),
});

const CreateAdoptPostScreen = ({ navigation }) => {
    const [imagenes, setImagenes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getUserId } = useAuth();
    const { createAdoptPost } = usePosts();

    const handleFormSubmit = async (values) => {
        setIsLoading(true);
        const formData = transformData(values);
        const userId = getUserId();
        
        try {
            const data = await createAdoptPost(formData, userId); // Usa createAdoptPost en lugar de fetch
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
        formData.append('gender', values.genero);
        //formData.append('age', values.edad);
        formData.append('personality', values.personalidad);
        formData.append('medical_information', values.informacionMedica);
        formData.append('state', 'open');
        formData.append('type', 'adopt');
        formData.append('age', 9);
    
        // Agregar imágenes al formData
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
                <Text style={styles.headerTitle}>Crear</Text>
                <Ionicons name="paw" size={24} color="white" style={{ marginRight: 16 }} />
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Formik
                    initialValues={{
                        titulo: '',
                        descripcion: '',
                        genero: '',
                        edad: '',
                        personalidad: '',
                        informacionMedica: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
                        <>
                            <Text style={styles.mainTitle}>Publicación de adopción</Text>

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

                            <Text style={styles.sectionTitle}>Información adicional</Text>

                            <Text style={styles.inputLabel}>Género</Text>
                            <Picker
                                selectedValue={values.genero}
                                onValueChange={handleChange('genero')}
                                style={styles.picker}
                            >
                                <Picker.Item label="Macho" value="macho" />
                                <Picker.Item label="Hembra" value="hembra" />
                            </Picker>
                            {touched.genero && errors.genero && <Text style={styles.errorText}>{errors.genero}</Text>}

                            <Text style={styles.inputLabel}>Edad (Opcional)</Text>
                            <TextInput
                                value={values.edad}
                                onChangeText={handleChange('edad')}
                                onBlur={handleBlur('edad')}
                                placeholder="Introduce la edad"
                                style={styles.input}
                                maxLength={30}
                            />

                            <Text style={styles.inputLabel}>Personalidad (Opcional)</Text>
                            <TextInput
                                value={values.personalidad}
                                onChangeText={handleChange('personalidad')}
                                onBlur={handleBlur('personalidad')}
                                placeholder="Describe la personalidad"
                                style={styles.input}
                                maxLength={30}
                            />

                            <Text style={styles.inputLabel}>Información Médica (Opcional)</Text>
                            <TextInput
                                value={values.informacionMedica}
                                onChangeText={handleChange('informacionMedica')}
                                onBlur={handleBlur('informacionMedica')}
                                placeholder="Información médica relevante"
                                style={styles.input}
                                maxLength={300}
                                multiline
                            />

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
        backgroundColor: '#F348A4',
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
        backgroundColor: '#F348A4',
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: 'grey', // O cualquier otro color que indique que está desactivado
    },
    publishButtonText: {
        color: '#FFFFFF',
        fontSize: 15, // Ajusta el tamaño de la fuente según necesites
        fontWeight: '400',
        marginRight: 8, // Añade un margen a la derecha para separarlo del icono
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
    bottomContainer: {
        position: 'absolute',
        bottom: 0, 
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imagenesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
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
        color: 'grey',
    },
    errorText: {
        fontSize: 10,
        color: 'red',
        paddingHorizontal: 15,
    },
    modalView: {
        marginTop: 80,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    inputLabel: {
        fontSize: 16,
        marginTop: 8,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: "center",
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: '#F348A4',
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    submitButtonText: {
        color: 'white',
        textAlign: 'center',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#F8F8F8',
        marginTop: 10,
    },
});

export default CreateAdoptPostScreen;
