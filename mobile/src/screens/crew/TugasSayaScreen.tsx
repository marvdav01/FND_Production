import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';

const TABS = ['Aktif', 'Mendatang', 'Selesai'];

const mapTaskStatus = (event: any) => {
  if (event.status === 'selesai') return 'Selesai';
  if (event.status === 'pending' || event.status === 'survey' || event.status === 'deal') return 'Mendatang';
  return 'Aktif';
};

const getTagStyle = (tag: string) => {
  switch (tag) {
    case 'Aktif': return { bg: 'bg-emerald-100', text: 'text-emerald-600' };
    case 'Mendatang': return { bg: 'bg-blue-100', text: 'text-blue-600' };
    case 'Selesai': return { bg: 'bg-slate-100', text: 'text-slate-600' };
    default: return { bg: 'bg-slate-100', text: 'text-slate-600' };
  }
};

export const TugasSayaScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('Aktif');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await api.get('/events/assigned');
      if (response.data?.success) {
        setTasks(response.data.data || []);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || error.message || 'Gagal memuat tugas');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks(true);
    setRefreshing(false);
  };

  const filteredTasks = tasks.filter((task) => mapTaskStatus(task) === activeTab);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row px-6 py-4">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 items-center rounded-xl mx-1 ${activeTab === tab ? 'bg-primary' : 'bg-transparent border border-slate-200'}`}
          >
            <Text className={`font-semibold text-sm ${activeTab === tab ? 'text-white' : 'text-slate-400'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1 px-6 pt-2 pb-20"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      >
        {filteredTasks.length === 0 ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-gray-500">Belum ada tugas di kategori ini.</Text>
          </View>
        ) : (
          filteredTasks.map((task) => {
            const status = mapTaskStatus(task);
            const tagStyle = getTagStyle(status);

            return (
              <View key={task.id} className="bg-white rounded-3xl p-5 mb-5 border border-slate-100 shadow-sm" style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-primary font-bold text-base flex-1 mr-2">{task.name}</Text>
                  <View className={`${tagStyle.bg} px-3 py-1.5 rounded-full`}>
                    <Text className={`${tagStyle.text} font-bold text-[10px]`}>{status}</Text>
                  </View>
                </View>

                <View className="mb-5">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="location-outline" size={16} color="#64748B" />
                    <Text className="text-slate-500 text-sm ml-2">{task.location}</Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar-outline" size={16} color="#64748B" />
                    <Text className="text-slate-500 text-sm ml-2">{task.event_date}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="person-outline" size={16} color="#64748B" />
                    <Text className="text-slate-500 text-sm ml-2">Tugas: {task.task || 'Support'}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  className="bg-primary w-full py-3.5 rounded-xl items-center"
                  onPress={() => navigation.navigate('DetailTugas', { taskId: task.id, event: task })}
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
