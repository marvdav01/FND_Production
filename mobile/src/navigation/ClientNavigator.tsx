import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ClientDashboardScreen } from '../screens/client/ClientDashboardScreen';
import { BookingScreen } from '../screens/client/BookingScreen';
import { EventSayaScreen } from '../screens/client/EventSayaScreen';
import { DetailEventClientScreen } from '../screens/client/DetailEventClientScreen';
import { InvoiceScreen } from '../screens/client/InvoiceScreen';
import { ProfileClientScreen } from '../screens/client/ProfileClientScreen';
import { LayananScreen } from '../screens/client/LayananScreen';
import { NotifikasiClientScreen } from '../screens/client/NotifikasiClientScreen';
import { EditProfileScreen } from '../screens/client/EditProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const EventStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Beranda Stack to handle Client Dashboard and Notifications
const BerandaStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BerandaHome" component={ClientDashboardScreen} />
    <Stack.Screen name="Notifikasi" component={NotifikasiClientScreen} />
  </Stack.Navigator>
);

const EventStackNavigator = () => (
  <EventStack.Navigator screenOptions={{ headerShown: false }}>
    <EventStack.Screen name="EventSayaList" component={EventSayaScreen} />
    <EventStack.Screen name="DetailEventClient" component={DetailEventClientScreen} />
  </EventStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileClientScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
  </ProfileStack.Navigator>
);

export const ClientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          paddingBottom: 8,
          paddingTop: 8,
          height: 68,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
            Beranda: focused ? 'home' : 'home-outline',
            Layanan: focused ? 'grid' : 'grid-outline',
            Booking: focused ? 'calendar' : 'calendar-outline',
            EventSaya: focused ? 'albums' : 'albums-outline',
            Invoice: focused ? 'receipt' : 'receipt-outline',
            Profil: focused ? 'person' : 'person-outline',
          };
          const iconName = icons[route.name] ?? 'ellipse-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={BerandaStack} />
      <Tab.Screen name="Layanan" component={LayananScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="EventSaya" component={EventStackNavigator} options={{ title: 'Event Saya' }} />
      <Tab.Screen name="Invoice" component={InvoiceScreen} />
      <Tab.Screen name="Profil" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};
