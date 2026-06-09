import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../services/api';

export const RegisterScreen = ({ navigation }: any) => {
  const { control, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const password = watch('password');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.data?.success) {
        Alert.alert('Berhasil', 'Akun client berhasil dibuat. Silakan login.');
        navigation.navigate('Login', { email: data.email });
      } else {
        throw new Error(response.data?.error || 'Registrasi gagal');
      }
    } catch (error: any) {
      const isNetworkError = !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error');
      if (isNetworkError) {
        Alert.alert(
          'Koneksi Gagal',
          'Tidak dapat terhubung ke server. Pastikan HP dan PC Anda berada di jaringan Wi-Fi yang sama, lalu coba lagi.'
        );
      } else {
        const msg = error.response?.data?.error || error.message || 'Terjadi kesalahan';
        const isEmailTaken = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('already registered');
        Alert.alert(
          isEmailTaken ? 'Email Sudah Terdaftar' : 'Registrasi Gagal',
          isEmailTaken ? 'Email ini sudah digunakan. Gunakan email lain atau langsung login.' : msg
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 60 }}>
        <View className="mb-8">
          <Text className="text-3xl font-bold text-[#0F172A] mb-2">Buat Akun</Text>
          <Text className="text-base text-gray-500">Bergabunglah dengan FND Production sekarang.</Text>
        </View>

        <Controller
          control={control}
          rules={{ required: 'Nama lengkap wajib diisi' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap Anda"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message as string}
            />
          )}
          name="name"
        />

        <Controller
          control={control}
          rules={{ 
            required: 'Email wajib diisi',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Format email tidak valid',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="Masukkan email Anda"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message as string}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
          name="email"
        />

        <Controller
          control={control}
          rules={{ required: 'Password wajib diisi', minLength: { value: 8, message: 'Minimal 8 karakter' } }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Buat password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message as string}
              secureTextEntry
            />
          )}
          name="password"
        />

        <Controller
          control={control}
          rules={{ 
            required: 'Konfirmasi password wajib diisi',
            validate: value => value === password || 'Password tidak cocok',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Konfirmasi Password"
              placeholder="Ulangi password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.confirmPassword?.message as string}
              secureTextEntry
            />
          )}
          name="confirmPassword"
        />

        <Button 
          title="Daftar" 
          onPress={handleSubmit(onSubmit)} 
          isLoading={isLoading}
          disabled={isLoading} 
          className="mb-4 mt-4"
        />

        <View className="flex-row justify-center mt-2 mb-10">
          <Text className="text-gray-500">Sudah punya akun? </Text>
          <Text 
            className="text-[#2563EB] font-bold"
            onPress={() => navigation.navigate('Login')}
          >
            Masuk
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
