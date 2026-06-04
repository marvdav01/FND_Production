import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const STATUS_STEPS = ['Menunggu Konfirmasi', 'Persiapan', 'Crew Ditugaskan', 'Sedang Berlangsung'];

export const DetailEventClientScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const currentStep = 2; // 0-indexed

  return (
    <View className="flex-1 bg-white">
      {/* Header Image */}
      <View className="relative">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=600&q=80' }}
          className="w-full h-52" resizeMode="cover"
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-12 left-4 bg-white/90 p-2 rounded-full"
          style={{ elevation: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View className="absolute top-12 right-4 bg-emerald-500 px-4 py-1.5 rounded-full">
          <Text className="text-white font-bold text-xs">On Going</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-5">
          <Text className="text-primary text-2xl font-bold mb-4">Wedding Andi & Sinta</Text>

          {/* Stepper */}
          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row items-center">
                {STATUS_STEPS.map((step, idx) => (
                  <View key={idx} className="flex-row items-center">
                    <View className="items-center">
                      <View className={`w-6 h-6 rounded-full items-center justify-center ${idx <= currentStep ? 'bg-accent' : 'bg-slate-200'}`}>
                        {idx < currentStep ? (
                          <Ionicons name="checkmark" size={12} color="white" />
                        ) : (
                          <Text className="text-white text-[8px] font-bold">{idx + 1}</Text>
                        )}
                      </View>
                      <Text className={`text-[8px] mt-1 w-16 text-center ${idx <= currentStep ? 'text-accent font-semibold' : 'text-slate-400'}`} numberOfLines={2}>
                        {step}
                      </Text>
                    </View>
                    {idx < STATUS_STEPS.length - 1 && (
                      <View className={`w-12 h-0.5 mb-4 ${idx < currentStep ? 'bg-accent' : 'bg-slate-200'}`} />
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Info */}
          <View className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Detail Event</Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={16} color="#64748B" />
              <Text className="text-primary font-semibold text-sm ml-2">11 Mei 2024 • 08.00 – Selesai</Text>
            </View>
            <View className="flex-row items-start mb-2">
              <Ionicons name="location-outline" size={16} color="#64748B" />
              <View className="ml-2">
                <Text className="text-primary font-semibold text-sm">Gedung Graha Sarana</Text>
                <Text className="text-slate-400 text-xs">Jl. Merdeka No.123, Jakarta</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={16} color="#64748B" />
              <Text className="text-primary font-semibold text-sm ml-2">500 Orang</Text>
            </View>
          </View>

          {/* Layanan Booking */}
          <View className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Layanan Dipesan</Text>
            {[
              { name: 'Sound System x1', price: 'Rp 3.500.000' },
              { name: 'Lighting x1', price: 'Rp 2.000.000' },
              { name: 'LED Videotron [P3] x2', price: 'Rp 9.000.000' },
            ].map((item, i) => (
              <View key={i} className="flex-row justify-between mb-2">
                <Text className="text-slate-600 text-sm">{item.name}</Text>
                <Text className="text-primary font-semibold text-sm">{item.price}</Text>
              </View>
            ))}
            <View className="h-px bg-slate-200 my-2" />
            <View className="flex-row justify-between">
              <Text className="text-primary font-bold">Total Estimasi</Text>
              <Text className="text-accent font-bold text-base">Rp 14.000.000</Text>
            </View>
          </View>

          {/* Informasi Booking */}
          <View className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Informasi Booking</Text>
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-slate-500 text-sm">No. Booking</Text>
              <Text className="text-primary font-semibold text-sm">FND-110524-001</Text>
            </View>
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-slate-500 text-sm">Tanggal Booking</Text>
              <Text className="text-primary font-semibold text-sm">11 Mei 2024</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-500 text-sm">Total Estimasi</Text>
              <Text className="text-primary font-semibold text-sm">Rp 14.000.000</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-slate-100 flex-row gap-3" style={{ elevation: 10 }}>
        <TouchableOpacity className="flex-1 border border-emerald-500 py-3.5 rounded-xl items-center flex-row justify-center">
          <Ionicons name="logo-whatsapp" size={18} color="#059669" />
          <Text className="text-emerald-600 font-bold ml-2">WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-primary py-3.5 rounded-xl items-center">
          <Text className="text-white font-bold">Lihat Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
