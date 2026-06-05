import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, updateProfileSuccess } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { Button } from '../../components/Button';
import { api } from '../../services/api';

export const ProfileClientScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Izin Ditolak', 'Aplikasi memerlukan izin untuk mengakses galeri foto Anda.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true, // ImagePicker langsung encode ke base64 — tidak perlu expo-file-system
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (!asset.base64) {
        Alert.alert('Gagal', 'Tidak dapat membaca gambar. Coba lagi.');
        return;
      }
      handleAvatarUpload(asset);
    }
  };

  const handleAvatarUpload = async (asset: ImagePicker.ImagePickerAsset) => {
    setIsUploading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const mimeType = asset.mimeType || 'image/jpeg';

      const response = await fetch(`${api.defaults.baseURL}/auth/profile/avatar-base64`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: asset.base64, // base64 string dari ImagePicker
          mimeType: mimeType,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        dispatch(updateProfileSuccess({ avatar_url: responseData.data.avatar_url }));
        Alert.alert('Berhasil', 'Foto profil berhasil diperbarui.');
      } else {
        throw new Error(responseData.error || 'Upload gagal');
      }
    } catch (error: any) {
      console.error('Upload Error:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengunggah foto profil.');
    } finally {
      setIsUploading(false);
    }
  };

  // Convert relative url to absolute if needed
  const getAvatarUrl = () => {
    if (!user?.avatar_url) return null;
    if (user.avatar_url.startsWith('http')) return user.avatar_url;
    // Get base URL logic from api.ts
    const baseURL = api.defaults.baseURL || 'http://192.168.18.14:4000/api';
    return `${baseURL.replace('/api', '')}${user.avatar_url}`;
  };

  const handleMenuPress = (index: number) => {
    if (index === 0) {
      navigation.navigate('EditProfile');
    } else {
      Alert.alert('Info', 'Fitur sedang dalam pengembangan');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-[#0F172A] pt-16 pb-12 px-6 items-center rounded-b-3xl shadow-lg">
        <TouchableOpacity onPress={pickImage} disabled={isUploading} className="relative mb-4">
          <View className="w-28 h-28 bg-gray-200 rounded-full border-4 border-white overflow-hidden items-center justify-center">
            {getAvatarUrl() ? (
              <Image source={{ uri: getAvatarUrl()! }} className="w-full h-full" />
            ) : (
              <Ionicons name="person" size={50} color="#94A3B8" />
            )}
            {isUploading && (
              <View className="absolute inset-0 bg-black/50 items-center justify-center">
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </View>
          <View className="absolute bottom-1 right-1 bg-[#2563EB] w-9 h-9 rounded-full items-center justify-center border-4 border-[#0F172A] shadow-md">
            <Ionicons name="camera" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>
        
        <Text className="text-white text-2xl font-bold tracking-tight">{user?.name || 'Client'}</Text>
        <Text className="text-gray-400 text-sm mt-1">{user?.email || 'email@example.com'}</Text>
      </View>

      <View className="px-6 -mt-6">
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <Text className="text-[#0F172A] font-bold text-base mb-4 border-b border-gray-100 pb-3">Informasi Akun</Text>
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
              <Ionicons name="call" size={20} color="#2563EB" />
            </View>
            <View>
              <Text className="text-gray-500 text-xs mb-0.5">Nomor HP</Text>
              <Text className="text-[#1E293B] font-semibold">{user?.phone || 'Belum diatur'}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
              <Ionicons name="shield-checkmark" size={20} color="#2563EB" />
            </View>
            <View>
              <Text className="text-gray-500 text-xs mb-0.5">Role</Text>
              <Text className="text-[#1E293B] font-semibold uppercase">{user?.role || 'CLIENT'}</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8">
          {['Data Pribadi', 'Ubah Password', 'Pengaturan'].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => handleMenuPress(index)}
              className="p-4 border-b border-gray-50 flex-row justify-between items-center active:bg-gray-50"
            >
              <View className="flex-row items-center">
                <Ionicons 
                  name={index === 0 ? 'person-outline' : index === 1 ? 'lock-closed-outline' : 'settings-outline'} 
                  size={20} 
                  color="#64748B" 
                  style={{ marginRight: 12 }} 
                />
                <Text className="text-[#1E293B] font-medium">{item}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Keluar Akun" variant="danger" onPress={handleLogout} className="mb-10 shadow-sm" />
      </View>
    </ScrollView>
  );
};
