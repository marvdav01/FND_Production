import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NOTIFS = [
  {
    id: 1,
    title: 'Tugas baru diberikan',
    desc: 'Anda mendapat tugas baru Corporate Gathering PT Maju pada 26 Juni.',
    time: 'Hari ini, 09.00',
    icon: 'briefcase',
    iconBg: 'bg-blue-100',
    iconColor: '#2563EB',
    isRead: false,
  },
  {
    id: 2,
    title: 'Update event',
    desc: 'Wedding Andi & Sinta: informasi venue diperbarui. Cek detail.',
    time: 'Hari ini, 08.30',
    icon: 'calendar',
    iconBg: 'bg-emerald-100',
    iconColor: '#059669',
    isRead: false,
  },
  {
    id: 3,
    title: 'Pengingat check-in',
    desc: 'Jangan lupa lakukan check-in pada event hari ini pukul 7 pagi.',
    time: 'Kemarin, 20.00',
    icon: 'location',
    iconBg: 'bg-orange-100',
    iconColor: '#F59E0B',
    isRead: true,
  },
  {
    id: 4,
    title: 'Pembayaran diterima',
    desc: 'Honorarium dari event Seminar Nasional 2024 telah dikirimkan.',
    time: 'Kemarin, 16.23',
    icon: 'wallet',
    iconBg: 'bg-purple-100',
    iconColor: '#7C3AED',
    isRead: true,
  },
  {
    id: 5,
    title: 'Pengumuman',
    desc: 'Briefing crew untuk event besok jam 19.00 di basecamp FND Production.',
    time: 'Kemarin, 17.00',
    icon: 'megaphone',
    iconBg: 'bg-red-100',
    iconColor: '#EF4444',
    isRead: true,
  },
];

export const NotifikasiCrewScreen = () => {
  const [filter, setFilter] = useState('Semua');
  const unread = NOTIFS.filter(n => !n.isRead).length;

  const filtered = filter === 'Belum Dibaca'
    ? NOTIFS.filter(n => !n.isRead)
    : NOTIFS;

  return (
    <View className="flex-1 bg-white">
      {/* Filter Row */}
      <View className="flex-row items-center px-6 py-3 border-b border-slate-100">
        {['Semua', 'Belum Dibaca'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`mr-4 py-1.5 px-4 rounded-full ${filter === f ? 'bg-primary' : 'bg-slate-100'}`}
          >
            <Text className={`font-semibold text-sm ${filter === f ? 'text-white' : 'text-slate-500'}`}>
              {f}{f === 'Belum Dibaca' && unread > 0 ? ` (${unread})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            className={`flex-row items-start px-6 py-4 border-b border-slate-50 ${!notif.isRead ? 'bg-blue-50/40' : 'bg-white'}`}
          >
            {/* Icon */}
            <View className={`w-11 h-11 ${notif.iconBg} rounded-full items-center justify-center mr-4 mt-0.5`}>
              <Ionicons name={notif.icon as any} size={20} color={notif.iconColor} />
            </View>

            {/* Content */}
            <View className="flex-1">
              <View className="flex-row justify-between items-start mb-1">
                <Text className={`text-sm flex-1 mr-2 ${notif.isRead ? 'text-slate-700 font-medium' : 'text-primary font-bold'}`}>
                  {notif.title}
                </Text>
                {!notif.isRead && (
                  <View className="w-2 h-2 bg-accent rounded-full mt-1.5" />
                )}
              </View>
              <Text className="text-slate-500 text-xs leading-5">{notif.desc}</Text>
              <Text className="text-slate-400 text-[10px] mt-1.5">{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

