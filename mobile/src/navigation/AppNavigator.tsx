import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AuthNavigator } from './AuthNavigator';
import { ClientNavigator } from './ClientNavigator';
import { CrewNavigator } from './CrewNavigator';

export const AppNavigator = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : user?.role === 'CLIENT' ? (
        <ClientNavigator />
      ) : (
        <CrewNavigator />
      )}
    </NavigationContainer>
  );
};
