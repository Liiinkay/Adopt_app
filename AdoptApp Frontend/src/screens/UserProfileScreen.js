import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";

import SettingsScreen from './SettingsScreen';

const Tab = createMaterialTopTabNavigator();
const description = "Tengo 28 años y soy diseñadora gráfica. Actualmente, vivo en la vibrante Ciudad de México, México. Mi mayor pasión es el diseño gráfico y la ilustración. Disfruto enormemente plasmando ideas en imágenes y creando diseños visuales que impacten y cuenten historias. Cuando no estoy trabajando en proyectos creativos, me encontrarás dibujando en mi cuaderno o explorando las últimas tendencias de diseño. Soy una amante de la música indie y los conciertos en vivo son mi plan favorito para las noches de fin de semana. La música tiene una forma única de inspirarme y estimular mi creatividad. Una de mis mayores pasiones además del diseño es viajar. Siempre estoy planeando mi próxima aventura. Me encanta explorar nuevos lugares, conocer personas de diferentes culturas y probar comidas auténticas de todo el mundo. Mantenerme activa es fundamental para mí. Practico yoga de forma regular para mantener mi mente y cuerpo en equilibrio. Es una actividad que me ayuda a concentrarme y afrontar los desafíos con serenidad"

const AboutUser = () => {
  return(
    <View style={{flex:1}}>
      <Text>AAAAAAAAAAA</Text>
    </View>
  )
}

function ProfileTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {backgroundColor:'#F348A4'}
      }}
    >
      <Tab.Screen name="Información" component={AboutUser} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
 );
}

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
                <Text style={styles.headerText}>{user.name}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                <Ionicons name='ellipsis-vertical' size={25}/>
              </View>
          </View>
          <View style={styles.bannerContainer}>
            <Image src={user.banner} style={styles.bannerImage}/>
          </View>
          <View style={styles.profileContainer}>
            <Image src={user.image} style={styles.userProfile}/>
          </View>
          <View style={styles.userNameFollowContainer}>
            <Text style={styles.userNameText}>@{user.username}</Text>
            <View style={styles.followButton}>
              <Ionicons name='person-add-outline' color={'white'} size={30}/>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight:'bold'}}>{user.followers}</Text>
              <Text>Seguidores</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight:'bold'}}>{user.follows}</Text>
              <Text>Siguiendo</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight:'bold'}}>{user.posts}</Text>
              <Text>Posts</Text>
            </View>
          </View>
          <View style={styles.lineContainer}>
            <View style={styles.line}></View>
          </View>
          <ProfileTab></ProfileTab>
          <View style={{padding: 16}}>
            <Text style={styles.titleText}>A cerca de mí</Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        </ScrollView>
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
  bannerContainer: {
    flex: 1
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center'
  },
  userProfile: {
    width: 135,
    height: 135,
    borderRadius: 999,
    borderColor: '#F348A4',
    marginTop: -90
  },
  userNameFollowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5
  },
  followButton: {
    backgroundColor: '#F348A4',
    borderRadius: 10,
    padding: 5,
    marginLeft: 15
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E', 
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
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#B1B1B1'
  },
  lineContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  descriptionText: {
    color: '#3F3F3F',
    textAlign: 'justify'
  },
});

export default UserProfile;
