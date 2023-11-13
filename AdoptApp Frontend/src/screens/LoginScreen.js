import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleLogin = () => {
    // Aquí iría la lógica para manejar el inicio de sesión
    console.log('Login', { username, password });
  };

  return (
    <ScrollView style={styles.safeArea}>
      <View style={styles.scrollViewContent}>
        <Text style={styles.titleText}>Iniciar Sesión</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="grey" style={styles.icon} />
          <TextInput
            placeholder='Nombre de usuario'
            placeholderTextColor={'#a9a9a9'}
            keyboardType='default'
            onChangeText={setUsername}
            value={username}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={24} color="grey" style={styles.icon} />
          <TextInput
            placeholder='Contraseña'
            placeholderTextColor={'#a9a9a9'}
            secureTextEntry={!isPasswordShown}
            onChangeText={setPassword}
            value={password}
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordShown(!isPasswordShown)}
            style={styles.eyeIcon}
          >
            <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={'black'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
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
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default LoginScreen;
