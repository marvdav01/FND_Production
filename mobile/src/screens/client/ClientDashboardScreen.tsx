import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QUICK_MENU = [
  { label: 'Booking\nEvent', icon: 'calendar', color: '#2563EB', bg: '#EFF6FF', screen: 'Booking' },
  { label: 'Layanan', icon: 'apps', color: '#059669', bg: '#ECFDF5', screen: 'Layanan' },
  { label: 'Galeri', icon: 'images', color: '#D97706', bg: '#FFFBEB', screen: 'EventSaya' },
  { label: 'Promo', icon: 'pricetag', color: '#DC2626', bg: '#FEF2F2', screen: 'Beranda' },
];

export const ClientDashboardScreen = ({ navigation }: any) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-primary">
      {/* Dark Header */}
      <View style={{ paddingTop: insets.top + 16 }} className="px-6 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <Ionicons name="menu" size={26} color="#FFFFFF" />
            <Text className="text-white font-bold text-base tracking-wider ml-3">FND PRODUCTION</Text>
          </View>
          <TouchableOpacity className="relative" onPress={() => navigation.navigate('Notifikasi')}>
            <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
            <View className="absolute -top-1 -right-1 bg-danger w-3.5 h-3.5 rounded-full items-center justify-center">
              <Text className="text-white text-[8px] font-bold">2</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} className="w-12 h-12 rounded-full border-2 border-slate-600" />
          <View className="ml-3">
            <Text className="text-white text-lg font-bold">Halo, {user?.name || 'Dinds'} 👋</Text>
            <Text className="text-slate-400 text-sm">Selamat datang kembali!</Text>
          </View>
        </View>
      </View>

      {/* White Bottom Section */}
      <View className="flex-1 bg-white rounded-t-[32px]">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}>

          {/* Wedding Package Banner */}
          <View className="rounded-3xl overflow-hidden mb-6" style={{ elevation: 4 }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=600&q=80' }}
              className="w-full h-40" resizeMode="cover"
            />
            <View className="absolute inset-0 bg-primary/60 px-5 py-5 justify-between">
              <View>
                <Text className="text-white font-bold text-xs tracking-widest uppercase">Wedding Package</Text>
                <Text className="text-white font-bold text-xl mt-1">Make Your Special Day{'\n'}More Perfect.</Text>
              </View>
              <TouchableOpacity className="bg-white self-start px-4 py-2 rounded-full" onPress={() => navigation.navigate('Layanan')}>
                <Text className="text-primary font-bold text-xs">Lihat Paket</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Menu */}
          <View className="flex-row justify-between mb-6">
            {QUICK_MENU.map((item) => (
              <TouchableOpacity key={item.label} className="items-center" onPress={() => navigation.navigate(item.screen)}>
                <View className="w-14 h-14 rounded-2xl items-center justify-center mb-2" style={{ backgroundColor: item.bg }}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text className="text-primary text-[10px] font-semibold text-center">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Event Saya */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-primary font-bold text-lg">Event Saya</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EventSaya')}>
              <Text className="text-accent font-semibold text-sm">Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-white rounded-2xl p-4 mb-6 border border-slate-100"
            style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}
            onPress={() => navigation.navigate('EventSaya')}
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-primary font-bold text-base">Wedding Andi & Sinta</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs ml-1">11 Mei 2024</Text>
                </View>
                <View className="flex-row items-center mt-0.5">
                  <Ionicons name="location-outline" size={12} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs ml-1">Gedung Graha Sarana</Text>
                </View>
              </View>
              <View className="bg-emerald-100 px-3 py-1 rounded-full">
                <Text className="text-emerald-600 font-bold text-xs">On Going</Text>
              </View>
            </View>
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-slate-500 text-xs font-medium">Progress</Text>
              <Text className="text-primary text-xs font-bold">79%</Text>
            </View>
            <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <View className="h-full bg-accent rounded-full" style={{ width: '79%' }} />
            </View>
          </TouchableOpacity>

          {/* Penawaran Spesial */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-primary font-bold text-lg">Penawaran Spesial</Text>
            <TouchableOpacity><Text className="text-accent font-semibold text-sm">Lihat Semua</Text></TouchableOpacity>
          </View>
          <View className="rounded-2xl p-4 border border-slate-700" style={{ backgroundColor: '#0F172A', elevation: 2 }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="bg-accent self-start px-2 py-0.5 rounded-full mb-2">
                  <Text className="text-white text-[10px] font-bold">PAKET WEDDING</Text>
                </View>
                <Text className="text-white font-bold text-base">Diskon Spesial</Text>
                <Text className="text-warning text-2xl font-bold">15%</Text>
                <Text className="text-slate-400 text-xs mt-1">Untuk paket Wedding Premium</Text>
              </View>
              <View className="w-24 h-24 rounded-xl overflow-hidden ml-4">
                <Image source={{ uri: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=200&q=80' }} className="w-full h-full" resizeMode="cover" />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
