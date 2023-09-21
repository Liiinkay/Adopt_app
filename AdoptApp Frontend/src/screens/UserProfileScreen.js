import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";

const UserProfile = ({ navigation }) => {
  const {
    params: { user },
  } = useRoute(); 
  return (
    <SafeAreaView>
        <StatusBar/>
        <ScrollView>
          <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Ionicons name="arrow-back-outline" size={30} color={'#1E1E1E'} />
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Nombre de Usuario</Text>
              </View>
              <View style={{ flex: 1 }}></View>
          </View>
        </ScrollView>
        <View style={styles.container}>
          <Image
            source={{ uri: 'URL_DE_TU_IMAGEN_DE_PERFIL' }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>Nombre de Usuario</Text>
          <Text style={styles.description}>Descripción breve del perfil...</Text>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  header:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#AEFAFF',
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    marginLeft: 5,
    flex: 1
  },
  headerTextContainer: {
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E', 
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: 'gray',
  },
});

export default UserProfile;
