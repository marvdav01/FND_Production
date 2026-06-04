import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <View className={`mb-4 ${className}`}>
      {label && <Text className="text-[#1E293B] font-semibold mb-2">{label}</Text>}
      <TextInput
        className={`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#0F172A] ${error ? 'border-[#EF4444]' : 'focus:border-[#2563EB]'}`}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {error && <Text className="text-[#EF4444] text-xs mt-1">{error}</Text>}
    </View>
  );
};
