import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthProvider';
import { useUsers } from '../contexts/UserProvider';
import config from '../../config';


const apiUrl = config.API_URL;
// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Escribe tu nombre')
      .max(30, 'El nombre no puede exceder los 30 caracteres'),
    last_name: Yup.string()
      .required('Escribe tu apellido')
      .max(30, 'El apellido no puede exceder los 30 caracteres'),
    contact_email: Yup.string()
      .email('Correo electrónico inválido')
      .required('Escribe tu correo'),
    phone_number: Yup.string()
      .matches(/^[0-9]{9}$/, 'El número de teléfono debe tener exactamente 9 dígitos')
      .required('Escribe tu número de contacto'),
    rut: Yup.string(), // Asumiendo que tienes una función para validar el RUT
    instagram: Yup.string(),
    facebook: Yup.string(),
    region: Yup.string(),
    city: Yup.string()
});

const EditProfileScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [initialProfileData, setInitialProfileData] = useState({
      // Valores iniciales vacíos
      name: '',
      last_name: '',
      contact_email: '',
      phone_number: '',
      rut: '',
      instagram: '',
      facebook: '',
      region: '',
      city: '',
    });
    const [ profileImage, setProfileImage ] = useState(null);
    const [ bannerImage, setBannerImage ] = useState(null);
    const { getUserId } = useAuth();
    const { findOne, update, updateImages } = useUsers();
  
    useEffect(() => {
        const loadUserProfile = async () => {
          const userId = getUserId();
          try {
            const userData = await findOne(userId);
            setInitialProfileData(userData);
            if (userData.profile_img) {
              setProfileImage({ uri: `${apiUrl}/api/${userData.profile_img}` });
            }
            if (userData.banner_multimedia) {
              setBannerImage({ uri: `${apiUrl}/api/${userData.banner_multimedia}` });
            }
          } catch (error) {
            console.error("Error al cargar el perfil del usuario:", error);
          }
        };
    
        loadUserProfile();
      }, [getUserId, findOne]);

      const handleImageChange = async (type, setFieldValue) => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!pickerResult.cancelled) {
          const newImageUri = pickerResult.uri;
          if (type === 'profile') {
            setFieldValue('profile_img', newImageUri);
            setProfileImage({ uri: newImageUri }); // Actualizado para manejar objeto con propiedad 'uri'
            console.log("Profile Image URI:", profileImage);
        } else {
            setFieldValue('banner_multimedia', newImageUri);
            setBannerImage({ uri: newImageUri }); // Actualizado para manejar objeto con propiedad 'uri'
            console.log("Banner Image URI:", bannerImage);
          }
        }
      };

  const handleSave = async (values) => {
    setIsLoading(true);
    const updatedFields = getUpdatedFields(values, initialProfileData);
    const imageFormData = new FormData();
    // Agrega las imágenes si han cambiado
    if (values.profile_img !== initialProfileData.profile_img) {
      imageFormData.append('profile_img', {
        uri: values.profile_img,
        name: `profile_${getUserId()}.jpg`, // Nombre único para la imagen de perfil: `profile_${userId}.jpg
        type: 'image/jpg',
      });
    }
    if (values.banner_multimedia !== initialProfileData.banner_multimedia) {
      imageFormData.append('banner_multimedia', {
        uri: values.banner_multimedia,
        name: `banner_${getUserId()}.jpg`, // Nombre único para el banner: `banner_${userId}.jpg
        type: 'image/jpg',
      });
    }
    try {
      const result = await update(getUserId(), JSON.parse(JSON.stringify(updatedFields)));
      setInitialProfileData({ ...initialProfileData, ...updatedFields });
      if (imageFormData._parts.length > 0) {
        const imageResult = await updateImages(getUserId(), imageFormData);
        const updatedImages = {};
        if (imageResult.profile_img) {
          updatedImages.profile_img = imageResult.profile_img;
        }
        if (imageResult.banner_multimedia) {
          updatedImages.banner_multimedia = imageResult.banner_multimedia;
        }
      }
      console.log("Perfil actualizado:", result);
      setIsLoading(false);
      Alert.alert('Perfil Actualizado', 'Tu perfil ha sido actualizado con éxito.');
    } catch (error) {
      console.log("Error al actualizar el perfil:", error);
      Alert.alert('Error', error.message || 'Ocurrió un error al actualizar tu perfil.');
      setIsLoading(false);
    }
  };
  
  const getUpdatedFields = (currentValues, initialValues) => {
    const updatedFields = {};
    Object.keys(currentValues).forEach(key => {
      if (currentValues[key] !== initialValues[key] && key !== 'roles') {
        updatedFields[key] = currentValues[key];
      }
    });
    return updatedFields;
  };

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={initialProfileData}
        validationSchema={validationSchema}
        onSubmit={handleSave}
        enableReinitialize // Asegúrate de habilitar la reinicialización
      >
        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }) => (
          <>
            <TouchableOpacity onPress={() => handleImageChange('banner', setFieldValue)} style={styles.bannerContainer}>
              {/* Muestra la imagen del banner */}
              {bannerImage && <Image source={bannerImage} style={styles.bannerImage} />}
              <Ionicons name="camera" size={30} color="white" style={styles.cameraIcon} />
            </TouchableOpacity> 

            <View style={styles.profileImageContainer}>
              <TouchableOpacity onPress={() => handleImageChange('profile', setFieldValue)}>
                {/* Muestra la imagen de perfil */}
                {profileImage && <Image source={profileImage} style={styles.profileImage} />}
                <Ionicons name="camera" size={30} color="white" style={styles.cameraIcon} />
              </TouchableOpacity>
            </View>

            {/* Campos del formulario */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder="Nombre"
              />
              {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Campo para el apellido */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('last_name')}
                onBlur={handleBlur('last_name')}
                value={values.last_name}
                placeholder="Apellido"
              />
              {touched.last_name && errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
            </View>

            {/* Campo para el correo electrónico */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('contact_email')}
                onBlur={handleBlur('contact_email')}
                value={values.contact_email}
                placeholder="Correo Electrónico"
              />
              {touched.contact_email && errors.contact_email && <Text style={styles.errorText}>{errors.contact_email}</Text>}
            </View>

            {/* Campo para el número de teléfono */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Número de Teléfono</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('phone_number')}
                onBlur={handleBlur('phone_number')}
                value={values.phone_number}
                placeholder="Número de Teléfono"
              />
              {touched.phone_number && errors.phone_number && <Text style={styles.errorText}>{errors.phone_number}</Text>}
            </View>

            {/* Campo para el RUT */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>RUT</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('rut')}
                onBlur={handleBlur('rut')}
                value={values.rut}
                placeholder="RUT"
              />
              {touched.rut && errors.rut && <Text style={styles.errorText}>{errors.rut}</Text>}
            </View>

            {/* Campos adicionales como Instagram, Facebook, Región y Ciudad */}
            {/* ... */}

            {/* Botón de guardar cambios */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    position: 'relative',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  profileImageContainer: {
    position: 'absolute',
    top: 150,
    left: '50%',
    marginLeft: -50,
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  inputContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
  },
  button: {
    backgroundColor: '#F348A4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
