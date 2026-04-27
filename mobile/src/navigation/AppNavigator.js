import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import FoodListScreen from '../screens/FoodListScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminCategoryScreen from '../screens/AdminCategoryScreen';
import AdminFoodScreen from '../screens/AdminFoodScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: {
          fontWeight: '800',
          color: '#1f2937',
          fontSize: 18,
        },
        headerTintColor: '#0f766e',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#f4f7fb' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Medicines' }} />
      <Stack.Screen name="FoodList" component={FoodListScreen} options={{ title: 'Medicine List' }} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AdminCategory" component={AdminCategoryScreen} options={{ title: 'Admin Categories' }} />
      <Stack.Screen name="AdminFood" component={AdminFoodScreen} options={{ title: 'Manage Medicines' }} />
    </Stack.Navigator>
  );
}
