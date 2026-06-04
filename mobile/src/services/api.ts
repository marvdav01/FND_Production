import axios from 'axios';

// Gunakan Base URL sementara (sesuaikan dengan URL backend Anda, 10.0.2.2 biasa untuk emulator Android)
const BASE_URL = 'http://10.0.2.2:3000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyematkan token JWT nantinya
api.interceptors.request.use(
  async (config) => {
    // TODO: Ambil token dari AsyncStorage dan sematkan ke Authorization header
    // const token = await AsyncStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
