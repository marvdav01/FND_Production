import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, getAssetUrl } from '../../services/api';
import { EmptyState, FndHeader, ProgressBar, StatusBadge } from '../../components/FndUi';
import { formatDate, getEventImage, getEventStatusMeta, getLocationParts } from '../../utils/fnd';

const TABS = ['Semua', 'On Going', 'Selesai', 'Dibatalkan'];

export const EventSayaScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('Semua');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await api.get('/events');
      if (response.data?.success) {
        setEvents(response.data.data || []);
      } else {
        throw new Error(response.data?.error || 'Gagal memuat event');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || error.message || 'Gagal mengambil data event');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents(true);
    setRefreshing(false);
  };

  const filtered = events.filter((event) => {
    if (activeTab === 'Semua') return true;
    return getEventStatusMeta(event.status).eventTab === activeTab;
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FndHeader title="Event Saya" onBack={() => navigation.getParent()?.navigate('Beranda')} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-[58px]" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`mr-2 rounded-md px-5 py-3 ${activeTab === tab ? 'bg-primary' : 'bg-slate-100'}`}
          >
            <Text className={`text-xs font-bold ${activeTab === tab ? 'text-white' : 'text-slate-500'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 104 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      >
        {filtered.length === 0 ? (
          <EmptyState icon="calendar-outline" title="Belum ada event" description="Booking baru akan muncul di sini setelah berhasil dikirim." />
        ) : (
          filtered.map((event) => {
            const status = getEventStatusMeta(event.status);
            const location = getLocationParts(event);
            const image = getAssetUrl(getEventImage(event)) || getEventImage(event);

            return (
              <TouchableOpacity
                key={event.id}
                className="mb-4 flex-row rounded-xl border border-slate-100 bg-white p-3"
                style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                onPress={() => navigation.navigate('DetailEventClient', { eventId: event.id })}
              >
                <Image source={{ uri: image }} className="mr-3 h-24 w-24 rounded-lg" resizeMode="cover" />
                <View className="flex-1">
                  <View className="mb-2 flex-row items-start justify-between">
                    <Text className="mr-2 flex-1 font-bold text-primary" numberOfLines={1}>{event.name}</Text>
                    <StatusBadge label={status.clientLabel} bg={status.bg} text={status.text} />
                  </View>
                  <View className="mb-1 flex-row items-center">
                    <Ionicons name="calendar-outline" size={13} color="#64748B" />
                    <Text className="ml-1 text-xs text-slate-500">{formatDate(event.event_date)}</Text>
                  </View>
                  <View className="mb-3 flex-row items-center">
                    <Ionicons name="location-outline" size={13} color="#64748B" />
                    <Text className="ml-1 flex-1 text-xs text-slate-500" numberOfLines={1}>{location.venue}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <ProgressBar progress={status.progress} />
                    </View>
                    <Text className="ml-2 text-xs font-bold text-primary">{status.progress}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};
