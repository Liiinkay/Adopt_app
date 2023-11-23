import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Button, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import posts2 from '../assets/data/posts copy';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


const Tab = createMaterialTopTabNavigator();

const ManageAdoptPost = () => {
  return(
    <View>
      <Text>AAAAAAAAAAA</Text>
    </View>
  )
}

const ManageSearchPost = () => {
    return(
      <View>
        <Text>AAAAAAAAAAA</Text>
      </View>
    )
}

const ManageInformativePost = () => {
    return(
      <View>
        <Text>AAAAAAAAAAA</Text>
      </View>
    )
}

const ManagePostTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {backgroundColor:'#F348A4'}
      }}
    >
      <Tab.Screen name="Adopción" component={ManageAdoptPost} />
      <Tab.Screen name="Búsqueda" component={ManageSearchPost} />
      <Tab.Screen name="Informativo" component={ManageInformativePost} />  
    </Tab.Navigator>
 );
}


const postulacionesData = {
  '1': [
    { id: '1', nombre: 'Pedro fernandez', fecha: '20-09-23', aceptada: false },
    { id: '2', nombre: 'Cesar Gordon', fecha: '18-09-23', aceptada: false },
    { id: '3', nombre: 'Diego Valencia', fecha: '18-09-23', aceptada: false },
    { id: '4', nombre: 'Eduardo Muena', fecha: '18-09-23', aceptada: false },
  ],
  '2': [
    { id: '3', nombre: 'Usuario 3', fecha: '19-09-23', aceptada: false },
  ],
  '3': [
    { id: '4', nombre: 'Usuario 4', fecha: '20-09-23', aceptada: false },
    { id: '5', nombre: 'Usuario 5', fecha: '20-09-23', aceptada: false },
  ],
};

const ManagePostsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPosteo, setSelectedPosteo] = useState(null);

  const handlePosteoClick = (posteoId) => {
    setSelectedPosteo(posteoId);
    setModalVisible(true);
  };

  const handleAceptarPostulacion = (postulacionId) => {
    // Aquí puedes implementar la lógica para aceptar la postulación
    // Actualizar el estado de aceptada en la postulación correspondiente
  };

  const handleRechazarPostulacion = (postulacionId) => {
    // Aquí puedes implementar la lógica para rechazar la postulación
    // Actualizar el estado de aceptada en la postulación correspondiente
  };

  return (
    <SafeAreaView>
      <StatusBar/>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={30} color={'#1E1E1E'} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Gestión de Publicaciones</Text>
        </View>
            <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
        </View>
      </View>
      <ManagePostTab></ManagePostTab>
      <View style={styles.container}>
        <View style= {{borderWidth: 1, borderColor: '#9D9D9D', padding: 5, backgroundColor: '#FFBFE2'}}>
            <Text style={{fontWeight: 'bold'}}>Nombre de publicación</Text>
        </View>
        <FlatList
            data={posts2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePosteoClick(item.id)} style={{flex: 1, flexDirection: 'row-reverse', backgroundColor: 'white', borderColor: 'grey'}}>
                <View style={{padding: 5, flexDirection: 'row-reverse', borderWidth: 1, borderColor: '#9D9D9D',}}>
                    <View style={{padding: 1}}>
                        <Ionicons name="eye" size={20}/>
                    </View>
                    <View style={{padding: 1}}>
                        <Ionicons name="pencil" size={20}/>
                    </View>
                    <View style={{padding: 1}}>
                        <Ionicons name="trash" size={20}/>
                    </View>
                </View>
                <View style={{flex: 1, borderWidth: 1, borderColor: '#9D9D9D', padding: 5}}>
                    <Text style={styles.posteo}>{item.content}</Text>
                </View>
            </TouchableOpacity>
            )}
        />

        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
            }}
        >
            <Text style={styles.modalHeader}>Postulaciones</Text>
            <View style={styles.modalContainer}>
            <FlatList
                data={postulacionesData[selectedPosteo] || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                <View style={styles.postulacionItem}>
                    <Text style= {{flex: 1}}>{item.nombre}</Text>
                    <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                        <Button
                        color={'#cc2121'}
                        title="Rechazar"
                        onPress={() => handleRechazarPostulacion(item.id)}
                        disabled={item.aceptada}
                        />
                        <Button
                        color={'#3ea12a'}
                        title="Aceptar"
                        onPress={() => handleAceptarPostulacion(item.id)}
                        disabled={item.aceptada}
                        />
                    </View>
                </View>
                )}
            />
            <Button
                title="Cerrar"
                color={'#F348A4'}
                onPress={() => setModalVisible(!modalVisible)}
            />
            </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#AEFAFF',
    paddingTop: 8,
    paddingBottom: 8,
  },
  posteo: {
    fontSize: 13,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#FFBFE2',
    padding: 16
  },
  postulacionItem: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    marginLeft: 5,
    flex: 1
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E', 
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFBFE2'
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6'
  },  
  cell: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#9D9D9D',
  },
  cellText: {
    textAlign: 'center',
  },
});

export default ManagePostsScreen;
