import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserProfileScreen = ({ navigation }) => {
  // Ejemplo de datos del usuario
  const userInfo = {
    name: 'Juan Andrés Soto',
    username: '@JuanitoMola23',
    followers: 15,
    following: 21,
    posts: 4,
    bio: 'Que onda chavales, soy un ser que le fascinan los animales...',
    // Agrega más datos según necesites
  };
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { findOne } = useContext(UserContext); // Asegúrate de que findOne es parte de tu UserContext

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const userId = 'id_del_usuario'; // Asegúrate de tener el ID del usuario que deseas cargar
        const userData = await findOne(userId);
        setUser(userData);
      } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#F348A4" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{userInfo.name}</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#F348A4" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileSection}>
          
          <Text style={styles.username}>{userInfo.username}</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statNumber}>{userInfo.followers} Seguidores</Text>
            <Text style={styles.statNumber}>{userInfo.following} Siguiendo</Text>
            <Text style={styles.statNumber}>{userInfo.posts} Posts</Text>
          </View>
          <View style={styles.tabsContainer}>
            {/* Implementa los tabs aquí */}
          </View>
        </View>
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>{userInfo.bio}</Text>
        </View>
        {/* Agrega más secciones según necesites */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Fondo claro para mantener la consistencia
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F348A4', // Color rosa para la cabecera
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  username: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tabsContainer: {
    // Estilos para tus tabs
  },
  bioSection: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#666',
  },
  // Agrega más estilos según necesites
});

export default UserProfileScreen;
