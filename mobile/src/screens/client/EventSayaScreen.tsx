import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = ['Semua', 'On Going', 'Selesai', 'Dibatalkan'];

const EVENTS = [
  {
    id: 1, title: 'Wedding Andi & Sinta',
    date: '11 Mei 2024', time: '08.00 – Selesai',
    location: 'Gedung Graha Sarana, Jakarta',
    status: 'On Going', statusBg: 'bg-emerald-100', statusText: 'text-emerald-600',
    progress: 79,
    image: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=400&q=80',
  },
  {
    id: 2, title: 'Corporate Gathering PT Maju',
    date: '26 Jun 2024', time: '13.00 – 22.00',
    location: 'Hotel Grand Zuri, Jakarta',
    status: 'On Going', statusBg: 'bg-blue-100', statusText: 'text-blue-600',
    progress: 20,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80',
  },
  {
    id: 3, title: 'Seminar Nasional 2024',
    date: '10 Apr 2024',
    location: 'Hotel Indonesia Kempinski',
    status: 'Selesai', statusBg: 'bg-emerald-100', statusText: 'text-emerald-600',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
  },
];

export const EventSayaScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('Semua');
  const filtered = EVENTS.filter(e => activeTab === 'Semua' || e.status === activeTab);

  return (
    <View className="flex-1 bg-white">
      {/* Tabs */}
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

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filtered.map((event) => (
          <TouchableOpacity
            key={event.id}
            className="bg-white rounded-3xl mb-5 border border-slate-100 overflow-hidden"
            style={{ elevation: 3, shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
            onPress={() => navigation.navigate('DetailEvent', { eventId: event.id })}
          >
            {/* Image */}
            <Image source={{ uri: event.image }} className="w-full h-36" resizeMode="cover" />

            <View className="p-4">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-primary font-bold text-base flex-1 mr-2">{event.title}</Text>
                <View className={`${event.statusBg} px-3 py-1 rounded-full`}>
                  <Text className={`${event.statusText} font-bold text-[10px]`}>{event.status}</Text>
                </View>
              </View>
              <View className="flex-row items-center mb-0.5">
                <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                <Text className="text-slate-400 text-xs ml-1">{event.date} {event.time ? `• ${event.time}` : ''}</Text>
              </View>
              <View className="flex-row items-center mb-3">
                <Ionicons name="location-outline" size={12} color="#94A3B8" />
                <Text className="text-slate-400 text-xs ml-1">{event.location}</Text>
              </View>

              {/* Progress */}
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
        ))}
      </ScrollView>
    </View>
  );
};
