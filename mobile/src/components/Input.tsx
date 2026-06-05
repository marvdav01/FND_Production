import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, secureTextEntry, ...props }: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = secureTextEntry !== undefined;

  return (
    <View className={`mb-4 ${className || ''}`}>
      {label && <Text className="text-[#1E293B] font-semibold mb-2">{label}</Text>}
      <View className={`flex-row items-center bg-gray-50 border rounded-xl px-4 ${error ? 'border-[#EF4444]' : 'border-gray-200'}`}>
        <TextInput
          className="flex-1 py-3 text-[#0F172A]"
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPasswordField ? !isPasswordVisible : false}
          {...props}
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(prev => !prev)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-[#EF4444] text-xs mt-1">{error}</Text>}
    </View>
  );
};
