import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import AuthStackNavigator from './AuthStackNav';
import MainStackGroup from './MainStackNav';
import { useNavigation } from '@react-navigation/native';

const RootNavigator = () => {
  const { isAuthenticated, logOut } = useAuth();
  const navigation = useNavigation();
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Verifica el estado de autenticación aquí
      if (!isAuthenticated) {
        logOut();
      }
    }, 10000); // Verifica cada 10 segundos
  
    return () => clearInterval(interval); // Limpiar en desmontaje
  }, [isAuthenticated, logOut, navigation]);

  return (
    isAuthenticated ? <MainStackGroup /> : <AuthStackNavigator />
  );
};

export default RootNavigator;
