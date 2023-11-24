import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthProvider';

import config from '../../config';

const apiUrl = config.API_URL;

// Esquema de validación con Yup
const loginValidationSchema = Yup.object().shape({
  nickname: Yup.string()
    .required('Escribe tu nombre de usuario'),
  password: Yup.string()
    .required('Escribe tu contraseña'),
});

const LoginScreen = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logIn } = useAuth();
  const [error, setError] = useState(null);

  const handleLogin = async (values) => {
    const url = apiUrl + '/api/users/login'
    const { nickname, password } = values;
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          nickname: nickname,
          password: password,
        }),
      });
  
      const json = await response.json();
  
      if (response.ok) {
        // Inicio de sesión exitoso
        logIn(json.token, json.id);
      } else {
        const message = json.message;
        if (message.toLowerCase().includes('credenciales no válidas')) {
          setError('Nombre de usuario o contraseña incorrectos');
        }
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      setError('Error en la petición', JSON.stringify(error));
    }
  
    setIsLoading(false); // Desactivar el indicador de carga
  };

  return (
    <ScrollView style={styles.safeArea} contentContainerStyle={styles.scrollViewContainer}>
      <StatusBar barStyle="light-content" backgroundColor="black"/>
      <View style={styles.scrollViewContent}>
        <Text style={styles.titleText}>¡Ingresa a AdoptApp!</Text>
        
        <Formik
          initialValues={{ nickname: '', password: '' }}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
            
              {/* Campo de nombre de usuario */}
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="grey" style={styles.icon} />
                <TextInput
                  placeholder='Nombre de usuario'
                  placeholderTextColor={'#a9a9a9'}
                  keyboardType='default'
                  onChangeText={handleChange('nickname')}
                  onBlur={handleBlur('nickname')}
                  value={values.nickname}
                  style={styles.textInput}
                />
              </View>
              {touched.nickname && errors.nickname && <Text style={styles.errorText}>{errors.nickname}</Text>}

              {/* Campo de contraseña */}
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={24} color="grey" style={styles.icon} />
                <TextInput
                  placeholder='Contraseña'
                  placeholderTextColor={'#a9a9a9'}
                  secureTextEntry={!isPasswordShown}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  style={styles.textInput}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                  style={styles.eyeIcon}
                >
                  <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={'black'} />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Botón de inicio de sesión */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                )}
              </TouchableOpacity>

              {/* Enlace para ir al registro */}
              <View style={styles.registerSection}>
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>
              <View style={styles.registerSection}>
                <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.registerLink}>Regístrate</Text>
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
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Centra el contenido en la pantalla
  },
  scrollViewContent: {
    paddingHorizontal: 22,
    paddingTop: 20, // Ajusta según sea necesario
  },
  titleText: {
    marginVertical: 22,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#a9a9a9',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  button: {
    backgroundColor: '#F348A4',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
    alignSelf: 'center', // Centra el botón horizontalmente
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#333',
  },
  registerLink: {
    fontSize: 16,
    color: '#F348A4',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
});

export default LoginScreen;
