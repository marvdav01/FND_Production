import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = ['Aktif', 'Mendatang', 'Selesai'];
const TASKS = [
  { 
    id: 1, 
    title: 'Wedding Andi & Sinta', 
    location: 'Gedung Graha Sarana', 
    time: '08.00 - Selesai', 
    role: 'Sound Engineer', 
    status: 'Aktif',
    tag: 'On Going',
    progress: 60
  },
  { 
    id: 2, 
    title: 'Corporate Gathering PT Maju', 
    location: 'Hotel Grand Zuri', 
    time: '13.00 - 22.00', 
    role: 'Audio Crew', 
    status: 'Aktif',
    tag: 'Persiapan',
    progress: 20
  },
  { 
    id: 3, 
    title: 'Live Music Event', 
    location: 'FND Studio', 
    date: '18 Mei 2024',
    time: '',
    role: 'Lighting Crew', 
    status: 'Mendatang',
    tag: 'Mendatang',
    progress: 0
  },
];

export const TugasSayaScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('Aktif');
  const filteredTasks = TASKS.filter(t => t.status === activeTab);

  const getTagStyle = (tag: string) => {
    switch(tag) {
      case 'On Going': return { bg: 'bg-emerald-100', text: 'text-emerald-600' };
      case 'Persiapan': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600' };
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tabs */}
      <View className="flex-row px-6 py-4">
        {TABS.map((tab) => (
          <TouchableOpacity 
            key={tab} onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 items-center rounded-xl mx-1 ${activeTab === tab ? 'bg-primary' : 'bg-transparent border border-slate-200'}`}
          >
            <Text className={`font-semibold text-sm ${activeTab === tab ? 'text-white' : 'text-slate-400'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-6 pt-2 pb-20" showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-gray-500">Belum ada tugas di kategori ini.</Text>
          </View>
        ) : (
          filteredTasks.map(task => {
            const tagStyle = getTagStyle(task.tag);
            
            return (
              <View key={task.id} className="bg-white rounded-3xl p-5 mb-5 border border-slate-100 shadow-sm" style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
                
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-primary font-bold text-base flex-1 mr-2">{task.title}</Text>
                  <View className={`${tagStyle.bg} px-3 py-1.5 rounded-full`}>
                    <Text className={`${tagStyle.text} font-bold text-[10px]`}>{task.tag}</Text>
                  </View>
                </View>
                
                <View className="mb-5 space-y-2">
                  <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={16} color="#64748B" />
                    <Text className="text-slate-500 text-sm ml-2">{task.location}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#64748B" />
                    <Text className="text-slate-500 text-sm ml-2">{task.date ? task.date : task.time}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="person-outline" size={16} color="#64748B" />
                    <Text className="text-slate-500 text-sm ml-2">Posisi: {task.role}</Text>
                  </View>
                </View>

                {activeTab === 'Aktif' && (
                  <View className="mb-5">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-primary text-xs font-semibold">Progress</Text>
                      <Text className="text-primary text-xs font-bold">{task.progress}%</Text>
                    </View>
                    <View className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden">
                      <View className="h-full bg-accent rounded-full" style={{ width: `${task.progress}%` }} />
                    </View>
                  </View>
                )}

                <TouchableOpacity 
                  className="bg-primary w-full py-3.5 rounded-xl items-center"
                  onPress={() => navigation.navigate('DetailTugas', { taskId: task.id })}
                >
                  <Text className="text-white font-semibold text-sm">Lihat Detail</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};
