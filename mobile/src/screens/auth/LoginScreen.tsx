import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSuccess, User } from '../../store/slices/authSlice';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../services/api';

export const LoginScreen = ({ navigation }: any) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const payload = response.data?.data || response.data;
      const token = payload?.token;
      const user = payload?.user;

      if (!token || !user) {
        throw new Error('Login gagal, coba lagi.');
      }

      const role: User['role'] = user.role === 'crew' ? 'CREW' : 'CLIENT';
      await AsyncStorage.setItem('token', token);
      dispatch(loginSuccess({ user: { id: String(user.id), name: user.name, email: user.email, role }, token }));
    } catch (error: any) {
      Alert.alert('Login Error', error.response?.data?.error || error.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="mb-10">
          <Text className="text-3xl font-bold text-[#0F172A] mb-2">Selamat Datang!</Text>
          <Text className="text-base text-gray-500">Masuk untuk melanjutkan ke FND Production.</Text>
        </View>

        <Controller
          control={control}
          rules={{ 
            required: 'Email wajib diisi',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Format email tidak valid"
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="Masukkan email Anda (ketik 'crew' untuk login Crew)"
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
          rules={{ required: 'Password wajib diisi' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Masukkan password Anda"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message as string}
              secureTextEntry
            />
          )}
          name="password"
        />

        <View className="items-end mb-6 mt-2">
          <Text className="text-[#2563EB] font-semibold">Lupa Password?</Text>
        </View>

        <Button 
          title="Masuk" 
          onPress={handleSubmit(onSubmit)} 
          isLoading={isLoading} 
          className="mb-4 mt-2"
        />

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-500">Belum punya akun? </Text>
          <Text 
            className="text-[#2563EB] font-bold"
            onPress={() => navigation.navigate('Register')}
          >
            Daftar Sekarang
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
