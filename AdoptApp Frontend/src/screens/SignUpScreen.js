import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';

// Esquema de validación de Yup
const SignupSchema = Yup.object().shape({
  nickname: Yup.string().required('Requerido'),
  name: Yup.string().required('Requerido'),
  last_name: Yup.string().required('Requerido'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Requerido'),
  phone_number: Yup.string().matches(/^[0-9]{9}$/, 'El número de teléfono debe tener exactamente 9 dígitos').required('Requerido'),
  contact_email: Yup.string().email('Correo electrónico inválido').required('Requerido'),
  rut: Yup.string(),
  banner_multimedia: '',
  profile_img: '',
  instagram: '',
  facebook: '',
});


const SignUpScreen = () => {
  const [isPasswordShown, setIsPasswordShown] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

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
    console.log(JSON.stringify(values));
    const formattedValues = {
      ...values,
      phone_number: values.phone_number ? parseInt(values.phone_number, 10) : null,
    };
    setIsLoading(true); // Activa el loader
    try {
      await fetch("http://10.0.2.2:3000/api/users/register", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      }).then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false); // Desactiva el loader
  };

  return (
    <ScrollView style={styles.safeArea}>
      <View style={styles.scrollViewContent}>
        <Text style={styles.titleText}>Crear Cuenta</Text>

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
          }}
          validationSchema={SignupSchema}
          onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
                  value={values.rut}
                  style={getBorderStyle(errors, touched, 'rut')}
                />
                {touched.rut && errors.rut && <Text style={styles.errorText}>{errors.rut}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Correo personal</Text>
                <TextInput
                  placeholder='Escribe tu email'
                  placeholderTextColor={getPlaceholderColor(errors, touched, 'contact_email')}
                  keyboardType='email-address'
                  onChangeText={handleChange('contact_email')}
                  onBlur={handleBlur('contact_email')}
                  value={values.contact_email}
                  style={getBorderStyle(errors, touched, 'email')}
                />
                {touched.contact_email && errors.contact_email && <Text style={styles.errorText}>{errors.contact_email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Número de teléfono</Text>
                <TextInput
                  placeholder='Escribe tu número de teléfono'
                  placeholderTextColor={getPlaceholderColor(errors, touched, 'phone_number')}
                  keyboardType='numeric'
                  onChangeText={handleChange('phone_number')}
                  onBlur={handleBlur('phone_number')}
                  value={values.phone_number}
                  style={getBorderStyle(errors, touched, 'phone_number')}
                />
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
              </View>

              <TouchableOpacity
                style={[styles.button, { marginTop: 20 }]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Enviar Formulario</Text>
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
  scrollViewContent: {
    paddingHorizontal: 22,
  },
  titleText: {
    marginVertical: 22,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
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
    marginVertical: 10,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default SignUpScreen;
