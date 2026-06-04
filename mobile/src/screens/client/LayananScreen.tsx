import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 0, label: 'Semua' },
  { id: 1, label: 'Sound System' },
  { id: 2, label: 'Lighting' },
  { id: 3, label: 'LED Videotron' },
  { id: 4, label: 'Panggung' },
  { id: 5, label: 'Multimedia' },
  { id: 6, label: 'Live Streaming' },
  { id: 7, label: 'Genset' },
  { id: 8, label: 'Rigging' },
];

const SERVICES = [
  { id: 1, category: 'Sound System', name: 'Sound System', desc: 'Sound system profesional untuk event indoor & outdoor', price: 'Mulai dari\nRp 3.500.000', image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=300&q=80' },
  { id: 2, category: 'Lighting', name: 'Lighting', desc: 'Lighting panggung & dekorasi indoor outdoor', price: 'Mulai dari\nRp 2.000.000', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=80' },
  { id: 3, category: 'LED Videotron', name: 'LED Videotron', desc: 'Indoor & outdoor, resolusi tinggi full-color', price: 'Mulai dari\nRp 4.500.000', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80' },
  { id: 4, category: 'Panggung', name: 'Panggung', desc: 'Berbagai ukuran untuk semua jenis acara', price: 'Mulai dari\nRp 3.000.000', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80' },
  { id: 5, category: 'Live Streaming', name: 'Live Streaming', desc: 'Multi-camera, streaming HD ke semua platform', price: 'Mulai dari\nRp 2.500.000', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&q=80' },
  { id: 6, category: 'Multimedia', name: 'Multimedia', desc: 'TV, Screen, LCD, proyektor profesional', price: 'Mulai dari\nRp 1.600.000', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80' },
];

export const LayananScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  const filtered = SERVICES.filter(s =>
    (activeCategory === 'Semua' || s.category === activeCategory) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      {/* Search Header */}
      <View className="px-6 py-4 border-b border-slate-100">
        <View className="flex-row items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-3 text-primary text-sm"
            placeholder="Cari layanan..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View className="flex-1 flex-row">
        {/* Left: Category Sidebar */}
        <ScrollView className="w-28 border-r border-slate-100 bg-slate-50" showsVerticalScrollIndicator={false}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.label)}
              className={`py-4 px-3 border-l-4 ${activeCategory === cat.label ? 'border-accent bg-white' : 'border-transparent'}`}
            >
              <Text className={`text-xs font-semibold text-center leading-4 ${activeCategory === cat.label ? 'text-accent' : 'text-slate-500'}`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Right: Service List */}
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View className="py-10 items-center"><Text className="text-slate-400">Tidak ditemukan</Text></View>
          ) : (
            filtered.map((service) => (
              <TouchableOpacity
                key={service.id}
                className="bg-white rounded-2xl mb-4 border border-slate-100 overflow-hidden"
                style={{ elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}
                onPress={() => navigation.navigate('Booking')}
              >
                <Image source={{ uri: service.image }} className="w-full h-32" resizeMode="cover" />
                <View className="p-3">
                  <Text className="text-primary font-bold text-sm mb-0.5">{service.name}</Text>
                  <Text className="text-slate-400 text-[10px] leading-4 mb-2">{service.desc}</Text>
                  <Text className="text-accent font-bold text-xs leading-4">{service.price}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};
