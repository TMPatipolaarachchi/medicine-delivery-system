import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../api/apiClient';
import { screenPadding, ui } from '../theme/ui';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    try {
      const { data } = await apiClient.post('/users/login', { email, password });
      if (data && data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Login failed. Please check the backend URL.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardWrap}>
        <View style={styles.heroBlobA} />
        <View style={styles.heroBlobB} />

        <View style={styles.headerWrap}>
          <Text style={styles.eyebrow}>DIGITAL PHARMACY</Text>
          <Text style={styles.title}>Sign In To Your Care App</Text>
          <Text style={styles.subtitle}>Order medicines, manage deliveries, and track every prescription.</Text>
        </View>

        <View style={styles.card}>
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

          <Pressable style={styles.primaryBtn} onPress={handleLogin}>
            <Text style={styles.primaryBtnText}>Login</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </View>

        <Pressable style={styles.switchBtn} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.switchBtnText}>New here? Create your account</Text>
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
    backgroundColor: '#d8f3f7',
    top: -70,
    right: -90,
  },
  heroBlobB: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#dbeafe',
    bottom: -50,
    left: -80,
  },
  headerWrap: { marginBottom: ui.spacing.lg },
  eyebrow: {
    color: ui.colors.primary,
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
    backgroundColor: ui.colors.primary,
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
