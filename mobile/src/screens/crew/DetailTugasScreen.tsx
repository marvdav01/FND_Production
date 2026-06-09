import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TIMELINE = [
  { label: 'Briefing', time: 'Sebelum event', done: true },
  { label: 'Setup Alat', time: 'H-1 / H', done: true },
  { label: 'Sound / Lighting Check', time: 'Sebelum mulai', done: false },
  { label: 'Event Berlangsung', time: 'On site', done: false },
  { label: 'Pembongkaran', time: 'Selesai Event', done: false },
];

export const DetailTugasScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const event = route?.params?.event || {};

  return (
    <View className="flex-1 bg-white">
      <View className="relative h-48 bg-primary px-6 justify-end pb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-12 left-4 bg-white/90 p-2 rounded-full"
          style={{ elevation: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View className="absolute top-12 right-4 bg-emerald-500 px-4 py-1.5 rounded-full">
          <Text className="text-white font-bold text-xs">{event.status || 'Assigned'}</Text>
        </View>
        <Text className="text-white text-3xl font-black">FND</Text>
        <Text className="text-blue-100 text-xs mt-1">Crew Assignment</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-5">
          <Text className="text-primary text-2xl font-bold mb-4">{event.name || 'Detail Tugas'}</Text>

          <View className="flex-row items-start mb-2">
            <Ionicons name="location-outline" size={18} color="#64748B" />
            <View className="ml-2">
              <Text className="text-primary font-semibold text-sm">{event.location || '-'}</Text>
              <Text className="text-slate-400 text-xs">{event.notes || 'Tidak ada catatan tambahan'}</Text>
            </View>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={18} color="#64748B" />
            <Text className="text-slate-600 text-sm ml-2">{event.event_date || '-'}</Text>
          </View>
          <View className="flex-row items-center mb-6">
            <Ionicons name="construct-outline" size={18} color="#64748B" />
            <Text className="text-slate-600 text-sm ml-2">Tugas: {event.task || 'Support'}</Text>
          </View>

          <View className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
            <Text className="text-slate-400 text-xs font-semibold mb-3 uppercase tracking-wider">Client</Text>
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">{String(event.client_name || 'C').charAt(0)}</Text>
              </View>
              <Text className="text-primary font-semibold">{event.client_name || '-'}</Text>
            </View>
          </View>

          <Text className="text-primary font-bold text-base mb-4">Timeline Pekerjaan</Text>
          <View className="mb-6">
            {TIMELINE.map((step, idx) => (
              <View key={idx} className="flex-row items-start mb-4">
                <View className="items-center mr-4 w-5">
                  <View className={`w-5 h-5 rounded-full items-center justify-center ${step.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {step.done && <Ionicons name="checkmark" size={12} color="white" />}
                  </View>
                  {idx < TIMELINE.length - 1 && (
                    <View className={`w-0.5 h-8 ${step.done ? 'bg-emerald-400' : 'bg-slate-200'} mt-1`} />
                  )}
                </View>
                <View className="flex-1 flex-row justify-between items-start pt-0.5">
                  <Text className={`font-semibold ${step.done ? 'text-primary' : 'text-slate-400'}`}>{step.label}</Text>
                  <Text className="text-slate-400 text-xs">{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-slate-100" style={{ elevation: 10 }}>
        <TouchableOpacity className="bg-primary w-full py-4 rounded-xl items-center">
          <Text className="text-white font-bold text-base">Update Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
