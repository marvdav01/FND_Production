import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';

const TABS = ['Semua', 'On Going', 'Selesai', 'Dibatalkan'];

const STATUS_MAP: Record<string, string> = {
  running: 'On Going',
  deal: 'On Going',
  done: 'Selesai',
  selesai: 'Selesai',
  cancel: 'Dibatalkan',
  pending: 'Semua',
  survey: 'Semua',
};

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  'On Going': { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  Selesai: { bg: 'bg-slate-100', text: 'text-slate-500' },
  Dibatalkan: { bg: 'bg-red-100', text: 'text-red-600' },
};

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

  const filtered = events.filter((e) => {
    if (activeTab === 'Semua') return true;
    const displayStatus = STATUS_MAP[e.status] || 'Semua';
    return displayStatus === activeTab;
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-b border-slate-100" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`mr-3 px-5 py-2 rounded-full ${activeTab === tab ? 'bg-primary' : 'bg-slate-100'}`}
          >
            <Text className={`font-semibold text-sm ${activeTab === tab ? 'text-white' : 'text-slate-500'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      >
        {filtered.map((event) => {
          const displayStatus = STATUS_MAP[event.status] || event.status || 'Semua';
          const statusStyle = STATUS_COLOR[displayStatus] || { bg: 'bg-slate-100', text: 'text-slate-500' };

          return (
            <TouchableOpacity
              key={event.id}
              className="bg-white rounded-3xl mb-5 border border-slate-100 overflow-hidden"
              style={{ elevation: 3, shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
              onPress={() => navigation.navigate('DetailEventClient', { eventId: event.id })}
            >
              <View className="h-24 bg-primary px-4 justify-center">
                <Text className="text-white font-black text-2xl">FND</Text>
                <Text className="text-blue-100 text-xs mt-1">{event.type || 'Event Production'}</Text>
              </View>

              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-primary font-bold text-base flex-1 mr-2">{event.name || event.title}</Text>
                  <View className={`${statusStyle.bg} px-3 py-1 rounded-full`}>
                    <Text className={`${statusStyle.text} font-bold text-[10px]`}>{displayStatus}</Text>
                  </View>
                </View>
                <View className="flex-row items-center mb-0.5">
                  <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs ml-1">{event.event_date || event.date}</Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <Ionicons name="location-outline" size={12} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs ml-1">{event.location}</Text>
                </View>

                {event.progress !== undefined && (
                  <View>
                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-slate-500 text-xs font-medium">Progress</Text>
                      <Text className="text-primary text-xs font-bold">{event.progress}%</Text>
                    </View>
                    <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <View className="h-full bg-accent rounded-full" style={{ width: `${event.progress}%` }} />
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && !loading && (
          <View className="items-center mt-20">
            <Text className="text-slate-500">Belum ada event untuk ditampilkan.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
