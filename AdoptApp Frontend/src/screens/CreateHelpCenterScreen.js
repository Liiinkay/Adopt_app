import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView, 
    StatusBar, 
    Image, 
    ScrollView, 
    ActivityIndicator 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useHelpCenters } from '../contexts/HelpCenterProvider';

const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('El título es obligatorio').max(50, 'El título no puede exceder los 50 caracteres'),
    descripcion: Yup.string().required('La descripción es obligatoria').max(1000, 'La descripción no puede exceder los 1000 caracteres'),
    imagen: Yup.array().min(1, 'Se requiere al menos una imagen'),
    ubicacion: Yup.object().shape({
        latitude: Yup.number().required('La ubicación es obligatoria'),
        longitude: Yup.number().required('La ubicación es obligatoria'),
    }),
});

const defaultRegion = {
    latitude: -33.0458,
    longitude: -71.6197,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const CreateHelpCenterScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [imagenes, setImagenes] = useState([]);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState();
    const { createCoordinates } = useHelpCenters();

    const handleFormSubmit = async (values, actions) => {
      try {
        const formData = transformData(values);
        const response = await createCoordinates(formData);
        console.log('Formulario enviado con éxito', response);
        actions.setSubmitting(false); // Detiene el indicador de envío
        navigation.goBack(); // Regresa a la pantalla anterior
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        actions.setSubmitting(false); // Detiene el indicador de envío si hay un error
      }
    };
    const transformData = (values) => {
        const formData = new FormData();
        formData.append('title', values.titulo);
        formData.append('description', values.descripcion);

        if (selectedLocation) {
            formData.append('latitude', selectedLocation.latitude);
            formData.append('longitude', selectedLocation.longitude);
        }

        if(imagenes.length !== 0){
            const img = imagenes[0];
            const localUri = img.localUri;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            formData.append('image', { uri: localUri, name: filename, type });
        }
        return formData;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />

            {/* Encabezado del Componente */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crear Centro de Ayuda</Text>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Formik
                    initialValues={{
                        titulo: '',
                        descripcion: '',
                        imagen: [],
                        ubicacion: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty, setFieldValue }) => {
                        // Definición de las funciones aquí
                        
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
                                setImagenes([{ localUri: pickerResultado.uri }]);
                                setFieldValue('imagen', [{ localUri: pickerResultado.uri }]);
                            }
                        };

                        const obtenerUbicacion = async () => {
                            let { status } = await Location.requestForegroundPermissionsAsync();
                            if (status !== 'granted') {
                                alert('Permiso de acceso a la ubicación fue denegado');
                                return;
                            }

                            try {
                                let location = await Location.getCurrentPositionAsync({});
                                const newLocation = {
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                };
                                setSelectedLocation(newLocation);
                                setFieldValue('ubicacion', newLocation);
                            } catch (error) {
                                alert('No se pudo obtener la ubicación. Intente de nuevo.');
                            }
                        };

                        return (
                            <>
                                <Text style={styles.mainTitle}>Información del Centro de Ayuda</Text>

                                <Text style={styles.inputLabel}>Título</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('titulo')}
                                    onBlur={handleBlur('titulo')}
                                    value={values.titulo}
                                    placeholder="Escribe un título..."
                                />
                                {touched.titulo && errors.titulo && <Text style={styles.errorText}>{errors.titulo}</Text>}

                                <Text style={styles.inputLabel}>Descripción</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('descripcion')}
                                    onBlur={handleBlur('descripcion')}
                                    value={values.descripcion}
                                    placeholder="Escribe una descripción..."
                                    multiline
                                />
                                {touched.descripcion && errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}

                                <Text style={styles.sectionTitle}>Imagen</Text>
                                {imagenes.length > 0 && (
                                    <Image source={{ uri: imagenes[0].localUri }} style={styles.imagenPrevisualizacion} />
                                )}
                                <TouchableOpacity
                                    style={styles.imageButton}
                                    onPress={() => handleImagePicker(setFieldValue)}
                                >
                                    <Ionicons name="image" size={24} color="white" />
                                    <Text style={styles.buttonTextImage}>Seleccionar Imagen</Text>
                                </TouchableOpacity>

                                <Text style={styles.sectionTitle}>Ubicación</Text>
                                {isMapVisible && (
                                    <MapView
                                        style={styles.map}
                                        initialRegion={selectedLocation || defaultRegion}
                                        onPress={e => {
                                            const location = e.nativeEvent.coordinate;
                                            setSelectedLocation(location);
                                            setFieldValue('ubicacion', location);
                                        }}
                                    >
                                        {selectedLocation && (
                                            <Marker
                                                title="Ubicación Seleccionada"
                                                coordinate={selectedLocation}
                                            />
                                        )}
                                    </MapView>
                                )}
                                <TouchableOpacity
                                    style={styles.buttonAddHide}
                                    onPress={() => setIsMapVisible(!isMapVisible)}
                                >
                                    <Ionicons name={isMapVisible ? "remove-circle" : "add-circle"} size={24} color="white" />
                                    <Text style={styles.buttonTextMap}>{isMapVisible ? "Ocultar Mapa" : "Mostrar Mapa"}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.publishButton, !(isValid && dirty) && styles.disabledButton]}
                                    onPress={handleSubmit}
                                    disabled={!(isValid && dirty)}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.publishButtonText}>Crear Centro</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        );
                    }}
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
    contentContainer: {
        padding: 20,
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
    input: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#D3D3D3',
        backgroundColor: '#FFFFFF',
        marginVertical: 10,
        borderRadius: 10,
    },
    inputLabel: {
        fontSize: 16,
        marginTop: 8,
    },
    errorText: {
        fontSize: 10,
        color: 'red',
        paddingHorizontal: 15,
    },
    imagenPrevisualizacion: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    imagenWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    removeButton: {
        marginLeft: 10,
    },
    imageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F348A4', 
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
        marginHorizontal: 20,
    },
    buttonIconImage: {
        marginRight: 8,
        color: 'white',
    },
    buttonTextImage: {
        color: 'white',
        fontSize: 16,
    },
    buttonAddHide: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F348A4', 
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
        marginHorizontal: 20,
    },
    buttonIconMap: {
        marginRight: 8,
        color: 'white',
    },
    buttonTextMap: {
        color: 'white',
        fontSize: 16,
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
    disabledButton: {
        backgroundColor: 'grey',
    },
    map: {
        width: '100%',
        height: 200,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#F8F8F8',
        marginVertical: 10,
    },
});

export default CreateHelpCenterScreen;