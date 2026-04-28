import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function CheckoutScreen({ route, navigation }) {
  const { totalPrice } = route.params;
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const handleCheckout = async () => {
    if (!address || !city || !postalCode || !country) {
      return Alert.alert('Validation Error', 'All fields are strictly required');
    }

    try {
      const { data } = await apiClient.post('/orders', {
        deliveryLocation: { address, city, postalCode, country },
        paymentMethod: 'Card',
        taxPrice: 0,
        shippingPrice: 5,
      });
      navigation.replace('Payment', { orderId: data._id });
    } catch (error) {
      Alert.alert('Checkout Error', error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Delivery and Contact Details</Text>

        <View style={styles.inputWrap}>
          <Ionicons name="location-outline" size={18} color={ui.colors.mutedText} />
          <TextInput style={styles.input} placeholder="Street Address" value={address} onChangeText={setAddress} />
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="business-outline" size={18} color={ui.colors.mutedText} />
          <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="mail-open-outline" size={18} color={ui.colors.mutedText} />
          <TextInput style={styles.input} placeholder="Postal Code" value={postalCode} onChangeText={setPostalCode} />
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="earth-outline" size={18} color={ui.colors.mutedText} />
          <TextInput style={styles.input} placeholder="Country" value={country} onChangeText={setCountry} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Prescription Summary</Text>
          <View style={styles.rowBetween}><Text style={styles.summaryTxt}>Medicines Subtotal</Text><Text style={styles.summaryPrice}>${totalPrice.toFixed(2)}</Text></View>
          <View style={styles.rowBetween}><Text style={styles.summaryTxt}>Handling and Delivery</Text><Text style={styles.summaryPrice}>$5.00</Text></View>
          <View style={[styles.rowBetween, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${(totalPrice + 5).toFixed(2)}</Text>
          </View>
        </View>

        <Pressable style={styles.payBtn} onPress={handleCheckout}>
          <Text style={styles.payBtnText}>Review Payment</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ui.colors.background },
  content: { padding: screenPadding, paddingBottom: 26 },
  heading: {
    ...ui.type.heading,
    marginBottom: 14,
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.md,
    marginBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 14,
    color: ui.colors.text,
    fontSize: 15,
  },
  summaryCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: ui.radius.md,
    borderWidth: 1,
    borderColor: ui.colors.border,
    backgroundColor: '#fff',
    ...ui.shadow.card,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: ui.colors.text, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryTxt: { color: ui.colors.mutedText, fontSize: 14 },
  summaryPrice: { color: ui.colors.text, fontSize: 14, fontWeight: '600' },
  totalRow: { marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: ui.colors.border },
  totalLabel: { color: ui.colors.text, fontSize: 15, fontWeight: '700' },
  totalValue: { color: ui.colors.accent, fontSize: 20, fontWeight: '800' },
  payBtn: {
    marginTop: 16,
    backgroundColor: ui.colors.primary,
    borderRadius: ui.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
