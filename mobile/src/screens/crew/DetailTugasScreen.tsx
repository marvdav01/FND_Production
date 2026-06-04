import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TIMELINE = [
  { label: 'Persiapan', time: '08:00', done: true },
  { label: 'Setup Alat', time: '09:00', done: true },
  { label: 'Sound Check', time: '11:00', done: true },
  { label: 'Event Berlangsung', time: '13:00', done: false },
  { label: 'Pembongkaran', time: 'Selesai Event', done: false },
];

export const DetailTugasScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">
      {/* Header Image */}
      <View className="relative">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80' }}
          className="w-full h-52"
          resizeMode="cover"
        />
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-12 left-4 bg-white/90 p-2 rounded-full"
          style={{ elevation: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        {/* Status Badge */}
        <View className="absolute top-12 right-4 bg-emerald-500 px-4 py-1.5 rounded-full">
          <Text className="text-white font-bold text-xs">On Going</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-5">
          <Text className="text-primary text-2xl font-bold mb-4">Wedding Andi & Sinta</Text>

          {/* Info Row */}
          <View className="flex-row items-start mb-2">
            <Ionicons name="location-outline" size={18} color="#64748B" />
            <View className="ml-2">
              <Text className="text-primary font-semibold text-sm">Gedung Graha Sarana</Text>
              <Text className="text-slate-400 text-xs">Jl. Merdeka No.123, Jakarta</Text>
            </View>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={18} color="#64748B" />
            <Text className="text-slate-600 text-sm ml-2">Sabtu, 11 Mei 2024 • 08.00 – Selesai</Text>
          </View>
          <View className="flex-row items-center mb-6">
            <Ionicons name="construct-outline" size={18} color="#64748B" />
            <Text className="text-slate-600 text-sm ml-2">Posisi: Sound Engineer</Text>
          </View>

          {/* PIC / Client */}
          <View className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
            <Text className="text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">PIC / Client</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">B</Text>
                </View>
                <Text className="text-primary font-semibold">Budi Kurniawan</Text>
              </View>
              <TouchableOpacity className="bg-emerald-500 p-2.5 rounded-full">
                <Ionicons name="call" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Timeline Pekerjaan */}
          <Text className="text-primary font-bold text-base mb-4">Timeline Pekerjaan</Text>
          <View className="mb-6">
            {TIMELINE.map((step, idx) => (
              <View key={idx} className="flex-row items-start mb-4">
                {/* Line + dot */}
                <View className="items-center mr-4 w-5">
                  <View className={`w-5 h-5 rounded-full items-center justify-center ${step.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {step.done && <Ionicons name="checkmark" size={12} color="white" />}
                  </View>
                  {idx < TIMELINE.length - 1 && (
                    <View className={`w-0.5 h-8 ${step.done ? 'bg-emerald-400' : 'bg-slate-200'} mt-1`} />
                  )}
                </View>
                {/* Label + time */}
                <View className="flex-1 flex-row justify-between items-start pt-0.5">
                  <Text className={`font-semibold ${step.done ? 'text-primary' : 'text-slate-400'}`}>{step.label}</Text>
                  <Text className="text-slate-400 text-xs">{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-slate-100" style={{ elevation: 10 }}>
        <TouchableOpacity className="bg-primary w-full py-4 rounded-xl items-center">
          <Text className="text-white font-bold text-base">Update Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
