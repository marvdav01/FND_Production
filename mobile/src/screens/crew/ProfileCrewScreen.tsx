import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, getAssetUrl } from '../../services/api';

const MENU_ITEMS = [
  { label: 'Data Pribadi', icon: 'person-outline' },
  { label: 'Keahlian', desc: 'Sound System, Mixing, Zudio Recording', icon: 'construct-outline' },
  { label: 'Rekening Pembayaran', icon: 'card-outline' },
  { label: 'Pengaturan Akun', icon: 'settings-outline' },
];

export const ProfileCrewScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();
  const avatarUrl = getAssetUrl(user?.avatar_url);

  const handleLogout = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    await api.post('/auth/logout', { refreshToken }).catch(() => null);
    dispatch(logout());
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Profile Header Card */}
      <View className="bg-white mx-4 mt-4 rounded-3xl p-6 items-center shadow-sm border border-slate-100" style={{ elevation: 2 }}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : require('../../../assets/icon.png')}
          className="w-24 h-24 rounded-full border-4 border-accent mb-4"
        />
        <Text className="text-primary text-xl font-bold mb-0.5">{user?.name || 'Andi Setiawan'}</Text>
        <View className="flex-row items-center mb-1">
          <Ionicons name="construct-outline" size={14} color="#64748B" />
          <Text className="text-slate-500 text-sm ml-1">Sound Engineer</Text>
        </View>
        <View className="flex-row items-center mb-1">
          <Ionicons name="call-outline" size={14} color="#64748B" />
          <Text className="text-slate-500 text-sm ml-1">{user?.phone || 'Belum diatur'}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="mail-outline" size={14} color="#64748B" />
          <Text className="text-slate-500 text-sm ml-1">{user?.email || 'andi.setiawan@mail.com'}</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View className="mx-4 mt-4 flex-row">
        <View className="flex-1 bg-white rounded-2xl py-4 items-center mr-2 border border-slate-100 shadow-sm" style={{ elevation: 1 }}>
          <Text className="text-primary text-xl font-bold">3 Tahun</Text>
          <Text className="text-slate-400 text-xs mt-1">Pengalaman</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl py-4 items-center mr-2 border border-slate-100 shadow-sm" style={{ elevation: 1 }}>
          <Text className="text-primary text-xl font-bold">4.8 / 5.0</Text>
          <Text className="text-slate-400 text-xs mt-1">Rating</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl py-4 items-center border border-slate-100 shadow-sm" style={{ elevation: 1 }}>
          <Text className="text-primary text-xl font-bold">26 Event</Text>
          <Text className="text-slate-400 text-xs mt-1">Total Selesai</Text>
        </View>
      </View>

      {/* Menu List */}
      <View className="bg-white mx-4 mt-4 rounded-3xl overflow-hidden border border-slate-100 shadow-sm" style={{ elevation: 2 }}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`flex-row items-center px-5 py-4 ${index < MENU_ITEMS.length - 1 ? 'border-b border-slate-50' : ''}`}
          >
            <View className="w-9 h-9 bg-slate-100 rounded-xl items-center justify-center mr-4">
              <Ionicons name={item.icon as any} size={20} color="#0F172A" />
            </View>
            <View className="flex-1">
              <Text className="text-primary font-semibold">{item.label}</Text>
              {item.desc && <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>{item.desc}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Keluar */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-white mx-4 mt-4 rounded-2xl px-5 py-4 flex-row items-center border border-red-100"
        style={{ elevation: 1 }}
      >
        <View className="w-9 h-9 bg-red-50 rounded-xl items-center justify-center mr-4">
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </View>
        <Text className="text-danger font-semibold flex-1">Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};



