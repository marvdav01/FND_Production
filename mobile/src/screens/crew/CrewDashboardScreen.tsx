import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export const CrewDashboardScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-primary">
      {/* Header Dark Section */}
      <View style={{ paddingTop: insets.top + 20 }} className="px-6 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white font-bold tracking-wider">FND PRODUCTION</Text>
            <Text className="text-slate-400 text-xs">CREW APP</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('NotifikasiTab')}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
            <View className="absolute -top-1 -right-1 bg-danger w-3 h-3 rounded-full border-2 border-primary" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => navigation.navigate('Profil')}
        >
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
            className="w-12 h-12 rounded-full border border-slate-600"
          />
          <View className="ml-4 flex-1">
            <View className="flex-row items-center">
              <Text className="text-white text-lg font-bold">Halo, {user?.name || 'Andi Setiawan'} 👋</Text>
            </View>
            <Text className="text-slate-400 text-sm">Selamat bekerja, semangat hari ini!</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content Light Section */}
      <View className="flex-1 bg-white rounded-t-[32px] pt-6 px-6">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Tugas Hari Ini */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-primary font-bold text-lg">Tugas Hari Ini</Text>
            <Text className="text-slate-500 font-medium text-sm">2 Event</Text>
          </View>

          {/* Task Card 1 */}
          <TouchableOpacity 
            className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm"
            style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
            onPress={() => navigation.navigate('TugasTab', { screen: 'DetailTugas' })}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-primary font-bold text-base">Wedding Andi & Sinta</Text>
              <View className="bg-emerald-100 px-3 py-1 rounded-full">
                <Text className="text-emerald-600 font-bold text-xs">On Going</Text>
              </View>
            </View>
            
            <View className="flex-row items-center mb-1">
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text className="text-slate-500 text-xs ml-2">Gedung Graha Sarana</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text className="text-slate-500 text-xs ml-2">08.00 - Selesai</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={14} color="#64748B" />
              <Text className="text-slate-500 text-xs ml-2">Posisi: Sound Engineer</Text>
            </View>
          </TouchableOpacity>

          {/* Task Card 2 */}
          <TouchableOpacity 
            className="bg-white rounded-2xl p-4 mb-6 border border-slate-100 shadow-sm"
            style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
            onPress={() => navigation.navigate('TugasTab', { screen: 'DetailTugas' })}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-primary font-bold text-base">Corporate Gathering PT Maju</Text>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-600 font-bold text-xs">Persiapan</Text>
              </View>
            </View>
            
            <View className="flex-row items-center mb-1">
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text className="text-slate-500 text-xs ml-2">Hotel Grand Zuri</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text className="text-slate-500 text-xs ml-2">13.00 - 22.00</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={14} color="#64748B" />
              <Text className="text-slate-500 text-xs ml-2">Posisi: Audio Crew</Text>
            </View>
          </TouchableOpacity>

          {/* Ringkasan */}
          <Text className="text-primary font-bold text-lg mb-4">Ringkasan</Text>
          <View className="flex-row justify-between mb-6">
            <View className="bg-white items-center flex-1 py-4 rounded-xl border border-slate-100 mr-2 shadow-sm" style={{ elevation: 1 }}>
              <Text className="text-primary text-xl font-bold mb-1">12</Text>
              <Text className="text-slate-400 text-[10px] text-center">Tugas Selesai{"\n"}Bulan Ini</Text>
            </View>
            <View className="bg-white items-center flex-1 py-4 rounded-xl border border-slate-100 mr-2 shadow-sm" style={{ elevation: 1 }}>
              <Text className="text-primary text-xl font-bold mb-1">2</Text>
              <Text className="text-slate-400 text-[10px] text-center">Tugas Hari{"\n"}Ini</Text>
            </View>
            <View className="bg-white items-center flex-1 py-4 rounded-xl border border-slate-100 mr-2 shadow-sm" style={{ elevation: 1 }}>
              <Text className="text-primary text-xl font-bold mb-1">98%</Text>
              <Text className="text-slate-400 text-[10px] text-center">Kehadiran{"\n"}Tepat Waktu</Text>
            </View>
            <View className="bg-white items-center flex-1 py-4 rounded-xl border border-slate-100 shadow-sm" style={{ elevation: 1 }}>
              <Text className="text-primary text-xl font-bold mb-1">4.8</Text>
              <Text className="text-slate-400 text-[10px] text-center">Rating Kinerja{"\n"}/ 5.0</Text>
            </View>
          </View>

          {/* Pengumuman */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-primary font-bold text-lg">Pengumuman</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NotifikasiTab')}>
              <Text className="text-accent font-semibold text-sm">Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-orange-50 p-4 rounded-2xl flex-row items-start border border-orange-100 mb-6">
            <View className="bg-orange-100 p-2 rounded-lg mr-3 mt-1">
              <Ionicons name="megaphone" size={20} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-semibold mb-1 leading-5">
                Briefing crew untuk event besok jam 19.00 di basecamp FND Production.
              </Text>
              <Text className="text-slate-500 text-xs">30 Apr 2024 • Admin</Text>
            </View>
          </View>

        </ScrollView>
      </View>
    </View>
  );
};
