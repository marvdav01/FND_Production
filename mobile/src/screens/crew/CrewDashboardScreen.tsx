import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { api, getAssetUrl } from '../../services/api';

export const CrewDashboardScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const avatarUrl = getAssetUrl(user?.avatar_url);

  const fetchTasks = async () => {
    const response = await api.get('/events/assigned');
    if (response.data?.success) {
      setTasks(response.data.data || []);
    }
  };

  useEffect(() => {
    fetchTasks().catch(() => null);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks().catch(() => null);
    setRefreshing(false);
  };

  const activeTasks = tasks.filter((task) => task.status !== 'selesai' && task.status !== 'cancel');
  const completedTasks = tasks.filter((task) => task.status === 'selesai');
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((task) => String(task.event_date).startsWith(today));

  return (
    <View className="flex-1 bg-primary">
      <View style={{ paddingTop: insets.top + 20 }} className="px-6 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white font-bold tracking-wider">FND PRODUCTION</Text>
            <Text className="text-slate-400 text-xs">CREW APP</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifikasi')}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="flex-row items-center" onPress={() => navigation.navigate('Profil')}>
          <Image
            source={avatarUrl ? { uri: avatarUrl } : require('../../../assets/icon.png')}
            className="w-12 h-12 rounded-full border border-slate-600"
          />
          <View className="ml-4 flex-1">
            <Text className="text-white text-lg font-bold">Halo, {user?.name || 'Crew'}</Text>
            <Text className="text-slate-400 text-sm">{activeTasks.length} tugas aktif</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-white rounded-t-[32px] pt-6 px-6">
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-primary font-bold text-lg">Tugas Aktif</Text>
            <Text className="text-slate-500 font-medium text-sm">{activeTasks.length} Event</Text>
          </View>

          {activeTasks.slice(0, 3).map((task) => (
            <TouchableOpacity
              key={task.id}
              className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm"
              style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
              onPress={() => navigation.navigate('DetailTugas', { taskId: task.id, event: task })}
            >
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-primary font-bold text-base flex-1 mr-2">{task.name}</Text>
                <View className="bg-emerald-100 px-3 py-1 rounded-full">
                  <Text className="text-emerald-600 font-bold text-xs">{task.status}</Text>
                </View>
              </View>
              <View className="flex-row items-center mb-1">
                <Ionicons name="location-outline" size={14} color="#64748B" />
                <Text className="text-slate-500 text-xs ml-2">{task.location}</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <Ionicons name="calendar-outline" size={14} color="#64748B" />
                <Text className="text-slate-500 text-xs ml-2">{task.event_date}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={14} color="#64748B" />
                <Text className="text-slate-500 text-xs ml-2">Tugas: {task.task || 'Support'}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {activeTasks.length === 0 && (
            <View className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100 items-center">
              <Ionicons name="briefcase-outline" size={40} color="#CBD5E1" />
              <Text className="text-slate-500 mt-3">Belum ada tugas aktif.</Text>
            </View>
          )}

          <Text className="text-primary font-bold text-lg mb-4">Ringkasan</Text>
          <View className="flex-row justify-between mb-6">
            <View className="bg-white items-center flex-1 py-4 rounded-xl border border-slate-100 mr-2 shadow-sm" style={{ elevation: 1 }}>
              <Text className="text-primary text-xl font-bold mb-1">{completedTasks.length}</Text>
              <Text className="text-slate-400 text-[10px] text-center">Tugas{"\n"}Selesai</Text>
            </View>
            <View className="bg-white items-center flex-1 py-4 rounded-xl border border-slate-100 mr-2 shadow-sm" style={{ elevation: 1 }}>
              <Text className="text-primary text-xl font-bold mb-1">{todayTasks.length}</Text>
              <Text className="text-slate-400 text-[10px] text-center">Tugas Hari{"\n"}Ini</Text>
            </View>
            <View className="bg-white items-center flex-1 py-4 rounded-xl border border-slate-100 shadow-sm" style={{ elevation: 1 }}>
              <Text className="text-primary text-xl font-bold mb-1">{tasks.length}</Text>
              <Text className="text-slate-400 text-[10px] text-center">Total{"\n"}Assignment</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
