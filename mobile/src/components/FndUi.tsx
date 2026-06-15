import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconName = keyof typeof Ionicons.glyphMap;

type HeaderProps = {
  title: string;
  dark?: boolean;
  onBack?: () => void;
  rightIcon?: IconName;
  onRightPress?: () => void;
};

export function FndHeader({ title, dark = false, onBack, rightIcon, onRightPress }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const iconColor = dark ? '#FFFFFF' : '#0B1241';

  return (
    <View style={{ paddingTop: insets.top + 10 }} className={`${dark ? 'bg-primary' : 'bg-white'} px-5 pb-4`}>
      <View className="h-11 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onBack}
          disabled={!onBack}
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          {onBack ? <Ionicons name="chevron-back" size={24} color={iconColor} /> : null}
        </TouchableOpacity>
        <Text className={`${dark ? 'text-white' : 'text-primary'} text-base font-bold`}>{title}</Text>
        <TouchableOpacity
          onPress={onRightPress}
          disabled={!rightIcon}
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          {rightIcon ? <Ionicons name={rightIcon} size={22} color={iconColor} /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function StatusBadge({ label, bg, text }: { label: string; bg: string; text: string }) {
  return (
    <View className={`${bg} rounded-md px-3 py-1.5`}>
      <Text className={`${text} text-[10px] font-bold`}>{label}</Text>
    </View>
  );
}

export function InfoRow({
  icon,
  title,
  subtitle,
  dense = false,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  dense?: boolean;
}) {
  return (
    <View className={`flex-row items-start ${dense ? 'mb-1.5' : 'mb-3'}`}>
      <Ionicons name={icon} size={dense ? 14 : 18} color="#64748B" style={{ marginTop: dense ? 1 : 2 }} />
      <View className="ml-2 flex-1">
        <Text className={`${dense ? 'text-xs' : 'text-sm'} font-medium text-primary`} numberOfLines={dense ? 1 : 2}>
          {title}
        </Text>
        {subtitle ? <Text className="mt-0.5 text-xs text-slate-500" numberOfLines={2}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

export function ProgressBar({ progress, color = '#2563EB' }: { progress: number; color?: string }) {
  const safeProgress = Math.max(0, Math.min(100, Number(progress || 0)));
  return (
    <View className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <View className="h-full rounded-full" style={{ width: `${safeProgress}%`, backgroundColor: color }} />
    </View>
  );
}

export function EmptyState({ icon, title, description }: { icon: IconName; title: string; description?: string }) {
  return (
    <View className="items-center rounded-2xl border border-slate-100 bg-slate-50 p-6">
      <Ionicons name={icon} size={40} color="#CBD5E1" />
      <Text className="mt-3 text-center font-bold text-primary">{title}</Text>
      {description ? <Text className="mt-1 text-center text-xs leading-5 text-slate-500">{description}</Text> : null}
    </View>
  );
}

export function LoadingState({ dark = false }: { dark?: boolean }) {
  return (
    <View className={`${dark ? 'bg-primary' : 'bg-white'} flex-1 items-center justify-center`}>
      <ActivityIndicator size="large" color={dark ? '#FFFFFF' : '#2563EB'} />
    </View>
  );
}
