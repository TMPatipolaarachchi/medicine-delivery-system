import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await apiClient.get('/users/profile');
      setName(data.name);
      setEmail(data.email);
      setRole(data.role);
    } catch (error) {
      Alert.alert('Error', 'Trouble looking up profile context. Please re-login!');
    }
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put('/users/profile', { name, email });
      Alert.alert('Success', 'Profile settings updated securely');
    } catch (error) {
      Alert.alert('Error', 'Update rejected');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Ionicons name="shield-checkmark-outline" size={14} color={ui.colors.primary} />
            <Text style={styles.roleBadgeText}>{role.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.title}>Patient Profile</Text>

        <Text style={styles.label}>Patient Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />

        <Pressable style={styles.primaryBtn} onPress={handleUpdate}>
          <Text style={styles.primaryBtnText}>Save Profile</Text>
        </Pressable>

        {role === 'admin' && (
          <Pressable style={styles.adminBtn} onPress={() => navigation.navigate('AdminCategory')}>
            <Text style={styles.adminBtnText}>Open Pharmacy Admin</Text>
          </Pressable>
        )}

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ui.colors.background },
  content: { padding: screenPadding, paddingBottom: 24 },
  badgeRow: { alignItems: 'flex-start', marginBottom: 12 },
  roleBadge: {
    backgroundColor: ui.colors.primarySoft,
    borderRadius: ui.radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleBadgeText: { color: ui.colors.primary, fontWeight: '700', fontSize: 12 },
  title: { ...ui.type.heading, marginBottom: 14 },
  label: { fontSize: 13, color: ui.colors.mutedText, marginBottom: 6, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderRadius: ui.radius.md,
    fontSize: 15,
    color: ui.colors.text,
  },
  primaryBtn: {
    backgroundColor: ui.colors.primary,
    borderRadius: ui.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  adminBtn: {
    marginTop: 10,
    backgroundColor: ui.colors.success,
    borderRadius: ui.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  adminBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  logoutBtn: {
    marginTop: 10,
    borderRadius: ui.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ui.colors.danger,
    backgroundColor: '#fff',
  },
  logoutBtnText: { color: ui.colors.danger, fontWeight: '700', fontSize: 15 },
});
