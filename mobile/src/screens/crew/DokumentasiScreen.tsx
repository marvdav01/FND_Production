import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = ['Foto', 'Video'];

const FOTO_ITEMS = [
  { id: 1, uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=80' },
  { id: 2, uri: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&q=80' },
  { id: 3, uri: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80' },
  { id: 4, uri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&q=80' },
  { id: 5, uri: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&q=80' },
  { id: 6, uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&q=80' },
];

const VIDEO_ITEMS = [
  { id: 1, uri: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&q=80', duration: '2:34' },
  { id: 2, uri: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=300&q=80', duration: '5:12' },
];

export const DokumentasiScreen = () => {
  const [activeTab, setActiveTab] = useState('Foto');

  const handleUpload = () => {
    Alert.alert('Upload Foto/Video', 'Pilih sumber:', [
      { text: 'Kamera', onPress: () => {} },
      { text: 'Galeri', onPress: () => {} },
      { text: 'Batal', style: 'cancel' },
    ]);
  };

  const items = activeTab === 'Foto' ? FOTO_ITEMS : VIDEO_ITEMS;

  return (
    <View className="flex-1 bg-white">
      {/* Foto / Video Tabs */}
      <View className="flex-row px-6 py-4 border-b border-slate-100">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`mr-6 pb-2 border-b-2 ${activeTab === tab ? 'border-accent' : 'border-transparent'}`}
          >
            <Text className={`font-semibold text-base ${activeTab === tab ? 'text-accent' : 'text-slate-400'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Label "Foto Terakhir" */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-primary font-bold text-base">
            {activeTab === 'Foto' ? 'Foto Terakhir' : 'Video Terakhir'}
          </Text>
        </View>

        {/* Grid galeri 3 kolom */}
        <View className="flex-row flex-wrap px-4">
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="w-[31%] mx-[1%] mb-2 rounded-xl overflow-hidden"
              style={{ aspectRatio: 1 }}
            >
              <Image
                source={{ uri: item.uri }}
                className="w-full h-full"
                resizeMode="cover"
              />
              {/* Video play icon overlay */}
              {'duration' in item && (
                <View className="absolute inset-0 bg-black/30 items-center justify-center">
                  <View className="bg-white/90 w-8 h-8 rounded-full items-center justify-center">
                    <Ionicons name="play" size={14} color="#0F172A" />
                  </View>
                  <Text className="text-white text-[10px] mt-1 font-bold">{(item as any).duration}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Upload Section */}
        <View className="mx-6 mt-4">
          <Text className="text-primary font-bold text-base mb-3">Upload Foto Baru</Text>
          <TouchableOpacity
            onPress={handleUpload}
            className="border-2 border-dashed border-slate-200 rounded-2xl py-8 items-center justify-center bg-slate-50"
          >
            <View className="bg-slate-200 w-12 h-12 rounded-full items-center justify-center mb-3">
              <Ionicons name="add" size={28} color="#64748B" />
            </View>
            <Text className="text-slate-600 font-semibold">Pilih Foto</Text>
            <Text className="text-slate-400 text-xs mt-1">Maks. 5MB / file, .jpg .png</Text>
          </TouchableOpacity>
        </View>

        {/* Info text */}
        <View className="mx-6 mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <Text className="text-blue-700 text-xs leading-5 text-center">
            📸 Dokumentasi akan membantu laporan pekerjaan dan evaluasi kualitas event.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

