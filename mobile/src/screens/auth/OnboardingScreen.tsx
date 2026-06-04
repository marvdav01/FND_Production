import React, { useState, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    emoji: '🎵',
    title: 'Sound System\nBerkualitas Tinggi',
    desc: 'Nikmati layanan sound system profesional untuk setiap jenis event Anda.',
    bg: '#0F172A',
  },
  {
    id: 2,
    emoji: '💡',
    title: 'Lighting\nMegah & Memukau',
    desc: 'Desain pencahayaan panggung yang spektakuler dari tim berpengalaman kami.',
    bg: '#1E293B',
  },
  {
    id: 3,
    emoji: '🚀',
    title: 'Manajemen Event\ndi Genggaman Anda',
    desc: 'Booking, pantau progres, dan kelola semua kebutuhan event dari satu aplikasi.',
    bg: '#0F172A',
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<any>(null);

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentIndex(next);
    } else {
      navigation.replace('Login');
    }
  };

  const goToLogin = () => navigation.replace('Login');

  return (
    <View className="flex-1 bg-[#0F172A]">
      {/* Slides */}
      <Animated.ScrollView
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide, index) => (
          <View
            key={slide.id}
            style={{ width }}
            className="flex-1 items-center justify-center px-8"
          >
            {/* Illustration */}
            <View className="w-48 h-48 bg-white/10 rounded-full items-center justify-center mb-10 border border-white/10">
              <Text style={{ fontSize: 80 }}>{slide.emoji}</Text>
            </View>

            {/* Text */}
            <Text className="text-white text-3xl font-black text-center leading-tight mb-4">
              {slide.title}
            </Text>
            <Text className="text-gray-400 text-base text-center leading-6">
              {slide.desc}
            </Text>
          </View>
        ))}
      </Animated.ScrollView>

      {/* Bottom Controls */}
      <View className="px-8 pb-16 pt-6">
        {/* Dots */}
        <View className="flex-row justify-center mb-10">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              className={`h-2 mx-1 rounded-full ${
                index === currentIndex
                  ? 'bg-[#2563EB] w-6'
                  : 'bg-gray-600 w-2'
              }`}
            />
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          className="bg-[#2563EB] py-4 rounded-2xl items-center mb-4"
          onPress={goToNext}
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">
            {currentIndex < SLIDES.length - 1 ? 'Selanjutnya' : 'Mulai Sekarang'}
          </Text>
        </TouchableOpacity>

        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity onPress={goToLogin} className="items-center py-2">
            <Text className="text-gray-400 font-semibold">Lewati</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
