import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import config from '../../config';

const API_URL = config.API_URL;

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>AdoptApp</Text>
      </View>
      <Image
        source={require('../../assets/images/welcome-image.png')}
        style={styles.appImage}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>Bienvenido a AdoptApp</Text>
        <Text style={styles.description}>
          Únete a nuestra comunidad y descubre cómo puedes marcar la diferencia adoptando responsablemente. Encuentra tu compañero ideal y comparte el amor que merecen.
        </Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
          onLongPress={() => Alert.alert("API_URL: ", API_URL)}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonOutlineText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#F348A4',
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 40,
  },
  appImage: {
    width: width,
    height: height * 0.3, 
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F348A4',
    padding: 15,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F348A4',
  },
  buttonOutlineText: {
    color: '#F348A4',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
