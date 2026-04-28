import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function PaymentScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [loading, setLoading] = useState(false);

  const processPayment = async (method) => {
    setLoading(true);
    try {
      await apiClient.post('/payments', {
        orderId,
        paymentMethod: method,
        paymentResult: { id: 'pi_demo12345', status: 'success' },
      });
      Alert.alert('Success', `Medicine order processed with ${method}`);
      navigation.popToTop();
    } catch (error) {
      Alert.alert('Payment Failed', error.response?.data?.message || 'Bank error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Secure Payment</Text>
        <Text style={styles.sub}>Choose how you want to pay for your medicines.</Text>

        {loading ? (
          <ActivityIndicator size="large" color={ui.colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.optionWrap}>
            <Pressable style={styles.optionBtn} onPress={() => processPayment('Card')}>
              <Ionicons name="card-outline" size={18} color="#fff" />
              <Text style={styles.optionText}>Card Payment</Text>
            </Pressable>

            <Pressable style={[styles.optionBtn, styles.cashBtn]} onPress={() => processPayment('Cash')}>
              <Ionicons name="cash-outline" size={18} color="#fff" />
              <Text style={styles.optionText}>Cash on Delivery</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: screenPadding,
    backgroundColor: ui.colors.background,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: ui.radius.lg,
    borderWidth: 1,
    borderColor: ui.colors.border,
    padding: 20,
    ...ui.shadow.card,
  },
  title: {
    ...ui.type.heading,
    textAlign: 'center',
  },
  sub: {
    ...ui.type.body,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  loader: { marginVertical: 10 },
  optionWrap: { gap: 12 },
  optionBtn: {
    backgroundColor: ui.colors.primary,
    borderRadius: ui.radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  cashBtn: { backgroundColor: ui.colors.success },
  optionText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
