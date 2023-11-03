import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppDrawerGroup from './src/navigation/AppDrawer';

export default function App() {
  return (
    <NavigationContainer>
      <AppDrawerGroup/>
    </NavigationContainer>
  );
}
