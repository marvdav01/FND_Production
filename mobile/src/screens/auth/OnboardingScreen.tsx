import React, { useState, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    icon: 'musical-notes' as const,
    iconBg: '#1D4ED8',
    accentColor: '#3B82F6',
    title: 'Sound System\nBerkualitas Tinggi',
    desc: 'Layanan sound system profesional kelas enterprise untuk setiap jenis event — konser, seminar, hingga gala dinner.',
  },
  {
    id: 2,
    icon: 'bulb' as const,
    iconBg: '#7C3AED',
    accentColor: '#A78BFA',
    title: 'Lighting Megah\n& Memukau',
    desc: 'Desain pencahayaan panggung spektakuler dari tim berpengalaman. Setiap momen terasa sinematik.',
  },
  {
    id: 3,
    icon: 'rocket' as const,
    iconBg: '#0F766E',
    accentColor: '#2DD4BF',
    title: 'Manajemen Event\ndi Genggaman Anda',
    desc: 'Booking, pantau progres, dan kelola semua kebutuhan event dari satu aplikasi kapan saja, di mana saja.',
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<any>(null);
  const dotAnim = useRef(SLIDES.map(() => new Animated.Value(0))).current;

  const animateDot = (index: number) => {
    dotAnim.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === index ? 1 : 0,
        useNativeDriver: false,
        friction: 5,
      }).start();
    });
  };

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentIndex(next);
      animateDot(next);
    } else {
      navigation.replace('Login');
    }
  };

  const goToLogin = () => navigation.replace('Login');
  const slide = SLIDES[currentIndex];

  return (
    <View style={{ flex: 1, backgroundColor: '#070E1F' }}>
      <StatusBar barStyle="light-content" backgroundColor="#070E1F" />

      {/* Ambient glow top */}
      <View
        style={{
          position: 'absolute',
          top: -60,
          alignSelf: 'center',
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: slide.accentColor,
          opacity: 0.07,
        }}
      />

      {/* Slides */}
      <Animated.ScrollView
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, index) => (
          <View
            key={s.id}
            style={{ width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}
          >
            {/* Icon card */}
            <View
              style={{
                width: 160,
                height: 160,
                borderRadius: 48,
                backgroundColor: s.iconBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 48,
                shadowColor: s.accentColor,
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.5,
                shadowRadius: 40,
                elevation: 16,
                borderWidth: 1,
                borderColor: `${s.accentColor}40`,
              }}
            >
              <Ionicons name={s.icon} size={72} color="white" />
            </View>

            <Text style={{ color: '#FFFFFF', fontSize: 30, fontWeight: '900', textAlign: 'center', lineHeight: 38, marginBottom: 16 }}>
              {s.title}
            </Text>
            <Text style={{ color: '#94A3B8', fontSize: 15, textAlign: 'center', lineHeight: 24 }}>
              {s.desc}
            </Text>
          </View>
        ))}
      </Animated.ScrollView>

      {/* Bottom Controls */}
      <View style={{ paddingHorizontal: 32, paddingBottom: 48, paddingTop: 24 }}>
        {/* Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32, gap: 8 }}>
          {SLIDES.map((_, index) => {
            const dotWidth = dotAnim[index].interpolate({
              inputRange: [0, 1],
              outputRange: [8, 28],
            });
            const dotColor = dotAnim[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['#1E293B', slide.accentColor],
            });
            return (
              <Animated.View
                key={index}
                style={{
                  height: 8,
                  width: index === currentIndex ? 28 : 8,
                  borderRadius: 4,
                  backgroundColor: index === currentIndex ? slide.accentColor : '#1E293B',
                }}
              />
            );
          })}
        </View>

        {/* Next button */}
        <TouchableOpacity
          style={{
            backgroundColor: slide.accentColor,
            paddingVertical: 18,
            borderRadius: 20,
            alignItems: 'center',
            marginBottom: 16,
            shadowColor: slide.accentColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
          onPress={goToNext}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
            {currentIndex < SLIDES.length - 1 ? 'Selanjutnya' : 'Mulai Sekarang'}
          </Text>
          <Ionicons
            name={currentIndex < SLIDES.length - 1 ? 'arrow-forward' : 'checkmark'}
            size={18}
            color="white"
          />
        </TouchableOpacity>

        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity onPress={goToLogin} style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ color: '#475569', fontWeight: '600', fontSize: 14 }}>Lewati</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
