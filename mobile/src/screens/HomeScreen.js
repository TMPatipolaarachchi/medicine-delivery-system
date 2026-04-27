import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [foodsByCategory, setFoodsByCategory] = useState({});

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [{ data: categoryData }, { data: foodData }] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/foods'),
      ]);

      const groupedFoods = foodData.reduce((acc, food) => {
        const categoryId = food.category?._id || food.category;
        if (!categoryId) return acc;
        if (!acc[categoryId]) acc[categoryId] = [];
        acc[categoryId].push(food);
        return acc;
      }, {});

      setCategories(categoryData);
      setFoodsByCategory(groupedFoods);
    } catch (error) {
      console.log('Error fetching home data');
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('file://')) return path;
    return `${apiClient.defaults.baseURL.replace('/api', '')}${path}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            <View style={styles.topRow}>
              <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-circle-outline" size={21} color={ui.colors.primary} />
                <Text style={styles.iconBtnText}>Profile</Text>
              </Pressable>
              <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
                <Ionicons name="bag-handle-outline" size={20} color={ui.colors.primary} />
                <Text style={styles.iconBtnText}>Cart</Text>
              </Pressable>
            </View>

            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Discover Your{`\n`}Favorite Flavors</Text>
              <Text style={styles.heroSub}>Explore curated categories and order in minutes.</Text>
            </View>

            <Text style={styles.sectionTitle}>Popular Categories</Text>
          </>
        }
        contentContainerStyle={styles.listWrap}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('FoodList', { categoryId: item._id })}>
            {item.image ? (
              <Image source={{ uri: getFullImageUrl(item.image) }} style={styles.heroImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="restaurant-outline" size={24} color={ui.colors.mutedText} />
              </View>
            )}
            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardText}>{item.name}</Text>
                <Pressable style={styles.viewAllBtn} onPress={() => navigation.navigate('FoodList', { categoryId: item._id })}>
                  <Text style={styles.viewAllText}>View all</Text>
                  <Ionicons name="arrow-forward" size={14} color={ui.colors.primary} />
                </Pressable>
              </View>

              {foodsByCategory[item._id]?.length ? (
                foodsByCategory[item._id].map((food) => (
                  <View key={food._id} style={styles.foodRow}>
                    <Text style={styles.foodName} numberOfLines={1}>{food.name}</Text>
                    <Text style={styles.foodPrice}>${Number(food.price).toFixed(2)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyFoods}>No foods in this category yet.</Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ui.colors.background },
  listWrap: {
    paddingHorizontal: screenPadding,
    paddingBottom: 24,
  },
  topRow: {
    marginTop: 8,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: {
    backgroundColor: '#ffffff',
    borderColor: ui.colors.border,
    borderWidth: 1,
    borderRadius: ui.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtnText: {
    color: ui.colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  heroCard: {
    borderRadius: ui.radius.lg,
    padding: 22,
    backgroundColor: '#0f766e',
    marginBottom: 20,
    ...ui.shadow.card,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  heroSub: {
    color: '#dcfce7',
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
  },
  sectionTitle: {
    ...ui.type.heading,
    marginBottom: 8,
  },
  card: {
    backgroundColor: ui.colors.surface,
    marginTop: 12,
    borderRadius: ui.radius.md,
    borderWidth: 1,
    borderColor: ui.colors.border,
    overflow: 'hidden',
    ...ui.shadow.card,
  },
  heroImage: { width: '100%', height: 140, resizeMode: 'cover' },
  imagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 14,
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 19,
    fontWeight: '700',
    color: ui.colors.text,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: ui.colors.primary,
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  foodName: {
    flex: 1,
    marginRight: 8,
    fontSize: 14,
    color: ui.colors.text,
    fontWeight: '600',
  },
  foodPrice: {
    fontSize: 14,
    color: ui.colors.accent,
    fontWeight: '800',
  },
  emptyFoods: {
    fontSize: 13,
    color: ui.colors.mutedText,
    fontStyle: 'italic',
  },
});
