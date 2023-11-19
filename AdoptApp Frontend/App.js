import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './src/contexts/AuthProvider';
import RootNavigator from './src/navigation/RootNav';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator/>
      </NavigationContainer>
    </AuthProvider>
  );
}
