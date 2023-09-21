import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Datos de prueba
const datosPreguntasRespuestas = [
    {
      pregunta: '¿Por cuantos dueños ha pasado el perrito??',
      respuesta: 'De momento solo 1 persona.'
    },
    {
      pregunta: '¿Que edad tiene? No se logra apreciar bien en la información adicional',
      respuesta: 'Lo siento, se me olvido agregarlo. De momento tiene 2 años.'
    },
    {
      pregunta: '¿Por cuantos dueños ha pasado el perrito??',
      respuesta: 'De momento solo 1 persona.'
    },
    {
      pregunta: '¿Que edad tiene? No se logra apreciar bien en la información adicional',
      respuesta: 'Lo siento, se me olvido agregarlo. De momento tiene 2 años.'
    },
    {
      pregunta: '¿Por cuantos dueños ha pasado el perrito??',
      respuesta: 'De momento solo 1 persona.'
    },
    {
      pregunta: '¿Que edad tiene? No se logra apreciar bien en la información adicional',
      respuesta: 'Lo siento, se me olvido agregarlo. De momento tiene 2 años.'
    },
    {
      pregunta: '¿Por cuantos dueños ha pasado el perrito??',
      respuesta: 'De momento solo 1 persona.'
    },
    {
      pregunta: '¿Que edad tiene? No se logra apreciar bien en la información adicional',
      respuesta: 'Lo siento, se me olvido agregarlo. De momento tiene 2 años.'
    },
    // Agrega más preguntas y respuestas de prueba aquí
  ];
  
  const PreguntasRespuestasComponent = () => {
    const itemsPorPagina = 5;
    const [paginaActual, setPaginaActual] = useState(1);
  
    // Función para calcular el índice de inicio de las preguntas en la página actual
    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    // Obtener las preguntas y respuestas para la página actual
    const preguntasRespuestasPagina = datosPreguntasRespuestas.slice(
      indiceInicio,
      indiceInicio + itemsPorPagina
    );
  
    // Función para avanzar a la siguiente página
    const avanzarPagina = () => {
      if (indiceInicio + itemsPorPagina < datosPreguntasRespuestas.length) {
        setPaginaActual(paginaActual + 1);
      }
    };
  
    // Función para retroceder a la página anterior
    const retrocederPagina = () => {
      if (paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
      }
    };
  
    // Función para cambiar a una página específica
    const cambiarPagina = (numeroPagina) => {
      setPaginaActual(numeroPagina);
    };
  
    // Calcular los números de página a mostrar
    const numeroPaginaInicial = Math.max(1, paginaActual - 1);
    const numeroPaginaFinal = Math.min(
      numeroPaginaInicial + 2,
      Math.ceil(datosPreguntasRespuestas.length / itemsPorPagina)
    );
  
    // Generar los números de página como botones
    const numerosPagina = [];
    for (let i = numeroPaginaInicial; i <= numeroPaginaFinal; i++) {
      numerosPagina.push(
        <TouchableOpacity
          key={i}
          onPress={() => cambiarPagina(i)}
          style={[
            styles.numeroPaginaButton,
            paginaActual === i && styles.paginaActualButton,
          ]}
        >
          <Text style={styles.numeroPaginaText}>{i}</Text>
        </TouchableOpacity>
      );
    }
  
    return (
      <View style={styles.container}>
        {preguntasRespuestasPagina.map((item, index) => (
          <View key={index} style={styles.preguntaRespuestaContainer}>
            <Text style={styles.preguntaText}>Pregunta: {item.pregunta}</Text>
            <Text style={styles.respuestaText}>Respuesta: {item.respuesta}</Text>
          </View>
        ))}
        <View style={styles.numerosPaginaContainer}>
          <TouchableOpacity onPress={() => cambiarPagina(1)}>
            <Ionicons name="chevron-back-outline" size={30}/>
          </TouchableOpacity>
          {numerosPagina}
          <TouchableOpacity
            onPress={() =>
              cambiarPagina(Math.ceil(datosPreguntasRespuestas.length / itemsPorPagina))
            }
          >
            <Ionicons name="chevron-forward-outline" size={30}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: '#f5f5f5',
    },
    preguntaRespuestaContainer: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    preguntaText: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
    respuestaText: {},
    numerosPaginaContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    numeroPaginaButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginHorizontal: 5,
      backgroundColor: '#e0e0e0',
      borderRadius: 5,
    },
    paginaActualButton: {
      backgroundColor: '#007bff',
    },
    numeroPaginaText: {
      fontSize: 16,
      color: '#333',
    },
  });
  
  export default PreguntasRespuestasComponent;