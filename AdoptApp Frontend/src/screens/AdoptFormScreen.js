import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AdoptionForm = ({navigation}) => {

  const [formData, setFormData] = useState({
    reason: '',
    otherAnimals: '',
    otherAnimalsSpayed: '',
    previousAnimals: '',
    previousAnimalsDescription: '',
    numPeopleInHouse: '',
    peopleAgreeToAdopt: '',
    hasChildren: '',
    rentalPermission: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = () => {
    // Verificar que todas las preguntas hayan sido respondidas
    for (const key in formData) {
      if (!formData[key]) {
        alert('Por favor, responda todas las preguntas antes de enviar el formulario.');
        return;
      }
    }

    // Mostrar una alerta de confirmación antes de redireccionar
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que quieres volver? Perderás el progreso hecho en este formulario.',
      [
        {
          text: 'Sí',
          onPress: () => {
            // Cambiar el estado para mostrar el mensaje de agradecimiento y redireccionar
            setFormSubmitted(true);
            // Redirigir a la página principal
            navigation.goBack();
          },
        },
        { text: 'No', onPress: () => {} },
      ]
    );
  };

  // Agregar un efecto para controlar la alerta de confirmación
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!formSubmitted) {
        e.preventDefault();
        Alert.alert(
          'Confirmación',
          '¿Estás seguro de que quieres volver? Perderás el progreso hecho en este formulario.',
          [
            {
              text: 'Si',
              onPress: () => {
                // Redirigir a la página principal
                navigation.dispatch(e.data.action);
              },
            },
            { text: 'No', onPress: () => {} },
          ]
        );
      }
    });

    return unsubscribe;
  }, [navigation, formSubmitted]);

  const renderForm = () => (
    <SafeAreaView style={{flex:1}}>
      <StatusBar/>
      <ScrollView>
        <View style={styles.header}>
          <Button
            title="← Volver"
            onPress={() => {
              // Mostrar la alerta de confirmación
              Alert.alert(
                'Confirmación',
                '¿Estás seguro de que quieres volver? Perderás el progreso hecho en este formulario.',
                [
                  {
                    text: 'Sí',
                    onPress: () => {
                      // Redirigir a la página principal
                      navigation.goBack();
                    },
                  },
                  { text: 'No', onPress: () => {} },
                ]
              );
            }}
          />
        </View>
        <View style={styles.container}>

          <Text style={styles.question}>1. ¿Por qué desea adoptar una mascota?</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, reason: text })}
            value={formData.reason}
            placeholder="Respuesta..."
            multiline
          />

          <Text style={styles.question}>2. ¿Actualmente cuenta con otros animales?</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, otherAnimals: text })}
            value={formData.otherAnimals}
            placeholder="Respuesta..."
          />

          <Text style={styles.question}>3. ¿Estos se encuentran esterilizados?</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, otherAnimalsSpayed: text })}
            value={formData.otherAnimalsSpayed}
            placeholder="Respuesta..."
          />

          <Text style={styles.question}>4. ¿Anteriormente ha tenido otros animales?</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, previousAnimals: text })}
            value={formData.previousAnimals}
            placeholder="Respuesta..."
          />

          <Text style={styles.question}>5. ¿Qué fue lo que pasó con ellos?</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, previousAnimalsDescription: text })}
            value={formData.previousAnimalsDescription}
            placeholder="Respuesta..."
            multiline
          />

          <Text style={styles.question}>6. ¿Cuántas personas viven en su casa?</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, numPeopleInHouse: text })}
            value={formData.numPeopleInHouse}
            keyboardType="numeric"
            placeholder="Respuesta..."
          />

          <Text style={styles.question}>7. ¿Estos se encuentran de acuerdo en adoptar?</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, peopleAgreeToAdopt: text })}
            value={formData.peopleAgreeToAdopt}
            placeholder="Respuesta..."
          />

          <Text style={styles.question}>8. ¿Hay niños en casa?</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, hasChildren: text })}
            value={formData.hasChildren}
            placeholder="Respuesta..."
          />

          <Text style={styles.question}>
            9. En caso de que viva en alquiler, ¿se le permite tener mascotas?
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFormData({ ...formData, rentalPermission: text })}
            value={formData.rentalPermission}
            placeholder="Respuesta..."
          />
          <View style={{margin: 20}}>
            <Button color={'#F348A4'} title="Enviar Formulario" onPress={handleFormSubmit} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderThankYouMessage = () => (
    <View style={styles.thankYouContainer}>
      <Text style={styles.thankYouText}>¡Gracias por enviar el formulario!</Text>
      <Button
        title="Volver a la página principal"
        onPress={() => navigation.navigate('HomeScreen')}
      />
    </View>
  );

  return (
<View style={styles.container}>
      {formSubmitted ? renderThankYouMessage() : renderForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  question: {
    fontSize: 18,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  thankYouContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 24,
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: '#F348A4',
    marginBottom: 16
  }
});

export default AdoptionForm;