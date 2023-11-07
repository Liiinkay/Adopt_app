import React from "react";
import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const SignUpScreen = () => {
  const handleFormSubmit = () => {
    alert(JSON.stringify(userData));
  };

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userData, setUserData] = useState({
    nickname: '',
    name: '',
    last_name: '',
    password: '',
    phone_number: '',
    contact_email: '',
    rut: '',
  });

  const handleInputChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  return(
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.titleText}>Crear Cuenta</Text>

        {/* Repeat this InputComponent for each input field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre de usuario</Text>
          <TextInput
            placeholder='Escribe tu nombre de usuario'
            placeholderTextColor={'#a9a9a9'}
            keyboardType='default'
            onChangeText={(value) => handleInputChange('nickname', value)}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre</Text>
          <TextInput
            placeholder='Escribe tu nombre'
            placeholderTextColor={'#a9a9a9'}
            keyboardType='default'
            onChangeText={(value) => handleInputChange('name', value)}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Apellido</Text>
          <TextInput
            placeholder='Escribe tu apellido'
            placeholderTextColor={'#a9a9a9'}
            keyboardType='default'
            onChangeText={(value) => handleInputChange('last_name', value)}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Rut</Text>
          <TextInput
            placeholder='Escribe tu rut'
            placeholderTextColor={'#a9a9a9'}
            keyboardType='default'
            onChangeText={(value) => handleInputChange('rut', value)}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Correo personal</Text>
          <TextInput
            placeholder='Escribe tu correo electrónico'
            placeholderTextColor={'#a9a9a9'}
            keyboardType='email-address'
            onChangeText={(value) => handleInputChange('contact_email', value)}
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Número de celular</Text>
            <View style={styles.phoneInputContainer}>
            <TextInput
                placeholder='+56'
                placeholderTextColor={'#a9a9a9'}
                keyboardType='numeric'
                style={styles.countryCodeInput}
            />
            <TextInput
                placeholder='Ingresa tu número de teléfono'
                placeholderTextColor={'#a9a9a9'}
                keyboardType='numeric'
                onChangeText={(value) => handleInputChange('phone_number', value)}
                style={styles.phoneNumberInput}
            />
            </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              placeholder='Ingresa una contraseña'
              placeholderTextColor={'#a9a9a9'}
              secureTextEntry={!isPasswordShown}
              onChangeText={(value) => handleInputChange('password', value)}
              style={styles.textInput}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.eyeIcon}
            >
              <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>

        <Button color={'#F348A4'} title="Enviar Formulario" onPress={handleFormSubmit} />

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or Sign up with</Text>
          <View style={styles.divider} />
        </View>

      </ScrollView>
    </SafeAreaView>   
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
  phoneInputContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  countryCodeInput: {
    width: "15%",
    height: 48,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 5,
    paddingHorizontal: 10,
  },
  phoneNumberInput: {
    flex: 1,
    height: 48,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 10,
  },
  dividerText: {
    fontSize: 14,
    color: '#666',
  },
  // ...other styles...
});

export default SignUpScreen;