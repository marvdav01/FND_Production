import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HISTORY = [
  {
    id: 1,
    title: 'Launch Produk XYZ',
    location: 'Balai Kartini, Jakarta',
    date: '6 Mei 2024',
    role: 'Posisi: Lighting Crew',
    status: 'Selesai',
    statusColor: 'bg-emerald-100',
    statusTextColor: 'text-emerald-600',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80',
  },
  {
    id: 2,
    title: 'Seminar Nasional 2024',
    location: 'Hotel Indonesia Kempinski',
    date: '29 April 2024',
    role: 'Posisi: Audio Crew',
    status: 'Selesai',
    statusColor: 'bg-emerald-100',
    statusTextColor: 'text-emerald-600',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=100&q=80',
  },
  {
    id: 3,
    title: 'Konser Band Merah',
    location: 'Istora Senayan',
    date: '20 April 2024',
    role: 'Posisi: Stage Crew',
    status: 'Dibatalkan',
    statusColor: 'bg-red-100',
    statusTextColor: 'text-red-600',
    rating: null,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100&q=80',
  },
  {
    id: 4,
    title: 'Pameran Otomotif 2024',
    location: 'Atilora Kemayoran',
    date: '15 April 2024',
    role: 'Posisi: Lighting Crew',
    status: 'Selesai',
    statusColor: 'bg-emerald-100',
    statusTextColor: 'text-emerald-600',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&q=80',
  },
];

export const RiwayatTugasScreen = () => {
  const [filter, setFilter] = useState('Semua');
  const [showFilter, setShowFilter] = useState(false);

  const FILTER_OPTIONS = ['Semua', 'Selesai', 'Dibatalkan'];
  const filtered = filter === 'Semua' ? HISTORY : HISTORY.filter(h => h.status === filter);

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <View className="flex-row items-center">
        <Ionicons name="star" size={14} color="#F59E0B" />
        <Text className="text-warning font-bold text-sm ml-1">{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Filter Dropdown Row */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
        <Text className="text-primary font-bold text-base">{filtered.length} Riwayat</Text>
        <TouchableOpacity
          onPress={() => setShowFilter(!showFilter)}
          className="flex-row items-center bg-slate-100 px-4 py-2 rounded-full"
        >
          <Text className="text-primary font-semibold text-sm mr-1">{filter}</Text>
          <Ionicons name={showFilter ? 'chevron-up' : 'chevron-down'} size={16} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Filter Menu */}
      {showFilter && (
        <View className="bg-white border border-slate-100 mx-6 rounded-xl shadow-md z-10" style={{ elevation: 8, position: 'absolute', top: 70, right: 16, minWidth: 140, zIndex: 100 }}>
          {FILTER_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              className={`px-4 py-3 border-b border-slate-50 ${opt === filter ? 'bg-blue-50' : ''}`}
              onPress={() => { setFilter(opt); setShowFilter(false); }}
            >
              <Text className={`font-semibold ${opt === filter ? 'text-accent' : 'text-primary'}`}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filtered.map(item => (
          <View
            key={item.id}
            className="bg-white rounded-2xl mb-4 border border-slate-100 overflow-hidden"
            style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
          >
            <View className="flex-row p-4">
              {/* Thumbnail */}
              <Image
                source={{ uri: item.image }}
                className="w-14 h-14 rounded-xl mr-4"
                resizeMode="cover"
              />
              {/* Info */}
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-primary font-bold text-base flex-1 mr-2" numberOfLines={1}>{item.title}</Text>
                  <View className={`${item.statusColor} px-2.5 py-1 rounded-full`}>
                    <Text className={`${item.statusTextColor} font-bold text-[10px]`}>{item.status}</Text>
                  </View>
                </View>
                <View className="flex-row items-center mb-0.5">
                  <Ionicons name="location-outline" size={12} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs ml-1" numberOfLines={1}>{item.location}</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs ml-1">{item.date}</Text>
                </View>
                <Text className="text-slate-500 text-xs mt-0.5">{item.role}</Text>
              </View>
            </View>

            {/* Bottom Rating Row */}
            {item.rating && (
              <View className="px-4 py-3 border-t border-slate-50 flex-row justify-between items-center">
                <Text className="text-slate-400 text-xs">Rating Kinerja</Text>
                {renderStars(item.rating)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


