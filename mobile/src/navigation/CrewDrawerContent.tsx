import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CrewDrawerContent = (props: any) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  const menuItems = [
    { name: 'Beranda', icon: 'home-outline', route: 'BerandaTab' },
    { name: 'Tugas Saya', icon: 'briefcase-outline', route: 'TugasTab' },
    { name: 'Check-In', icon: 'location-outline', route: 'CheckInTab' },
    { name: 'Dokumentasi', icon: 'images-outline', route: 'DokumentasiTab' },
    { name: 'Riwayat Tugas', icon: 'time-outline', route: 'RiwayatTugas' },
    { name: 'Notifikasi', icon: 'notifications-outline', route: 'NotifikasiTab', badge: 2 },
    { name: 'Profil Saya', icon: 'person-outline', route: 'ProfilTab' },
  ];

  const bottomMenuItems = [
    { name: 'Pengaturan', icon: 'settings-outline' },
    { name: 'Bantuan', icon: 'help-circle-outline' },
  ];

  return (
    <View className="flex-1 bg-primary">
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: insets.top }}>
        {/* Header Drawer */}
        <View className="px-6 pt-4 pb-8 border-b border-secondary">
          <View className="flex-row items-center mb-6">
            <Ionicons name="apps" size={24} color="#FFFFFF" className="mr-2" />
            <Text className="text-white text-xl font-bold tracking-wider">FND</Text>
            <Text className="text-white text-xl font-light tracking-wider"> PRODUCTION</Text>
          </View>
          
          <View className="flex-row items-center">
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
              className="w-14 h-14 rounded-full border-2 border-accent"
            />
            <View className="ml-4">
              <Text className="text-white text-lg font-bold">Andi Setiawan</Text>
              <Text className="text-slate-400 text-sm">Sound Engineer</Text>
            </View>
          </View>
        </View>

        {/* Main Menu */}
        <View className="px-4 py-6">
          {menuItems.map((item, index) => {
            // Check if active (rough check based on current route name)
            const isActive = props.state.routes[props.state.index].name === item.route;
            
            return (
              <TouchableOpacity 
                key={index} 
                className={`flex-row items-center px-4 py-3.5 mb-2 rounded-xl ${isActive ? 'bg-secondary' : ''}`}
                onPress={() => props.navigation.navigate(item.route)}
              >
                <Ionicons name={item.icon as any} size={22} color={isActive ? '#FFFFFF' : '#94A3B8'} />
                <Text className={`ml-4 text-base ${isActive ? 'text-white font-semibold' : 'text-slate-400 font-medium'}`}>
                  {item.name}
                </Text>
                {item.badge && (
                  <View className="absolute right-4 bg-danger rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-white text-xs font-bold">{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Menu */}
        <View className="px-4 py-4 border-t border-secondary mt-4">
          {bottomMenuItems.map((item, index) => (
            <TouchableOpacity key={index} className="flex-row items-center px-4 py-3.5 mb-1">
              <Ionicons name={item.icon as any} size={22} color="#94A3B8" />
              <Text className="ml-4 text-base text-slate-400 font-medium">{item.name}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            className="flex-row items-center px-4 py-3.5 mt-2"
            onPress={() => dispatch(logout())}
          >
            <Ionicons name="log-out-outline" size={22} color="#94A3B8" />
            <Text className="ml-4 text-base text-slate-400 font-medium">Keluar</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};
