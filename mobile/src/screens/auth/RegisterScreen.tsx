import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const RegisterScreen = ({ navigation }: any) => {
  const { control, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'CREW'>('CLIENT');

  const password = watch("password");

  const onSubmit = (data: any) => {
    setIsLoading(true);
    // TODO: Integrasi API Register
    setTimeout(() => {
      setIsLoading(false);
      // Pindah ke Login setelah sukses (atau bisa langsung dispatch login)
      navigation.navigate('Login');
    }, 1000);
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
              message: "Format email tidak valid"
            }
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
          rules={{ required: 'Password wajib diisi', minLength: { value: 6, message: 'Minimal 6 karakter' } }}
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
            validate: value => value === password || 'Password tidak cocok'
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

        <Text className="text-[#1E293B] font-semibold mb-2 mt-2">Mendaftar Sebagai</Text>
        <View className="flex-row mb-8">
          <TouchableOpacity 
            className={`flex-1 py-3 mr-2 items-center rounded-xl border ${selectedRole === 'CLIENT' ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-gray-200'}`}
            onPress={() => setSelectedRole('CLIENT')}
          >
            <Text className={`font-semibold ${selectedRole === 'CLIENT' ? 'text-white' : 'text-gray-500'}`}>Client</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-3 ml-2 items-center rounded-xl border ${selectedRole === 'CREW' ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-gray-200'}`}
            onPress={() => setSelectedRole('CREW')}
          >
            <Text className={`font-semibold ${selectedRole === 'CREW' ? 'text-white' : 'text-gray-500'}`}>Crew</Text>
          </TouchableOpacity>
        </View>

        <Button 
          title="Daftar" 
          onPress={handleSubmit(onSubmit)} 
          isLoading={isLoading} 
          className="mb-4"
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
