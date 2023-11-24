import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useUsers } from '../contexts/UserProvider';

const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Por favor ingresa un email válido')
    .required('El email es obligatorio'),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { requestPasswordReset } = useUsers();

  const handleRecovery = async (values) => {
    setIsLoading(true);
    try {
      await requestPasswordReset(values.email);
      alert('Revisa tu email para continuar con la recuperación de tu contraseña');
      navigation.goBack();
    } catch (error) {
      console.log('Error en la petición:', error);
      // Manejo de errores
    }
    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.safeArea} contentContainerStyle={styles.scrollViewContainer}>
      <StatusBar barStyle="light-content" backgroundColor="black"/>
      <View style={styles.scrollViewContent}>
        <Text style={styles.titleText}>Recuperación de Contraseña</Text>
        
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handleRecovery}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="grey" style={styles.icon} />
                <TextInput
                  placeholder='Ingresa tu email'
                  placeholderTextColor={'#a9a9a9'}
                  keyboardType='email-address'
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  style={styles.textInput}
                />
              </View>
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Enviar</Text>
                )}
              </TouchableOpacity>
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
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center', // Centra el texto de error
    marginTop: 10,
  },
});

export default ForgotPasswordScreen;
