import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MedicineListScreen from '../screens/MedicineListScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminCategoryScreen from '../screens/AdminCategoryScreen';
import AdminMedicineScreen from '../screens/AdminMedicineScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#f7fcff' },
        headerTitleStyle: {
          fontWeight: '800',
          color: '#102a43',
          fontSize: 18,
        },
        headerTintColor: '#0b7285',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#eef5f9' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pharmacy' }} />
      <Stack.Screen name="MedicineList" component={MedicineListScreen} options={{ title: 'Medicine List' }} />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Prescription Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Delivery Details' }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Secure Payment' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
      <Stack.Screen name="AdminCategory" component={AdminCategoryScreen} options={{ title: 'Medicine Categories' }} />
      <Stack.Screen name="AdminMedicine" component={AdminMedicineScreen} options={{ title: 'Manage Medicines' }} />
    </Stack.Navigator>
  );
}
