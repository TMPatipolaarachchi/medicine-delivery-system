import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: '#0b7285',
          background: '#eef5f9',
          card: '#ffffff',
          text: '#102a43',
          border: '#d9e2ec',
          notification: '#2f9e44',
        },
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}
