import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function AdminCategoryScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await apiClient.get('/categories');
      setCategories(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch categories');
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
    if (!name) return Alert.alert('Validation', 'Please enter a name');

    let uploadedImageUrl = imageUri;
    if (imageUri && !imageUri.startsWith('http') && !imageUri.startsWith('/uploads')) {
      uploadedImageUrl = await uploadImage(imageUri);
      if (!uploadedImageUrl) return;
    }

    try {
      const payload = { name, description, image: uploadedImageUrl };
      if (editId) {
        await apiClient.put(`/categories/${editId}`, payload);
      } else {
        await apiClient.post('/categories', payload);
      }
      setName('');
      setDescription('');
      setImageUri('');
      setEditId(null);
      fetchCategories();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Must be logged in as Admin');
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setDescription(cat.description || '');
    setImageUri(cat.image || '');
    setEditId(cat._id);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (e) {
      Alert.alert('Error', 'Failed to delete category');
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
        data={categories}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.heading}>{editId ? 'Edit Category' : 'Create Category'}</Text>

            <TextInput style={styles.input} placeholder="Category Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

            <View style={styles.imageRow}>
              <Pressable style={styles.imageBtn} onPress={pickImage}>
                <Ionicons name="image-outline" size={18} color={ui.colors.primary} />
                <Text style={styles.imageBtnText}>Pick Image</Text>
              </Pressable>
              {imageUri ? <Image source={{ uri: getFullImageUrl(imageUri) }} style={styles.thumbMini} /> : null}
            </View>

            <Pressable style={styles.primaryBtn} onPress={handleSubmit}>
              <Text style={styles.primaryBtnText}>{editId ? 'Update Category' : 'Create Category'}</Text>
            </Pressable>

            {editId ? (
              <Pressable style={styles.ghostBtn} onPress={() => { setEditId(null); setName(''); setDescription(''); setImageUri(''); }}>
                <Text style={styles.ghostBtnText}>Cancel Edit</Text>
              </Pressable>
            ) : null}

            <Text style={styles.subHeading}>All Categories</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? (
              <Image source={{ uri: getFullImageUrl(item.image) }} style={styles.cardImage} />
            ) : (
              <View style={styles.cardPlaceholder}><Ionicons name="medkit-outline" size={18} color={ui.colors.mutedText} /></View>
            )}

            <View style={styles.cardBody}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
              <View style={styles.actionsRow}>
                <Pressable style={styles.manageBtn} onPress={() => navigation.navigate('AdminFood', { categoryId: item._id, categoryName: item.name })}>
                  <Text style={styles.manageBtnText}>Manage Medicines</Text>
                </Pressable>
                <Pressable style={styles.smallBtn} onPress={() => handleEdit(item)}><Text style={styles.smallBtnText}>Edit</Text></Pressable>
                <Pressable style={[styles.smallBtn, styles.deleteBtn]} onPress={() => handleDelete(item._id)}><Text style={[styles.smallBtnText, styles.deleteText]}>Del</Text></Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ui.colors.background },
  content: { padding: screenPadding, paddingBottom: 30 },
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
    backgroundColor: ui.colors.primary,
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
    marginBottom: 10,
    overflow: 'hidden',
    ...ui.shadow.card,
  },
  cardImage: { width: 84, height: '100%' },
  cardPlaceholder: {
    width: 84,
    minHeight: 92,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: { flex: 1, padding: 10 },
  name: { fontSize: 16, color: ui.colors.text, fontWeight: '700' },
  desc: { color: ui.colors.mutedText, fontSize: 12, marginTop: 3 },
  actionsRow: {
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  manageBtn: {
    flex: 1,
    borderRadius: ui.radius.pill,
    backgroundColor: '#ecfeff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  manageBtnText: { color: ui.colors.primary, fontWeight: '700', fontSize: 12 },
  smallBtn: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  smallBtnText: { color: ui.colors.text, fontWeight: '700', fontSize: 12 },
  deleteBtn: { borderColor: '#fecaca' },
  deleteText: { color: ui.colors.danger },
});
