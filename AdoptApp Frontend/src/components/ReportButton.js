import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, Text, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importa los iconos de Ionicons desde tu fuente

const ReportButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleReport = () => {
    // Aquí puedes agregar la lógica para reportar el contenido
    // Puedes llamar a una función de reporte o enviar una solicitud al servidor, etc.
    toggleModal(); // Cierra el cuadro emergente después de reportar
  };

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <Ionicons
          name="flag-outline" // Cambia 'flag-outline' por el nombre del icono de Ionicons que deseas utilizar para reportar
          size={30}
          color="black" // Cambia 'black' al color que desees para el botón de "reportar"
        />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¿Estás seguro de que deseas reportar este contenido?</Text>
            <Button title="Reportar" onPress={handleReport} />
            <Button title="Cancelar" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ReportButton;
