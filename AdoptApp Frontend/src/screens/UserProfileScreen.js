import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsers } from '../contexts/UserProvider';
import { useAuth } from '../contexts/AuthProvider';
import config from '../../config';

const apiUrl = config.API_URL;

const StarRating = ({ rating, onRating }) => {
  const maxRating = [1, 2, 3, 4, 5];

  return (
    <View style={styles.starContainer}>
      {maxRating.map((item, index) => (
        <TouchableOpacity
          activeOpacity={0.7}
          key={item}
          onPress={() => onRating(index + 1)}
        >
          <Ionicons
            name={item <= rating ? 'md-star' : 'md-star-outline'}
            size={30}
            color={item <= rating ? '#F348A4' : 'grey'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const UserProfileScreen = ({ route, navigation }) => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUserConnectedProfile, setIsUserConnectedProfile] = useState(false);
  const { findOne, getFollowing } = useUsers(); 
  const { getUserId, logout } = useAuth();
  const connectedUserId = getUserId(); // El ID del usuario conectado

  useEffect(() => {
    const loadUserProfile = async () => {
      const { userId: profileUserId } = route.params;
      setIsLoading(true);
      try {
        const userData = await findOne(profileUserId);
        const userFollowing = await getFollowing(connectedUserId);
        console.log(userData);
        setUserProfile(userData);
        setIsFollowing(userFollowing.includes(profileUserId)); 
        setIsUserConnectedProfile(profileUserId === connectedUserId);
      } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
        if (error.message === 'Unauthorized') {
          // Mostrar alerta y luego cerrar sesión
          Alert.alert(
            "Sesión Caducada",
            "Tu sesión ha caducado, por favor vuelve a iniciar sesión.",
            [
              { text: "OK", onPress: () => logout() } // Asume que logout es la función para cerrar sesión
            ]
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (route.params && route.params.userId) {
      loadUserProfile();
    }
  }, [route, connectedUserId]);

  if (!userProfile) {
    return <Text>Cargando...</Text>; // Puedes poner un indicador de carga aquí
  }

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
  };

  const handleRating = (rate) => {
    // Aquí puedes hacer una solicitud POST a tu API para actualizar la calificación del usuario
    console.log(`Nueva valoración: ${rate}`);
    // Actualiza el estado o realiza alguna acción después de la valoración
  };

  // Calcula el promedio de las valoraciones
  const averageRating = userProfile.rating / userProfile.ratingCount;

  return (
    <ScrollView style={styles.container}>
      {/* Banner y foto de perfil */}
      <Image source={{ uri: `${apiUrl}/api/${userProfile.banner_multimedia}` }} style={styles.bannerImage} />
      <View style={styles.profileInfo}>
        <Image source={{ uri: `${apiUrl}/api/${userProfile.profile_img}` }} style={styles.profileImage} />
        <Text style={styles.profileName}>{userProfile.name} {userProfile.last_name}</Text>
        <Text style={styles.profileNickname}>@{userProfile.nickname}</Text>
        <View style={styles.followStats}>
          <Text style={styles.stat}>{userProfile.followersCount} Seguidores</Text>
          <Text style={styles.stat}>{userProfile.followingCount} Siguiendo</Text>
          <Text style={styles.stat}>{userProfile.postsCount || 0} Posts</Text>
        </View>
        {/* Mostrar botón de seguir solo si no es el perfil del usuario conectado */}
        {!isUserConnectedProfile && (
          <TouchableOpacity style={[styles.followButton, isFollowing && styles.followingButton]} onPress={handleFollowPress}>
            <Ionicons name={isFollowing ? 'md-checkmark' : 'md-person-add'} size={20} color="#fff" style={styles.followIcon} />
            <Text style={styles.followButtonText}>{isFollowing ? 'Siguiendo' : 'Seguir'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sección de tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab}>
          <Text>Información</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text>Interacciones</Text>
        </TouchableOpacity>
      </View>

      {/* Acerca de mí */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Acerca de mí</Text>
        <Text style={styles.aboutText}>
          {/* Asegúrate de tener una propiedad bio en tus datos, si no es así, ajusta según tu modelo de datos */}
          {userProfile.bio || 'No hay información disponible.'}
        </Text>
      </View>
      
      {/* Sección de valoración */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>Valoración del Usuario</Text>
        <StarRating rating={averageRating} onRating={handleRating} />
        <Text style={styles.ratingPercentage}>{(averageRating / 5 * 100).toFixed(0)}%</Text>
      </View>

      {/* Agrega aquí más secciones como valoraciones, fotos, etc. */}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerImage: {
    width: '100%',
    height: 200, // Ajusta la altura según sea necesario
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginTop: -50, // Ajuste para que la imagen se sobreponga al banner
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  profileNickname: {
    color: 'grey',
  },
  followStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  stat: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  followButton: {
    flexDirection: 'row',
    backgroundColor: '#F348A4', // Color rosa para el botón seguir
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  followingButton: {
    backgroundColor: 'lightgrey', // Un color diferente para el botón 'Siguiendo'
  },
  followIcon: {
    marginRight: 5,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabSection: {
    // Estilos para la sección de tabs
  },
  aboutSection: {
    padding: 10,
  },
  aboutTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  aboutText: {
    fontSize: 16,
    color: 'grey',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tab: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000',
  },
  ratingsSection: {
    padding: 10,
    backgroundColor: '#fff',
  },
  ratingsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  ratingTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  ratingPercentage: {
    marginTop: 10,
    fontSize: 16,
    color: 'grey',
  },
});


export default UserProfileScreen;
