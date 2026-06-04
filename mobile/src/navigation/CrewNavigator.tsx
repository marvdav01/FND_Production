import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

// Screens
import { CrewDashboardScreen } from '../screens/crew/CrewDashboardScreen';
import { TugasSayaScreen } from '../screens/crew/TugasSayaScreen';
import { CheckInScreen } from '../screens/crew/CheckInScreen';
import { DokumentasiScreen } from '../screens/crew/DokumentasiScreen';
import { RiwayatTugasScreen } from '../screens/crew/RiwayatTugasScreen';
import { NotifikasiCrewScreen } from '../screens/crew/NotifikasiCrewScreen';
import { ProfileCrewScreen } from '../screens/crew/ProfileCrewScreen';
import { DetailTugasScreen } from '../screens/crew/DetailTugasScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardHome" component={CrewDashboardScreen} />
    <Stack.Screen name="Notifikasi" component={NotifikasiCrewScreen} />
    <Stack.Screen name="DetailTugas" component={DetailTugasScreen} />
  </Stack.Navigator>
);

// Tugas Stack
const TugasStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TugasHome" component={TugasSayaScreen} />
    <Stack.Screen name="DetailTugas" component={DetailTugasScreen} />
    <Stack.Screen name="CheckIn" component={CheckInScreen} />
    <Stack.Screen name="Dokumentasi" component={DokumentasiScreen} />
  </Stack.Navigator>
);

// Riwayat Stack
const RiwayatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RiwayatHome" component={RiwayatTugasScreen} />
    <Stack.Screen name="DetailTugas" component={DetailTugasScreen} />
  </Stack.Navigator>
);

// Bottom Tab Navigator
export const CrewNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 12,
          shadowColor: '#0F172A',
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Beranda') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Tugas') iconName = focused ? 'briefcase' : 'briefcase-outline';
          else if (route.name === 'CheckIn') iconName = focused ? 'location' : 'location-outline';
          else if (route.name === 'Riwayat') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={DashboardStack} options={{ tabBarLabel: 'Beranda' }} />
      <Tab.Screen name="Tugas" component={TugasStack} options={{ tabBarLabel: 'Tugas Saya' }} />
      <Tab.Screen name="CheckIn" component={CheckInScreen} options={{ tabBarLabel: 'Check In' }} />
      <Tab.Screen name="Riwayat" component={RiwayatStack} options={{ tabBarLabel: 'Riwayat' }} />
      <Tab.Screen name="Profil" component={ProfileCrewScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
};
