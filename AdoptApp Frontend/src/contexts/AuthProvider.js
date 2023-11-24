import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      if (token) {
        setIsAuthenticated(true);
        setUserId(JSON.parse(userId));
      }
    };

    checkAuthStatus();
  }, []);

  const logIn = async (token, id) => {
    setUserToken(token);
    setUserId(id);
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userId', JSON.stringify(userId));
    setIsAuthenticated(true); // Establecer isAuthenticated en true después del inicio de sesión
  };

  const logOut = async () => {
    setUserToken(null);
    setUserId(null)
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  const getUserId = () => userId;

  return (
    <AuthContext.Provider value={{ 
      userToken, 
      logIn, 
      logOut,
      isAuthenticated,
      setIsAuthenticated,
      getUserId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

