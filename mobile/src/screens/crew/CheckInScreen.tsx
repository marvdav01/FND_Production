import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CheckStatus = 'idle' | 'checkedIn' | 'checkedOut';

export const CheckInScreen = () => {
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleCheckIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStatus('checkedIn');
      setIsLoading(false);
      Alert.alert('Check-In Berhasil!', `Kehadiran Anda telah diverifikasi otomatis.`);
    }, 1500);
  };

  const handleCheckOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStatus('checkedOut');
      setIsLoading(false);
      Alert.alert('Check-Out Berhasil!', `Terima kasih! Waktu selesai bertugas telah dicatat.`);
    }, 1500);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Map Background (Full Top Half) */}
      <View className="flex-1 bg-blue-50 relative">
        <Image 
          source={{ uri: 'https://cdn.dribbble.com/users/189254/screenshots/11267448/media/c6eec4e1f7278d91c13cb77a166be4e3.png' }}
          className="w-full h-full opacity-70"
          resizeMode="cover"
        />
        {/* Custom Marker in Center Map */}
        <View className="absolute top-1/2 left-1/2 -ml-6 -mt-12 items-center">
          <View className="bg-blue-100 p-2 rounded-full mb-1">
             <View className="bg-primary w-4 h-4 rounded-full" />
          </View>
          <Ionicons name="location" size={40} color="#2563EB" className="-mt-4" />
        </View>

        {/* Current Location Button */}
        <TouchableOpacity className="absolute bottom-6 right-4 bg-white p-3 rounded-full shadow-lg" style={{ elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
          <Ionicons name="locate" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Bottom Card Overlay */}
      <View className="bg-white rounded-t-3xl -mt-4 px-6 pt-6 pb-20 shadow-lg" style={{ elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: -10 } }}>
        <Text className="text-primary font-bold text-xl mb-1">Wedding Andi & Sinta</Text>
        
        <View className="flex-row items-start mb-6">
          <Ionicons name="location-outline" size={16} color="#64748B" className="mt-0.5 mr-2" />
          <View>
            <Text className="text-primary text-sm font-semibold">Gedung Graha Sarana</Text>
            <Text className="text-slate-500 text-xs">Jl. Merdeka No. 123, Jakarta</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-slate-700 font-bold">Status</Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className={`font-bold mr-1 ${status === 'idle' ? 'text-primary' : status === 'checkedIn' ? 'text-emerald-600' : 'text-blue-600'}`}>
              {status === 'idle' ? 'Belum Check-In' : status === 'checkedIn' ? 'Sedang Bertugas' : 'Selesai'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={status === 'idle' ? '#0F172A' : status === 'checkedIn' ? '#059669' : '#2563EB'} />
          </TouchableOpacity>
        </View>

        {status === 'idle' && (
          <View className="mb-6">
            <TouchableOpacity 
              className={`w-full py-4 rounded-xl items-center mb-2 ${isLoading ? 'bg-emerald-400' : 'bg-emerald-600'}`}
              onPress={handleCheckIn}
              disabled={isLoading}
            >
              <Text className="text-white font-bold text-base">{isLoading ? 'Memproses...' : 'Check-In Sekarang'}</Text>
            </TouchableOpacity>
            <Text className="text-center text-slate-400 text-xs">Lokasi akan diverifikasi otomatis.</Text>
          </View>
        )}

        {status === 'checkedIn' && (
          <View className="mb-6">
            <TouchableOpacity 
              className={`w-full py-4 rounded-xl items-center mb-2 ${isLoading ? 'bg-danger/80' : 'bg-danger'}`}
              onPress={handleCheckOut}
              disabled={isLoading}
            >
              <Text className="text-white font-bold text-base">{isLoading ? 'Memproses...' : 'Check-Out Sekarang'}</Text>
            </TouchableOpacity>
            <Text className="text-center text-slate-400 text-xs">Selesaikan tugas untuk check-out.</Text>
          </View>
        )}

        {status === 'checkedOut' && (
          <View className="bg-emerald-50 w-full py-4 rounded-xl items-center mb-6 border border-emerald-100">
            <Text className="text-emerald-700 font-bold text-base">Tugas Selesai ✓</Text>
          </View>
        )}

        <View className="bg-blue-50 p-4 rounded-xl flex-row items-center border border-blue-100">
          <Ionicons name="information-circle-outline" size={24} color="#2563EB" className="mr-3" />
          <Text className="text-slate-600 text-xs flex-1 leading-5">
            Pastikan Anda berada di lokasi event untuk melakukan check-in.
          </Text>
        </View>
      </View>
    </View>
  );
};
