import React from 'react';
import { useAuth } from '../contexts/AuthProvider';
import AuthStackNavigator from './AuthStackNav';
import MainStackGroup from './MainStackNav';

const RootNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    isAuthenticated ? <MainStackGroup/> : <AuthStackNavigator />
  );
};

export default RootNavigator;
