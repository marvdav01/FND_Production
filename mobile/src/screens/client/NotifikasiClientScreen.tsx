import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const NOTIFS = [
  { id: 1, title: 'Booking Dikonfirmasi', desc: 'Booking untuk Konser Musik Lokal telah dikonfirmasi tim kami.', time: '2 jam yang lalu', type: 'Booking' },
  { id: 2, title: 'Pembayaran Diterima', desc: 'Pembayaran DP sebesar Rp 5.000.000 telah kami terima.', time: '1 hari yang lalu', type: 'Pembayaran' },
  { id: 3, title: 'Promo Akhir Tahun', desc: 'Diskon 20% untuk penyewaan Lighting. Klaim sekarang!', time: '3 hari yang lalu', type: 'Promo' },
];

export const NotifikasiClientScreen = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#0F172A] pt-16 pb-6 px-6 rounded-b-3xl">
        <Text className="text-white text-2xl font-bold mb-4">Notifikasi</Text>
      </View>
      <ScrollView className="flex-1 px-6 pt-6 pb-20">
        {NOTIFS.map(notif => (
          <View key={notif.id} className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm flex-row items-start">
            <View className="w-12 h-12 bg-blue-50 rounded-full mr-4 items-center justify-center">
              <Text className="text-[#2563EB] font-bold text-lg">{notif.type.charAt(0)}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between mb-1">
                <Text className="text-[#0F172A] font-bold text-base flex-1">{notif.title}</Text>
                <Text className="text-gray-400 text-xs">{notif.time}</Text>
              </View>
              <Text className="text-gray-500 text-sm">{notif.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
