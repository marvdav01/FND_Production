import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, getAssetUrl } from '../../services/api';

const QUICK_MENU = [
  { label: 'Booking\nEvent', icon: 'calendar', color: '#2563EB', bg: '#EFF6FF', screen: 'Booking' },
  { label: 'Layanan', icon: 'apps', color: '#059669', bg: '#ECFDF5', screen: 'Layanan' },
  { label: 'Event\nSaya', icon: 'albums', color: '#D97706', bg: '#FFFBEB', screen: 'EventSaya' },
  { label: 'Invoice', icon: 'receipt', color: '#DC2626', bg: '#FEF2F2', screen: 'Invoice' },
];

const STATUS_MAP: Record<string, string> = {
  running: 'On Going',
  deal: 'On Going',
  selesai: 'Selesai',
  cancel: 'Dibatalkan',
  pending: 'Pending',
  survey: 'Survey',
};

export const ClientDashboardScreen = ({ navigation }: any) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const avatarUrl = getAssetUrl(user?.avatar_url);

  const fetchEvents = async () => {
    const response = await api.get('/events');
    if (response.data?.success) {
      setEvents(response.data.data || []);
    }
  };

  useEffect(() => {
    fetchEvents().catch(() => null);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents().catch(() => null);
    setRefreshing(false);
  };

  const latestEvent = events[0];
  const activeCount = events.filter((event) => ['pending', 'survey', 'deal', 'running'].includes(event.status)).length;

  return (
    <View className="flex-1 bg-primary">
      <View style={{ paddingTop: insets.top + 16 }} className="px-6 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <Ionicons name="menu" size={26} color="#FFFFFF" />
            <Text className="text-white font-bold text-base tracking-wider ml-3">FND PRODUCTION</Text>
          </View>
          <TouchableOpacity className="relative" onPress={() => navigation.navigate('Notifikasi')}>
            <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <Image source={avatarUrl ? { uri: avatarUrl } : require('../../../assets/icon.png')} className="w-12 h-12 rounded-full border-2 border-slate-600" />
          <View className="ml-3">
            <Text className="text-white text-lg font-bold">Halo, {user?.name || 'Client'}</Text>
            <Text className="text-slate-400 text-sm">{activeCount} event aktif</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-[32px]">
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}
        >
          <View className="rounded-3xl overflow-hidden mb-6 bg-primary" style={{ elevation: 4 }}>
            <View className="px-5 py-5 min-h-[150px] justify-between">
              <View>
                <Text className="text-white font-bold text-xs tracking-widest uppercase">Event Production</Text>
                <Text className="text-white font-bold text-xl mt-1">Booking lighting, sound,{'\n'}dan crew dalam satu sistem.</Text>
              </View>
              <TouchableOpacity className="bg-white self-start px-4 py-2 rounded-full" onPress={() => navigation.navigate('Booking')}>
                <Text className="text-primary font-bold text-xs">Booking Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>

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

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-primary font-bold text-lg">Event Terbaru</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EventSaya')}>
              <Text className="text-accent font-semibold text-sm">Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {latestEvent ? (
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 mb-6 border border-slate-100"
              style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}
              onPress={() => navigation.navigate('EventSaya')}
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-primary font-bold text-base">{latestEvent.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                    <Text className="text-slate-400 text-xs ml-1">{latestEvent.event_date}</Text>
                  </View>
                  <View className="flex-row items-center mt-0.5">
                    <Ionicons name="location-outline" size={12} color="#94A3B8" />
                    <Text className="text-slate-400 text-xs ml-1">{latestEvent.location}</Text>
                  </View>
                </View>
                <View className="bg-emerald-100 px-3 py-1 rounded-full">
                  <Text className="text-emerald-600 font-bold text-xs">{STATUS_MAP[latestEvent.status] || latestEvent.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100 items-center">
              <Ionicons name="calendar-outline" size={40} color="#CBD5E1" />
              <Text className="text-primary font-bold mt-3">Belum ada event</Text>
              <Text className="text-slate-400 text-sm mt-1 text-center">Mulai booking untuk membuat request ke dashboard admin.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};
