import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { store } from '../store';
import { logout, tokenRefreshed } from '../store/slices/authSlice';

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === 'web' || Platform.OS === 'ios') {
    return 'http://localhost:4000/api';
  }

  return 'http://10.0.2.2:4000/api';
};

const BASE_URL = getBaseUrl();

export const getAssetUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL.replace(/\/api\/?$/, '')}${url}`;
};

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken }, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 20000,
  });

  const payload = response.data?.data || response.data;
  const accessToken = payload?.accessToken || payload?.token;
  const nextRefreshToken = payload?.refreshToken;

  if (!accessToken) return null;

  await AsyncStorage.setItem('token', accessToken);
  if (nextRefreshToken) {
    await AsyncStorage.setItem('refreshToken', nextRefreshToken);
  }

  store.dispatch(tokenRefreshed({ token: accessToken, refreshToken: nextRefreshToken }));
  return accessToken;
}

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise = refreshPromise || refreshAccessToken();
      const accessToken = await refreshPromise;
      refreshPromise = null;

      if (!accessToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      store.dispatch(logout());
      return Promise.reject(refreshError);
    }
  }
);
