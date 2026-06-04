import React, { useEffect } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

export const SplashScreen = ({ navigation }: any) => {
  const scaleAnim = new Animated.Value(0.5);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-[#0F172A]">
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}
        className="items-center"
      >
        <View className="w-24 h-24 bg-[#2563EB] rounded-3xl items-center justify-center mb-6 shadow-lg">
          <Text className="text-white text-4xl font-black">FND</Text>
        </View>
        <Text className="text-white text-3xl font-black tracking-widest">FND</Text>
        <Text className="text-[#2563EB] text-base font-bold tracking-widest mt-1">PRODUCTION</Text>
      </Animated.View>

      <View className="absolute bottom-16 items-center">
        <Text className="text-gray-600 text-xs">Professional Event Production</Text>
      </View>
    </View>
  );
};
