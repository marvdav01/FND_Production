import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { AuthNavigator } from './AuthNavigator';
import { ClientNavigator } from './ClientNavigator';
import { CrewNavigator } from './CrewNavigator';
import { api } from '../services/api';
import { logout, updateProfileSuccess } from '../store/slices/authSlice';

export const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkProfile = async () => {
      if (isAuthenticated && token) {
        try {
          // Sync data profil terbaru dari backend database
          const response = await api.get('/auth/profile');
          if (response.data.success) {
            dispatch(updateProfileSuccess(response.data.data));
          }
        } catch (error: any) {
          console.error('[Auth Sync] Gagal sinkronisasi profil:', error);
          // Jika token tidak valid / expired (401), paksa logout
          if (error.response && error.response.status === 401) {
            dispatch(logout());
          }
        }
      }
    };

    checkProfile();
  }, [isAuthenticated, token]);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : user?.role === 'CLIENT' || user?.role === 'ADMIN' ? (
        <ClientNavigator />
      ) : (
        <CrewNavigator />
      )}
    </NavigationContainer>
  );
};
