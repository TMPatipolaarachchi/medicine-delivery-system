import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function AdminFoodScreen({ route }) {
  const { categoryId, categoryName } = route.params;
  const [medicines, setMedicines] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchMedicines(); }, []);

  const fetchMedicines = async () => {
    try {
      const { data } = await apiClient.get(`/medicines/category/${categoryId}`);
      setMedicines(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load medicines');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri || uri.startsWith('http')) return uri;
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /(\.\w+)$/.exec(filename);
    const type = match ? `image/${match[1].replace('.', '')}` : 'image';

    formData.append('image', { uri, name: filename, type });

    try {
      const { data } = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (error) {
      Alert.alert('Upload Failed', 'Could not save image to server.');
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !description) return Alert.alert('Validation', 'Missing fields');

    let uploadedImageUrl = imageUri;
    if (imageUri && !imageUri.startsWith('http') && !imageUri.startsWith('/uploads')) {
      uploadedImageUrl = await uploadImage(imageUri);
      if (!uploadedImageUrl) return;
    }

    try {
      const payload = { name, description, price: Number(price), category: categoryId, image: uploadedImageUrl };
      if (editId) {
        await apiClient.put(`/medicines/${editId}`, payload);
      } else {
        await apiClient.post('/medicines', payload);
      }
      setName('');
      setDescription('');
      setPrice('');
      setImageUri('');
      setEditId(null);
      fetchMedicines();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Must be an admin');
    }
  };

  const handleEdit = (medicine) => {
    setName(medicine.name);
    setDescription(medicine.description);
    setPrice(medicine.price.toString());
    setImageUri(medicine.image || '');
    setEditId(medicine._id);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/medicines/${id}`);
      fetchMedicines();
    } catch (e) {
      Alert.alert('Error', 'Failed to delete');
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
        data={medicines}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.heading}>{editId ? 'Edit Medicine Item' : `Add Medicine to ${categoryName}`}</Text>

            <TextInput style={styles.input} placeholder="Medicine Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Price (e.g. 5.99)" value={price} onChangeText={setPrice} keyboardType="numeric" />

            <View style={styles.imageRow}>
              <Pressable style={styles.imageBtn} onPress={pickImage}>
                <Ionicons name="images-outline" size={18} color={ui.colors.primary} />
                <Text style={styles.imageBtnText}>Pick Image</Text>
              </Pressable>
              {imageUri ? <Image source={{ uri: getFullImageUrl(imageUri) }} style={styles.thumbMini} /> : null}
            </View>

            <Pressable style={styles.primaryBtn} onPress={handleSubmit}>
              <Text style={styles.primaryBtnText}>{editId ? 'Update Medicine' : 'Create Medicine'}</Text>
            </Pressable>

            {editId ? (
              <Pressable style={styles.ghostBtn} onPress={() => { setEditId(null); setName(''); setDescription(''); setPrice(''); setImageUri(''); }}>
                <Text style={styles.ghostBtnText}>Cancel Edit</Text>
              </Pressable>
            ) : null}

            <Text style={styles.subHeading}>All Medicines</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? (
              <Image source={{ uri: getFullImageUrl(item.image) }} style={styles.thumbnail} />
            ) : (
              <View style={styles.thumbFallback}><Ionicons name="medkit-outline" size={18} color={ui.colors.mutedText} /></View>
            )}
            <View style={styles.cardInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
            </View>
            <View style={styles.cardActions}>
              <Pressable style={styles.smallBtn} onPress={() => handleEdit(item)}>
                <Text style={styles.smallBtnText}>Edit</Text>
              </Pressable>
              <Pressable style={[styles.smallBtn, styles.deleteBtn]} onPress={() => handleDelete(item._id)}>
                <Text style={[styles.smallBtnText, styles.deleteText]}>Del</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ui.colors.background },
  content: { padding: screenPadding, paddingBottom: 24 },
  heading: { ...ui.type.heading, marginBottom: 12 },
  subHeading: { ...ui.type.heading, fontSize: 19, marginTop: 14, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.md,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    color: ui.colors.text,
  },
  imageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  imageBtn: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imageBtnText: { color: ui.colors.primary, fontWeight: '600' },
  thumbMini: { width: 44, height: 44, marginLeft: 12, borderRadius: 10 },
  primaryBtn: {
    backgroundColor: ui.colors.success,
    paddingVertical: 13,
    borderRadius: ui.radius.md,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  ghostBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  ghostBtnText: { color: ui.colors.text, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.md,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    ...ui.shadow.card,
  },
  thumbnail: { width: 70, height: 70, borderRadius: 10 },
  thumbFallback: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: { flex: 1, marginLeft: 10 },
  name: { color: ui.colors.text, fontWeight: '700', fontSize: 16 },
  price: { color: ui.colors.accent, fontWeight: '800', marginTop: 3 },
  desc: { color: ui.colors.mutedText, fontSize: 12, marginTop: 4 },
  cardActions: { gap: 8 },
  smallBtn: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  smallBtnText: { color: ui.colors.text, fontWeight: '700', fontSize: 12 },
  deleteBtn: { borderColor: '#fecaca' },
  deleteText: { color: ui.colors.danger },
});
