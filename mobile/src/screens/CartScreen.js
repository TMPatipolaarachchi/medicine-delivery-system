import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCart();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchCart = async () => {
    try {
      const { data } = await apiClient.get('/cart');
      setCart(data);
    } catch (error) {
      console.log('Error fetching cart');
    }
  };

  const removeItem = async (medicineId) => {
    try {
      await apiClient.delete(`/cart/${medicineId}`);
      fetchCart();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove');
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('file://')) return path;
    return apiClient.defaults.baseURL.replace('/api', '') + path;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={(item, index) => item.food?._id || item.medicine?._id || `${index}`}
        contentContainerStyle={styles.listWrap}
        ListHeaderComponent={<Text style={styles.heading}>Your Medicine Cart</Text>}
        renderItem={({ item }) => {
          const medicine = item.food || item.medicine;

          return (
          <View style={styles.card}>
            {medicine?.image ? (
              <Image source={{ uri: getFullImageUrl(medicine.image) }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Ionicons name="medkit-outline" size={20} color={ui.colors.mutedText} />
              </View>
            )}
            <View style={styles.info}>
              <Text style={styles.name}>{medicine?.name}</Text>
              <Text style={styles.qty}>Qty x{item.quantity}</Text>
              <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
            </View>
            <Pressable onPress={() => medicine?._id && removeItem(medicine._id)} style={styles.removeBtn}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
            </Pressable>
          </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Your medicine cart is empty</Text>}
      />

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.total}>${Number(cart.totalPrice).toFixed(2)}</Text>
        </View>
        <Pressable
          disabled={cart.items.length === 0}
          onPress={() => navigation.navigate('Checkout', { totalPrice: cart.totalPrice })}
          style={[styles.checkoutBtn, cart.items.length === 0 && styles.checkoutBtnDisabled]}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ui.colors.background },
  listWrap: { paddingHorizontal: screenPadding, paddingBottom: 120 },
  heading: {
    ...ui.type.heading,
    marginTop: 6,
    marginBottom: 10,
  },
  card: {
    padding: 12,
    backgroundColor: ui.colors.surface,
    borderRadius: ui.radius.md,
    borderWidth: 1,
    borderColor: ui.colors.border,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...ui.shadow.card,
  },
  thumbnail: { width: 62, height: 62, borderRadius: 11, marginRight: 12 },
  thumbnailPlaceholder: {
    width: 62,
    height: 62,
    borderRadius: 11,
    marginRight: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1 },
  name: { color: ui.colors.text, fontWeight: '700', fontSize: 16 },
  qty: { color: ui.colors.mutedText, fontSize: 13, marginTop: 3 },
  price: { color: ui.colors.accent, fontWeight: '800', fontSize: 15, marginTop: 4 },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ui.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    marginTop: 30,
    textAlign: 'center',
    color: ui.colors.mutedText,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: ui.colors.border,
    paddingHorizontal: screenPadding,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: { fontSize: 12, color: ui.colors.mutedText, fontWeight: '600' },
  total: { fontSize: 25, color: ui.colors.text, fontWeight: '800' },
  checkoutBtn: {
    backgroundColor: ui.colors.primary,
    borderRadius: ui.radius.pill,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  checkoutBtnDisabled: { backgroundColor: '#94a3b8' },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
