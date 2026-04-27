import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function FoodListScreen({ route }) {
  const { categoryId } = route.params;
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, [categoryId]);

  const fetchFoods = async () => {
    try {
      const { data } = await apiClient.get(`/foods/category/${categoryId}`);
      setFoods(data);
    } catch (error) {
      Alert.alert('Error', 'Error fetching foods');
    }
  };

  const addToCart = async (foodId, price) => {
    try {
      await apiClient.post('/cart', { foodId, quantity: 1, price });
      Alert.alert('Success', 'Added to cart');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart');
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
        data={foods}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listWrap}
        ListHeaderComponent={<Text style={styles.heading}>Pick your meal</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? (
              <Image source={{ uri: getFullImageUrl(item.image) }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Ionicons name="image-outline" size={20} color={ui.colors.mutedText} />
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
              <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
            </View>

            <Pressable style={styles.addBtn} onPress={() => addToCart(item._id, item.price)}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ui.colors.background },
  listWrap: { paddingHorizontal: screenPadding, paddingBottom: 22 },
  heading: {
    ...ui.type.heading,
    marginTop: 6,
    marginBottom: 8,
  },
  card: {
    padding: 12,
    backgroundColor: ui.colors.surface,
    borderColor: ui.colors.border,
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: ui.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...ui.shadow.card,
  },
  thumbnail: { width: 74, height: 74, borderRadius: 12, marginRight: 12 },
  thumbnailPlaceholder: {
    width: 74,
    height: 74,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: ui.colors.text },
  desc: { color: ui.colors.mutedText, marginVertical: 5, fontSize: 13, lineHeight: 18 },
  price: { fontSize: 16, color: ui.colors.accent, fontWeight: '800' },
  addBtn: {
    backgroundColor: ui.colors.primary,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: ui.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
