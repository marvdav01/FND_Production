import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootState } from '../../store';
import { api, getAssetUrl } from '../../services/api';
import { EmptyState, ProgressBar, StatusBadge } from '../../components/FndUi';
import { formatDate, getEventImage, getEventStatusMeta, getLocationParts, initials } from '../../utils/fnd';

const QUICK_MENU = [
  { label: 'Booking Event', icon: 'calendar-outline', screen: 'Booking' },
  { label: 'Layanan', icon: 'construct-outline', screen: 'Layanan' },
  { label: 'Galeri', icon: 'image-outline', screen: 'Layanan' },
  { label: 'Promo', icon: 'pricetag-outline', screen: 'Promo' },
];

export const ClientDashboardScreen = ({ navigation }: any) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const avatarUrl = getAssetUrl(user?.avatar_url);

  const fetchEvents = async () => {
    const response = await api.get('/events');
    if (response.data?.success) setEvents(response.data.data || []);
  };

  useEffect(() => {
    fetchEvents().catch(() => null);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents().catch(() => null);
    setRefreshing(false);
  };

  const latestEvent = events.find((event) => !['selesai', 'cancel'].includes(String(event.status).toLowerCase())) || events[0];
  const latestStatus = latestEvent ? getEventStatusMeta(latestEvent.status) : null;
  const latestLocation = latestEvent ? getLocationParts(latestEvent) : null;

  const goTo = (screen: string) => {
    if (screen === 'Layanan' || screen === 'Promo') {
      navigation.navigate('Layanan');
      return;
    }
    navigation.getParent()?.navigate(screen);
  };

  return (
    <View className="flex-1 bg-white">
      <View style={{ paddingTop: insets.top + 12 }} className="px-5 pb-4">
        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full">
            <Ionicons name="menu-outline" size={25} color="#0B1241" />
          </TouchableOpacity>
          <View className="flex-1 pl-2">
            <Text className="font-black tracking-wider text-primary">FND PRODUCTION</Text>
            <Text className="text-[10px] font-semibold text-slate-400">Creative Event Solution</Text>
          </View>
          <TouchableOpacity className="relative h-10 w-10 items-center justify-center rounded-full" onPress={() => navigation.navigate('Notifikasi')}>
            <Ionicons name="notifications-outline" size={23} color="#0B1241" />
            <View className="absolute right-1 top-1 h-4 w-4 items-center justify-center rounded-full bg-danger">
              <Text className="text-[9px] font-bold text-white">3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} className="h-11 w-11 rounded-full" />
          ) : (
            <View className="h-11 w-11 items-center justify-center rounded-full bg-slate-100">
              <Text className="font-bold text-primary">{initials(user?.name)}</Text>
            </View>
          )}
          <View className="ml-3">
            <Text className="text-base font-bold text-primary">Halo, {user?.name || 'Client'}</Text>
            <Text className="text-xs text-slate-500">Selamat datang kembali!</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 104 }}
      >
        <View className="mb-5 overflow-hidden rounded-xl bg-primary" style={{ elevation: 4, shadowColor: '#0F172A', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } }}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80' }} className="absolute h-full w-full opacity-55" resizeMode="cover" />
          <View className="min-h-[150px] justify-between p-5">
            <View>
              <Text className="text-xl font-black text-white">WEDDING PACKAGE</Text>
              <Text className="mt-2 text-xs leading-5 text-white/90">Make Your Special Day{"\n"}More Perfect</Text>
            </View>
            <TouchableOpacity className="self-start rounded-md bg-white px-4 py-2" onPress={() => goTo('Booking')}>
              <Text className="text-xs font-black text-primary">Lihat Paket</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6 flex-row justify-center">
          {[0, 1, 2, 3, 4].map((item) => (
            <View key={item} className={`mx-1 h-1.5 rounded-full ${item === 1 ? 'w-5 bg-primary' : 'w-1.5 bg-slate-300'}`} />
          ))}
        </View>

        <View className="mb-6 flex-row justify-between">
          {QUICK_MENU.map((item) => (
            <TouchableOpacity key={item.label} className="items-center" onPress={() => goTo(item.screen)}>
              <View className="mb-2 h-14 w-14 items-center justify-center rounded-xl border border-slate-100 bg-white" style={{ elevation: 2 }}>
                <Ionicons name={item.icon as any} size={24} color="#2563EB" />
              </View>
              <Text className="w-16 text-center text-[10px] font-semibold text-primary">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="font-bold text-primary">Event Saya</Text>
          <TouchableOpacity onPress={() => goTo('EventSaya')}>
            <Text className="text-xs font-bold text-accent">Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {latestEvent && latestStatus && latestLocation ? (
          <TouchableOpacity
            className="mb-6 flex-row rounded-xl border border-slate-100 bg-white p-3"
            style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
            onPress={() => navigation.getParent()?.navigate('EventSaya', { screen: 'DetailEventClient', params: { eventId: latestEvent.id } })}
          >
            <Image source={{ uri: getAssetUrl(getEventImage(latestEvent)) || getEventImage(latestEvent) }} className="mr-3 h-20 w-20 rounded-lg" resizeMode="cover" />
            <View className="flex-1">
              <View className="mb-2 flex-row items-start justify-between">
                <Text className="mr-2 flex-1 font-bold text-primary" numberOfLines={1}>{latestEvent.name}</Text>
                <StatusBadge label={latestStatus.clientLabel} bg={latestStatus.bg} text={latestStatus.text} />
              </View>
              <View className="mb-1 flex-row items-center">
                <Ionicons name="calendar-outline" size={13} color="#64748B" />
                <Text className="ml-1 text-xs text-slate-500">{formatDate(latestEvent.event_date)}</Text>
              </View>
              <View className="mb-3 flex-row items-center">
                <Ionicons name="location-outline" size={13} color="#64748B" />
                <Text className="ml-1 flex-1 text-xs text-slate-500" numberOfLines={1}>{latestLocation.venue}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="flex-1">
                  <ProgressBar progress={latestStatus.progress} />
                </View>
                <Text className="ml-2 text-xs font-bold text-primary">{latestStatus.progress}%</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View className="mb-6">
            <EmptyState icon="calendar-outline" title="Belum ada event" description="Booking event akan langsung masuk ke request dashboard admin." />
          </View>
        )}

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="font-bold text-primary">Penawaran Spesial</Text>
          <Text className="text-xs font-bold text-accent">Lihat Semua</Text>
        </View>
        <View className="mb-5 overflow-hidden rounded-xl bg-slate-100">
          <Image source={{ uri: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=80' }} className="absolute h-full w-full opacity-70" resizeMode="cover" />
          <View className="min-h-[132px] justify-center p-5">
            <Text className="text-xs font-black text-primary">PAKET WEDDING</Text>
            <Text className="mt-1 text-xs text-primary">Diskon hingga</Text>
            <Text className="text-4xl font-black text-primary">15%</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
