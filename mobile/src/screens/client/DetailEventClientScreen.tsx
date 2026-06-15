import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, getAssetUrl } from '../../services/api';
import { formatCurrency, formatDate, getEventImage, getEventStatusMeta, getLocationParts } from '../../utils/fnd';

const STATUS_STEPS = ['Menunggu Konfirmasi', 'Persiapan', 'Crew Ditugaskan', 'Sedang Berlangsung', 'Selesai'];

export const DetailEventClientScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
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

  const status = getEventStatusMeta(event.status);
  const location = getLocationParts(event);
  const imageUrl = getAssetUrl(getEventImage(event)) || getEventImage(event);
  const total = Number(event.total_amount || 0);
  const paid = Number(event.paid_amount || 0);

  const contactWhatsApp = () => {
    const phone = event.client_phone || '6281234567890';
    Linking.openURL(`https://wa.me/${String(phone).replace(/^0/, '62')}`).catch(() => {
      Alert.alert('Gagal', 'Tidak dapat membuka WhatsApp.');
    });
  };

  return (
    <View className="flex-1 bg-primary">
      <View className="relative h-64">
        <Image source={{ uri: imageUrl }} className="h-full w-full" resizeMode="cover" />
        <View className="absolute inset-0 bg-black/35" />
        <View style={{ top: insets.top + 8 }} className="absolute left-4 right-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="h-10 w-10 items-center justify-center rounded-full bg-primary/40">
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="font-bold text-white">Detail Event</Text>
          <View className="rounded-md bg-emerald-500 px-3 py-1.5">
            <Text className="text-[10px] font-bold text-white">{status.clientLabel}</Text>
          </View>
        </View>
      </View>

      <View className="-mt-8 flex-1 rounded-t-[18px] bg-white">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 26, paddingBottom: 110 }}>
          <Text className="mb-2 text-2xl font-black text-primary">{event.name}</Text>
          <View className="mb-1 flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text className="ml-2 text-sm text-slate-600">{formatDate(event.event_date)} | 08.00 - Selesai</Text>
          </View>
          <View className="mb-6 flex-row items-start">
            <Ionicons name="location-outline" size={16} color="#64748B" style={{ marginTop: 2 }} />
            <View className="ml-2 flex-1">
              <Text className="text-sm font-semibold text-primary">{location.venue}</Text>
              <Text className="text-xs text-slate-500">{location.address}</Text>
            </View>
          </View>

          <Text className="mb-4 font-bold text-primary">Status Event</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            <View className="flex-row items-start">
              {STATUS_STEPS.map((step, index) => {
                const done = index < status.step || event.status === 'selesai';
                const active = index === status.step && event.status !== 'selesai';
                return (
                  <View key={step} className="flex-row items-start">
                    <View className="items-center">
                      <View className={`h-9 w-9 items-center justify-center rounded-full ${done ? 'bg-emerald-500' : active ? 'border-2 border-emerald-500 bg-emerald-50' : 'bg-slate-100'}`}>
                        {done ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : active ? <Ionicons name="document-text-outline" size={15} color="#10B981" /> : <Ionicons name="close-outline" size={15} color="#94A3B8" />}
                      </View>
                      <Text className={`mt-2 w-20 text-center text-[10px] leading-3 ${done || active ? 'font-semibold text-primary' : 'text-slate-400'}`}>{step}</Text>
                    </View>
                    {index < STATUS_STEPS.length - 1 ? <View className={`mt-4 h-px w-10 ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} /> : null}
                  </View>
                );
              })}
            </View>
          </ScrollView>

          <Text className="mb-3 font-bold text-primary">Informasi Booking</Text>
          <View className="mb-5 rounded-xl bg-slate-50 p-4">
            <View className="mb-3 flex-row justify-between">
              <Text className="text-xs text-slate-500">No. Booking</Text>
              <Text className="text-xs font-bold text-primary">FND-{String(event.id).padStart(6, '0')}</Text>
            </View>
            <View className="mb-3 flex-row justify-between">
              <Text className="text-xs text-slate-500">Tanggal Booking</Text>
              <Text className="text-xs font-bold text-primary">{formatDate(event.created_at || event.event_date)}</Text>
            </View>
            <View className="mb-3 flex-row justify-between">
              <Text className="text-xs text-slate-500">Total Estimasi</Text>
              <Text className="text-xs font-bold text-primary">{formatCurrency(total)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-slate-500">Terbayar</Text>
              <Text className="text-xs font-bold text-primary">{formatCurrency(paid)}</Text>
            </View>
          </View>

          {event.equipment?.length ? (
            <>
              <Text className="mb-3 font-bold text-primary">Layanan</Text>
              {event.equipment.map((item: any) => (
                <View key={`${item.id}-${item.name}`} className="mb-2 flex-row justify-between">
                  <Text className="text-sm text-slate-600">{item.name}</Text>
                  <Text className="text-sm font-semibold text-primary">x{item.quantity}</Text>
                </View>
              ))}
            </>
          ) : null}
        </ScrollView>

        <View className="absolute bottom-7 right-6">
          <TouchableOpacity className="h-14 w-14 items-center justify-center rounded-full bg-emerald-500" onPress={contactWhatsApp}>
            <Ionicons name="logo-whatsapp" size={27} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
