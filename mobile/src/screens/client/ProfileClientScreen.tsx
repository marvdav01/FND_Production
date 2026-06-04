import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { Button } from '../../components/Button';

export const ProfileClientScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-[#0F172A] pt-16 pb-12 px-6 items-center rounded-b-3xl">
        <View className="w-24 h-24 bg-gray-300 rounded-full mb-4 border-4 border-white"></View>
        <Text className="text-white text-xl font-bold">{user?.name || 'Client'}</Text>
        <Text className="text-gray-400 text-sm">{user?.email || 'email@example.com'}</Text>
      </View>

      <View className="px-6 -mt-6">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <Text className="text-[#0F172A] font-bold text-base mb-4 border-b border-gray-100 pb-2">Informasi Akun</Text>
          <View className="mb-3">
            <Text className="text-gray-500 text-xs mb-1">Nomor HP</Text>
            <Text className="text-[#1E293B] font-medium">+62 812 3456 7890</Text>
          </View>
          <View>
            <Text className="text-gray-500 text-xs mb-1">Alamat</Text>
            <Text className="text-[#1E293B] font-medium">Jl. Jendral Sudirman No.1, Jakarta Pusat</Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8">
          {['Data Pribadi', 'Ubah Password', 'Pengaturan'].map((item, index) => (
            <TouchableOpacity key={index} className="p-4 border-b border-gray-50 flex-row justify-between items-center">
              <Text className="text-[#1E293B] font-medium">{item}</Text>
              <Text className="text-gray-400">{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Logout" variant="danger" onPress={handleLogout} className="mb-10" />
      </View>
    </ScrollView>
  );
};
