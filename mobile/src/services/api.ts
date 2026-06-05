import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Gunakan Base URL backend admin/dashboard.
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // IP Fallback saat EXPO_PUBLIC_API_URL belum diset (khusus local testing)
  const LOCAL_IP = '192.168.18.14';

  if (Platform.OS === 'web') {
    // Versi web di browser PC
    return 'http://localhost:4000/api';
  } else {
    // Android/iOS — baik emulator maupun HP fisik via Expo Go
    return `http://${LOCAL_IP}:4000/api`;
  }
};

const BASE_URL = getBaseUrl();
console.log(`[API] Connected to API`);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyematkan token JWT dari AsyncStorage
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
