import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: '#0f766e',
          background: '#f4f7fb',
          card: '#ffffff',
          text: '#1f2937',
          border: '#e5e7eb',
          notification: '#ea580c',
        },
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}
