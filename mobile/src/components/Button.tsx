import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button = ({ title, variant = 'primary', isLoading = false, className, ...props }: ButtonProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary': return 'bg-[#0F172A] border-[#0F172A]'; 
      case 'secondary': return 'bg-[#1E293B] border-[#1E293B]'; 
      case 'outline': return 'bg-transparent border-[#0F172A] border-2'; 
      case 'danger': return 'bg-[#EF4444] border-[#EF4444]'; 
      default: return 'bg-[#0F172A] border-[#0F172A]';
    }
  };

  const getTextStyle = () => {
    if (variant === 'outline') return 'text-[#0F172A]';
    return 'text-white';
  };

  return (
    <TouchableOpacity
      className={`rounded-2xl py-4 px-6 items-center justify-center flex-row border ${getVariantStyle()} ${className} ${isLoading || props.disabled ? 'opacity-70' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#0F172A' : '#FFFFFF'} className="mr-2" />
      ) : null}
      <Text className={`font-bold text-base ${getTextStyle()}`}>{title}</Text>
    </TouchableOpacity>
  );
};
