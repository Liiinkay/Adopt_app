import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  // Actualizar el estado de autenticación basado en userToken y userId
  useEffect(() => {
    setIsAuthenticated(!!userToken && !!userId);
  }, [userToken, userId]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userId');

      if (token && id) {
        setUserToken(token);
        setUserId(JSON.parse(id));
      } else {
        logOut();
      }
    };

    checkAuthStatus();
  }, []);

  const logIn = async (token, id) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userId', JSON.stringify(id));
    setUserToken(token);
    setUserId(id);
  };

  const logOut = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    setUserToken(null);
    setUserId(null);
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

export default AuthProvider;