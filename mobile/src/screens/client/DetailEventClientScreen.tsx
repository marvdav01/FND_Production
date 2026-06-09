import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';

const STATUS_STEPS = ['Menunggu Konfirmasi', 'Persiapan', 'Crew Ditugaskan', 'Sedang Berlangsung'];

export const DetailEventClientScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { eventId } = route.params || {};
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      setLoading(true);
      try {
        const response = await api.get(`/events/${eventId}`);
        if (response.data?.success) {
          setEvent(response.data.data);
        } else {
          throw new Error(response.data?.error || 'Gagal memuat detail event');
        }
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.error || error.message || 'Gagal memuat event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading || !event) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const displayStatus = event.status || 'On Going';

  return (
    <View className="flex-1 bg-white">
      <View className="relative">
        <View className="w-full h-52 bg-primary px-6 justify-end pb-6">
          <Text className="text-white text-3xl font-black">FND</Text>
          <Text className="text-blue-100 text-xs mt-1">{event.type || 'Event Production'}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-12 left-4 bg-white/90 p-2 rounded-full"
          style={{ elevation: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View className="absolute top-12 right-4 bg-emerald-500 px-4 py-1.5 rounded-full">
          <Text className="text-white font-bold text-xs">{displayStatus}</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-5">
          <Text className="text-primary text-2xl font-bold mb-4">{event.name}</Text>

          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row items-center">
                {STATUS_STEPS.map((step, idx) => (
                  <View key={idx} className="flex-row items-center">
                    <View className="items-center">
                      <View className={`w-6 h-6 rounded-full items-center justify-center ${idx <= 2 ? 'bg-accent' : 'bg-slate-200'}`}>
                        {idx < 2 ? (
                          <Ionicons name="checkmark" size={12} color="white" />
                        ) : (
                          <Text className="text-white text-[8px] font-bold">{idx + 1}</Text>
                        )}
                      </View>
                      <Text className={`text-[8px] mt-1 w-16 text-center ${idx <= 2 ? 'text-accent font-semibold' : 'text-slate-400'}`} numberOfLines={2}>
                        {step}
                      </Text>
                    </View>
                    {idx < STATUS_STEPS.length - 1 && (
                      <View className={`w-12 h-0.5 mb-4 ${idx < 2 ? 'bg-accent' : 'bg-slate-200'}`} />
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Detail Event</Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={16} color="#64748B" />
              <Text className="text-primary font-semibold text-sm ml-2">{event.event_date}</Text>
            </View>
            <View className="flex-row items-start mb-2">
              <Ionicons name="location-outline" size={16} color="#64748B" />
              <View className="ml-2">
                <Text className="text-primary font-semibold text-sm">{event.location}</Text>
                <Text className="text-slate-400 text-xs">{event.notes || 'Tidak ada catatan tambahan'}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={16} color="#64748B" />
              <Text className="text-primary font-semibold text-sm ml-2">{event.client_name}</Text>
            </View>
          </View>

          <View className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Rincian Keuangan</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500 text-sm">Total Estimasi</Text>
              <Text className="text-primary font-semibold text-sm">Rp {event.total_amount?.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500 text-sm">DP</Text>
              <Text className="text-primary font-semibold text-sm">Rp {event.dp_amount?.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-500 text-sm">Terbayar</Text>
              <Text className="text-primary font-semibold text-sm">Rp {event.paid_amount?.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
