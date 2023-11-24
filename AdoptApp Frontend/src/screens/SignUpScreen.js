import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthProvider';

import config from '../../config';

const apiUrl = config.API_URL;

// Esquema de validación de Yup
const SignupSchema = Yup.object().shape({
  nickname: Yup.string()
    .required('Escribe tu nombre de usuario')
    .max(25, 'El nombre de usuario no puede exceder los 25 caracteres'),
  name: Yup.string()
    .required('Escribe tu nombre')
    .max(30, 'El nombre no puede exceder los 30 caracteres'),
  last_name: Yup.string()
    .required('Escribe tu apellid')
    .max(30, 'El apellido no puede exceder los 30 caracteres'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(20, 'La contraseña no puede exceder los 20 caracteres')
    .required('Escribe una contraseña'),
  phone_number: Yup.string()
    .matches(/^[0-9]{9}$/, 'El número de teléfono debe tener exactamente 9 dígitos')
    .required('Escribe tu número de contacto'),
  contact_email: Yup.string()
    .email('Correo electrónico inválido')
    .required('Escribe tu correo'),
  rut: Yup.string()
    .test(
      'valid-rut',
      'El RUT debe de estar escrito con o sin puntos y con guión',
      (value) => !value || validateRut(value) // Valida solo si hay un valor
  ),
  banner_multimedia: '',
  profile_img: '',
  instagram: '',
  facebook: '',
  region: '',
  city: ''
});

const validateRut = (rut) => {
  // Eliminar puntos y guion
  let valor = rut.replace(/\./g, '').replace('-', '');

  // Extraer dígito verificador e invertir orden de los números
  let cuerpo = valor.slice(0, -1).split('').reverse();
  let dv = valor.slice(-1).toUpperCase();

  // Calcular suma según el algoritmo del módulo 11
  let suma = 0;
  let multiplo = 2;
  for (let i = 0; i < cuerpo.length; i++) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  // Calcular dígito verificador
  let dvEsperado = 11 - (suma % 11);
  dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  // Comparar el DV esperado con el ingresado
  return dv === dvEsperado;
};


const SignUpScreen = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { logIn } = useAuth();
  const [error, setError] = React.useState(null);

  // Función para determinar el estilo del borde en función del estado de error
  const getBorderStyle = (errors, touched, fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return styles.inputError;
    } else {
      return styles.textInput;
    }
  };

  const getPlaceholderColor = (errors, touched, fieldName) => {
    return (touched[fieldName] && errors[fieldName]) ? 'red' : '#a9a9a9';
  };

  const handleFormSubmit = async (values) => {
    const url = apiUrl + '/api/users/register'

    const formData = new FormData();

    formData.append('nickname', values.nickname);
    formData.append('name', values.name);
    formData.append('last_name', values.last_name);
    formData.append('password', values.password);
    formData.append('contact_email', values.contact_email);
    formData.append('rut', values.rut);
    formData.append('banner_multimedia', values.banner_multimedia);
    formData.append('profile_img', values.profile_img);
    formData.append('facebook', values.facebook);
    formData.append('instagram', values.instagram);
    formData.append('region', values.region);
    formData.append('city', values.city);

    setIsLoading(true); // Activa el loader
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })
      
      const json = await response.json();
  
      if (response.ok) {
        // Inicio de sesión exitoso
        logIn(json.token, json.id);
      } else {
        // Manejo de errores, como credenciales incorrectas
        console.error('Error de creación de cuenta:', json.message);
        const message = json.message || 'Ocurrió un error al crear la cuenta';
        if (message.includes('nickname') && message.includes('already exists')) {
          setError('El nombre de usuario ya está en uso');
          Alert.alert('Error', 'El nombre de usuario ya está en uso');
        }
        if (message.includes('contact_email') && message.includes('already exists')) {
          setError('El correo ya está en uso');
          Alert.alert('Error', 'El correo ya está en uso');
        }
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      const message = error.message || 'Ocurrió un error al crear la cuenta';
      Alert.alert('Error', message);
      setError(message);
    }
    setIsLoading(false); // Desactiva el loader
  };

  return (
    <ScrollView style={styles.safeArea}>
      <View style={styles.scrollViewContent}>
        <Text style={styles.titleText}>Ingresa tus datos</Text>

        <Formik
          initialValues={{
            nickname: '',
            name: '',
            last_name: '',
            password: '',
            phone_number: '',
            contact_email: '',
            rut: '',
            banner_multimedia: '',
            profile_img: '',
            instagram: '',
            facebook: '',
            region: '',
            city: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
            <>
              {/* Campos del formulario */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nombre de usuario</Text>
                <TextInput
                  placeholder='Escribe tu nombre de usuario'
                  placeholderTextColor={getPlaceholderColor(errors, touched, 'nickname')}
                  keyboardType='default'
                  onChangeText={handleChange('nickname')}
                  onBlur={handleBlur('nickname')}
                  maxLength={25}
                  value={values.nickname}
                  style={getBorderStyle(errors, touched, 'nickname')}
                />
                {touched.nickname && errors.nickname && <Text style={styles.errorText}>{errors.nickname}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nombre</Text>
                <TextInput
                  placeholder='Escribe tu nombre'
                  placeholderTextColor={getPlaceholderColor(errors, touched, 'name')}
                  keyboardType='default'
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  maxLength={30}
                  value={values.name}
                  style={getBorderStyle(errors, touched, 'name')}
                />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Apellido</Text>
                <TextInput
                  placeholder='Escribe tu apellido'
                  placeholderTextColor={getPlaceholderColor(errors, touched, 'last_name')}
                  keyboardType='default'
                  onChangeText={handleChange('last_name')}
                  onBlur={handleBlur('last_name')}
                  maxLength={30}
                  value={values.last_name}
                  style={getBorderStyle(errors, touched, 'last_name')}
                />
                {touched.last_name && errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Rut (opcional)</Text>
                <TextInput
                  placeholder='Escribe tu rut'
                  placeholderTextColor={getPlaceholderColor(errors, touched, 'rut')}
                  keyboardType='default'
                  onChangeText={handleChange('rut')}
                  onBlur={handleBlur('rut')}
                  maxLength={25}
                  value={values.rut}
                  style={getBorderStyle(errors, touched, 'rut')}
                />
                {touched.rut && errors.rut && <Text style={styles.errorText}>{errors.rut}</Text>}
              </View>

              <Text style={styles.sectionTitle}>Información de Contacto</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Correo personal</Text>
                <TextInput
                  placeholder='Escribe tu email'
                  placeholderTextColor={getPlaceholderColor(errors, touched, 'contact_email')}
                  keyboardType='email-address'
                  onChangeText={handleChange('contact_email')}
                  onBlur={handleBlur('contact_email')}
                  maxLength={40}
                  value={values.contact_email}
                  style={touched.contact_email && errors.contact_email ? styles.inputError : styles.textInput}
                />
                {touched.contact_email && errors.contact_email && <Text style={styles.errorText}>{errors.contact_email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Número de teléfono</Text>
                <View style={touched.phone_number && errors.phone_number ? styles.phoneFieldErrorContainer : styles.phoneFieldContainer}>
                  <View style={styles.flagContainer}>
                    <Image
                      source={require('../../assets/images/chile-flag.png')}
                      style={styles.flagIcon}
                      resizeMode="contain" 
                    />
                    <Text style={styles.phonePrefix}>+56</Text>
                  </View>
                  <TextInput
                    placeholder="Ingresa tu número de telefono"
                    placeholderTextColor={getPlaceholderColor(errors, touched, 'phone_number')}
                    keyboardType="numeric"
                    maxLength={9}
                    onChangeText={handleChange('phone_number')}
                    onBlur={handleBlur('phone_number')}
                    value={values.phone_number}
                    style={styles.phoneInput}
                  />
                </View>
                {touched.phone_number && errors.phone_number && <Text style={styles.errorText}>{errors.phone_number}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contraseña</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    placeholder='Ingresa una contraseña'
                    placeholderTextColor={getPlaceholderColor(errors, touched, 'password')}
                    secureTextEntry={!isPasswordShown}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    maxLength={20}
                    value={values.password}
                    style={getBorderStyle(errors, touched, 'password')}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordShown(!isPasswordShown)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <View style={styles.errorContainer}>
                  {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
                <TouchableOpacity
                  style={[styles.button, !(isValid && dirty) && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={!(isValid && dirty)}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Enviar Formulario</Text>
                  )}
                </TouchableOpacity>
              </View>

            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    paddingHorizontal: 22,
  },
  titleText: {
    marginVertical: 22,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  phoneFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#a9a9a9',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden', 
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#a9a9a9',
    borderTopLeftRadius: 8, 
    borderBottomLeftRadius: 8,
  },
  flagIcon: {
    width: 24,
    height: 24,
  },
  phonePrefix: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    height: 48,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    marginBottom: 5,
  },
  textInput: {
    height: 48,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputError: {
    height: 48,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  phoneFieldErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
  button: {
    backgroundColor: '#F348A4',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10, 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  errorContainer: {
    marginTop: 10,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignUpScreen;
