import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const normalizeApiBaseUrl = (value) => {
  if (!value) return '';

  let url = value.trim();
  if (!url) return '';

  // Prevent relative URLs in web builds when protocol is omitted.
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  url = url.replace(/\/$/, '');

  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
};

const configuredBaseUrl = normalizeApiBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);

const fallbackBaseUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const BASE_URL = (configuredBaseUrl || fallbackBaseUrl).replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (!BASE_URL) {
      throw new Error('Missing API base URL. Set EXPO_PUBLIC_API_BASE_URL.');
    }

    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
