import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '../contexts/PostProvider';
import { useRoute } from '@react-navigation/native';

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  reason: Yup.string().required('Este campo es obligatorio'),
  otherAnimals: Yup.boolean().required('Este campo es obligatorio'),
  otherAnimalsSpayed: Yup.boolean().required('Este campo es obligatorio'),
  previousAnimals: Yup.string().required('Este campo es obligatorio'),
  previousAnimalsDescription: Yup.string().required('Este campo es obligatorio'),
  numPeopleInHouse: Yup.number().required('Este campo es obligatorio').typeError('Debe ser un número'),
  peopleAgreeToAdopt: Yup.boolean().required('Este campo es obligatorio'),
  hasChildren: Yup.boolean().required('Este campo es obligatorio'),
  rentalPermission: Yup.boolean().required('Este campo es obligatorio'),
  name: Yup.string().required('El nombre es obligatorio'),
  city: Yup.string().required('La ciudad es obligatoria'),
  rut: Yup.string()
    .test(
    'valid-rut',
    'El RUT debe de estar escrito con o sin puntos y con guión',
    (value) => !value || validateRut(value) // Valida solo si hay un valor
  ),
  adress: Yup.string().required('La dirección es obligatoria'),
  phone: Yup.number().typeError('Debe ser un número').required('El teléfono es obligatorio'),
});

const RadioButton = ({ label, value, onSelect, selectedValue }) => {
  return (
    <TouchableOpacity
      style={styles.radioButtonContainer}
      onPress={() => onSelect(value)}>
      <View style={styles.radioButton}>
        {selectedValue === value && <View style={styles.radioButtonSelected} />}
      </View>
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const validateRut = (rut) => {
  let valor = rut.replace(/\./g, '').replace('-', '');

  let cuerpo = valor.slice(0, -1).split('').reverse();
  let dv = valor.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;
  for (let i = 0; i < cuerpo.length; i++) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  let dvEsperado = 11 - (suma % 11);
  dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvEsperado;
};


const AdoptFormScreen = ({ navigation }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const { createFormAdopt } = usePosts();
  const route = useRoute(); 
  const { post, userId } = route.params;

  const handleSubmitForm = async (values) => {
    setIsSubmitting(true);
    try {
      const data = transformData(values)
      console.log(data); 
      await createFormAdopt(post.id, userId, data);
      setSubmissionMessage('Enviado');
      setIsSubmitting(false);
      navigation.goBack()
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmissionMessage('Error al enviar. Intenta nuevamente.');
      setIsSubmitting(false);
    }
  };

  const transformData = (values) => {
    const data = {
      name: values.name,
      city: values.city,
      rut: values.rut,
      adress: values.adress,
      phone: values.phone,
      question1: values.reason,
      question2: values.otherAnimals,
      question4: values.otherAnimalsSpayed,
      question5: values.previousAnimals,
      question6: values.previousAnimalsDescription,
      question7: values.peopleAgreeToAdopt,
      question8: values.hasChildren,
      question9: values.rentalPermission,
      question10: values.numPeopleInHouse,
    }
    return data;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adoptar</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Formik
          initialValues={{
            reason: '',   //Question1
            otherAnimals: false,    //Question2
            otherAnimalsSpayed: false,  //Question4
            previousAnimals: '',      //Question5
            previousAnimalsDescription: '', //Question6
            numPeopleInHouse: '',         //Question10
            peopleAgreeToAdopt: false, //Question7
            hasChildren: false,       //Question8
            rentalPermission: false,    //Question9
            name: '',
            city: '',
            rut: '',
            adress: '',
            phone: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => { handleSubmitForm(values) }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isValid, dirty }) => (
            <>
              <Text style={styles.mainTitle}>Formulario de Adopción</Text>
              <View style={styles.questionContainer}>

                {/* Campo Nombre */}
                <Text style={styles.inputLabel}>Nombre:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholder="Nombre"
                  maxLength={50}
                />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                {/* Campo Ciudad */}
                <Text style={styles.inputLabel}>Ciudad:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('city')}
                  onBlur={handleBlur('city')}
                  value={values.city}
                  placeholder="Ciudad"
                  maxLength={30}
                />
                {touched.city && errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

                {/* Campo RUT */}
                <Text style={styles.inputLabel}>Rut:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('rut')}
                  onBlur={handleBlur('rut')}
                  value={values.rut}
                  placeholder="RUT"
                  maxLength={25}
                />
                {touched.rut && errors.rut && <Text style={styles.errorText}>{errors.rut}</Text>}

                {/* Campo Dirección */}
                <Text style={styles.inputLabel}>Dirección:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('adress')}
                  onBlur={handleBlur('adress')}
                  value={values.adress}
                  placeholder="Dirección"
                  maxLength={50}
                />
                {touched.adress && errors.adress && <Text style={styles.errorText}>{errors.adress}</Text>}

                {/* Campo Teléfono */}
                <Text style={styles.inputLabel}>Teléfono:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  placeholder="Teléfono"
                  keyboardType="numeric"
                  maxLength={9}
                />
                {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              {/* Campos del formulario */}
              <View style={styles.questionContainer}>
                  {/* 1. Razón para adoptar */}
                  <Text style={styles.inputLabel}>1- ¿Por qué desea adoptar una mascota?</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('reason')}
                    onBlur={handleBlur('reason')}
                    value={values.reason}
                    placeholder="Respuesta..."
                    multiline
                  />
                  {touched.reason && errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}
              </View>

              {/* 2. Otros animales */}
              <View style={styles.questionContainer}>
                <Text style={styles.inputLabel}>2- ¿Actualmente cuenta con otros animales?</Text>
                <RadioButton
                  label="Sí"
                  value={true}
                  selectedValue={values.otherAnimals}
                  onSelect={(value) => setFieldValue('otherAnimals', value)}
                />
                <RadioButton
                  label="No"
                  value={false}
                  selectedValue={values.otherAnimals}
                  onSelect={(value) => setFieldValue('otherAnimals', value)}
                />
                {touched.otherAnimals && errors.otherAnimals && <Text style={styles.errorText}>{errors.otherAnimals}</Text>}
              </View>

              {/* 3. Animales esterilizados */}
              <View style={styles.questionContainer}>
                <Text style={styles.inputLabel}>3- ¿Estos se encuentran esterilizados?</Text>
                <RadioButton
                  label="Sí"
                  value={true}
                  selectedValue={values.otherAnimalsSpayed}
                  onSelect={(value) => setFieldValue('otherAnimalsSpayed', value)}
                />
                <RadioButton
                  label="No"
                  value={false}
                  selectedValue={values.otherAnimalsSpayed}
                  onSelect={(value) => setFieldValue('otherAnimalsSpayed', value)}
                />
                {touched.otherAnimalsSpayed && errors.otherAnimalsSpayed && <Text style={styles.errorText}>{errors.otherAnimalsSpayed}</Text>}
              </View>

              {/* 4. Animales anteriores */}
              <View style={styles.questionContainer}>
                <Text style={styles.inputLabel}>4- ¿Anteriormente ha tenido otros animales?</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('previousAnimals')}
                  onBlur={handleBlur('previousAnimals')}
                  value={values.previousAnimals}
                  placeholder="Respuesta..."
                />
                {touched.previousAnimals && errors.previousAnimals && <Text style={styles.errorText}>{errors.previousAnimals}</Text>}
              </View>

              {/* 5. Descripción de animales anteriores */}
              <View style={styles.questionContainer}>
                <Text style={styles.inputLabel}>5- ¿Qué fue lo que pasó con ellos?</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('previousAnimalsDescription')}
                  onBlur={handleBlur('previousAnimalsDescription')}
                  value={values.previousAnimalsDescription}
                  placeholder="Respuesta..."
                  maxLength={500}
                  multiline
                />
                {touched.previousAnimalsDescription && errors.previousAnimalsDescription && <Text style={styles.errorText}>{errors.previousAnimalsDescription}</Text>}
              </View>

              {/* 6. Número de personas en casa */}
              <View style={styles.questionContainer}>
                <Text style={styles.inputLabel}>6- ¿Cuántas personas viven en su casa?</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('numPeopleInHouse')}
                  onBlur={handleBlur('numPeopleInHouse')}
                  value={values.numPeopleInHouse}
                  placeholder="Respuesta..."
                  keyboardType="numeric"
                />
                {touched.numPeopleInHouse && errors.numPeopleInHouse && <Text style={styles.errorText}>{errors.numPeopleInHouse}</Text>}
              </View>

              {/* 7. Acuerdo para adoptar */}
              <View style={styles.questionContainer}>
                <Text style={styles.inputLabel}>7- ¿Todos los miembros de la casa están de acuerdo con la adopción?</Text>
                <RadioButton
                  label="Sí"
                  value={true}
                  selectedValue={values.peopleAgreeToAdopt}
                  onSelect={(value) => setFieldValue('peopleAgreeToAdopt', value)}
                />
                <RadioButton
                  label="No"
                  value={false}
                  selectedValue={values.peopleAgreeToAdopt}
                  onSelect={(value) => setFieldValue('peopleAgreeToAdopt', value)}
                />
              </View>
              {touched.peopleAgreeToAdopt && errors.peopleAgreeToAdopt && <Text style={styles.errorText}>{errors.peopleAgreeToAdopt}</Text>}

              {/* 8. Niños en casa */}
              <View style={styles.questionContainer}>
                <Text style={styles.inputLabel}>8- ¿Hay niños en casa?</Text>
                <RadioButton
                  label="Sí"
                  value={true}
                  selectedValue={values.hasChildren}
                  onSelect={(value) => setFieldValue('hasChildren', value)}
                />
                <RadioButton
                  label="No"
                  value={false}
                  selectedValue={values.hasChildren}
                  onSelect={(value) => setFieldValue('hasChildren', value)}
                />
              </View>
              {touched.hasChildren && errors.hasChildren && <Text style={styles.errorText}>{errors.hasChildren}</Text>}

              {/* 9. Permiso de alquiler */}
              <View style={styles.questionContainer}>
                <Text style={styles.inputLabel}>9- En caso de alquiler, ¿tiene permiso para tener mascotas?</Text>
                <RadioButton
                  label="Sí"
                  value={true}
                  selectedValue={values.rentalPermission}
                  onSelect={(value) => setFieldValue('rentalPermission', value)}
                />
                <RadioButton
                  label="No"
                  value={false}
                  selectedValue={values.rentalPermission}
                  onSelect={(value) => setFieldValue('rentalPermission', value)}
                />
              </View>
              {touched.rentalPermission && errors.rentalPermission && <Text style={styles.errorText}>{errors.rentalPermission}</Text>}

              {/* Botón de envío */}
              {submissionMessage !== '' && (
                <Text style={styles.submissionMessage}>{submissionMessage}</Text>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting || !(isValid && dirty) ? styles.submitButtonDisabled : {},
                  submissionMessage === 'Enviado' ? styles.submitButtonSuccess : {},
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting || !(isValid && dirty)}
              >
                {submissionMessage === 'Enviado' ? (
                  <View style={styles.buttonContainer}>
                    <Text style={styles.submitButtonText}>Enviado</Text>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  </View>
                ) : isSubmitting ? (
                  <ActivityIndicator size={20} color="#fff" />
                ) : (
                  <View style={styles.buttonContainer}>
                    <Text style={styles.submitButtonText}>Enviar Formulario</Text>
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}
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
    backgroundColor: '#F348A4',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    width: 24, 
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
    overflow: 'hidden', 
  },
  inputLabel: {
    fontSize: 14,
    marginTop: 8,
    padding: 3,
  },
  input: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
    paddingHorizontal: 15,
  },
  questionContainer: {
    marginBottom: 20, // Ajusta el margen como sea necesario
    padding: 10,
    backgroundColor: '#FFFFFF', // o cualquier otro color que coincida con tu diseño
    borderRadius: 10, // opcional: para bordes redondeados
    borderWidth: 1,
    borderColor: '#D3D3D3', // color del borde similar al de las otras preguntas
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5, // Espaciado vertical para separar los radio buttons
  },

  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#F348A4', // Asumiendo que el rosa es el color seleccionado
  },
  radioButtonLabel: {
    fontSize: 16,
    color: 'black', // Cambia al color que corresponda
  },
  submitButton: {
    backgroundColor: '#F348A4',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center', // Centrar el texto en el botón
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15, // Ajusta el tamaño de la fuente según necesites
    fontWeight: '400',
    marginRight: 8, // Añade un margen a la derecha para separarlo del icono
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC', // Un color que indique que el botón está deshabilitado
  },
  submissionMessage: {
    textAlign: 'center',
    color: 'green', // o el color que prefieras
    fontSize: 16,
    padding: 10,
  },
  submitButtonSuccess: {
    backgroundColor: 'green', // o el color de éxito que prefieras
  },
  buttonContainer: {
    flexDirection: 'row',
  }
});

export default AdoptFormScreen;
