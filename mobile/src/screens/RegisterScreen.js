import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) return Alert.alert('Error', 'All fields required');
    try {
      const { data } = await apiClient.post('/users/register', { name, email, password });
      if (data && data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Registration failed. Please check the backend URL.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardWrap}>
        <View style={styles.heroBlobA} />
        <View style={styles.heroBlobB} />

        <View style={styles.headerWrap}>
          <Text style={styles.eyebrow}>PATIENT ONBOARDING</Text>
          <Text style={styles.title}>Create Your Care Account</Text>
          <Text style={styles.subtitle}>Join the pharmacy app and order essential medicines in minutes.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color={ui.colors.mutedText} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={ui.colors.mutedText} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={ui.colors.mutedText} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.primaryBtn} onPress={handleRegister}>
            <Text style={styles.primaryBtnText}>Register</Text>
            <Ionicons name="sparkles-outline" size={18} color="#fff" />
          </Pressable>
        </View>

        <Pressable style={styles.switchBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchBtnText}>Already have an account? Login</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef5f9' },
  keyboardWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: screenPadding },
  heroBlobA: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#e0f2fe',
    top: -70,
    left: -90,
  },
  heroBlobB: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#dcfce7',
    bottom: -50,
    right: -90,
  },
  headerWrap: { marginBottom: ui.spacing.lg },
  eyebrow: {
    color: ui.colors.accent,
    fontWeight: '700',
    letterSpacing: 1.3,
    marginBottom: 8,
  },
  title: ui.type.title,
  subtitle: {
    ...ui.type.body,
    marginTop: 8,
    maxWidth: 330,
  },
  card: {
    backgroundColor: ui.colors.surface,
    borderRadius: ui.radius.lg,
    padding: ui.spacing.lg,
    borderWidth: 1,
    borderColor: ui.colors.border,
    gap: ui.spacing.sm,
    ...ui.shadow.card,
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.md,
    paddingHorizontal: ui.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    color: ui.colors.text,
    paddingHorizontal: 10,
    paddingVertical: 14,
    fontSize: 16,
  },
  primaryBtn: {
    marginTop: 10,
    backgroundColor: ui.colors.accent,
    borderRadius: ui.radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  switchBtn: {
    alignSelf: 'center',
    marginTop: ui.spacing.lg,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  switchBtnText: {
    color: '#0b7285',
    fontWeight: '600',
  },
});
