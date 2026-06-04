import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Gunakan Base URL backend admin/dashboard.
// Untuk emulator Android gunakan 10.0.2.2, untuk iOS simulator bisa pakai localhost.
const BASE_URL = 'http://10.0.2.2:4000/api';

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
