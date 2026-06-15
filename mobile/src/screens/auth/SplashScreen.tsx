import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const SplashScreen = ({ navigation }: any) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1: Ring pulse + Logo appear
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(ringScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ringOpacity, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Step 2: Text slides up
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Step 3: Tagline + progress bar
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(barOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(barWidth, {
            toValue: width * 0.5,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ]).start();
      });
    });

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#070E1F' }}>
      {/* Background glow blobs */}
      <View
        style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 350,
          height: 350,
          borderRadius: 175,
          backgroundColor: '#1D4ED8',
          opacity: 0.12,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: '#3B82F6',
          opacity: 0.08,
        }}
      />

      {/* Center content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer glow ring */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: 90,
            borderWidth: 1,
            borderColor: '#3B82F6',
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: 110,
            borderWidth: 1,
            borderColor: '#3B82F6',
            transform: [{ scale: ringScale }],
            opacity: Animated.multiply(ringOpacity, 0.4),
          }}
        />

        {/* Logo box */}
        <Animated.View
          style={{
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 28,
              backgroundColor: '#1D4ED8',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#2563EB',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.6,
              shadowRadius: 24,
              elevation: 20,
              borderWidth: 1,
              borderColor: 'rgba(99,179,237,0.3)',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 }}>
              FND
            </Text>
          </View>
        </Animated.View>

        {/* Brand name */}
        <Animated.View
          style={{
            marginTop: 28,
            alignItems: 'center',
            opacity: textOpacity,
            transform: [{ translateY: textY }],
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: 4 }}>
            FND
          </Text>
          <Text style={{ color: '#3B82F6', fontSize: 13, fontWeight: '700', letterSpacing: 6, marginTop: 4 }}>
            PRODUCTION
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          style={{
            marginTop: 12,
            color: '#64748B',
            fontSize: 12,
            letterSpacing: 1,
            opacity: taglineOpacity,
          }}
        >
          Professional Event Production
        </Animated.Text>
      </View>

      {/* Bottom loading bar */}
      <View style={{ paddingBottom: 60, alignItems: 'center' }}>
        <Animated.View
          style={{
            height: 2,
            width: width * 0.5,
            backgroundColor: '#1E293B',
            borderRadius: 999,
            overflow: 'hidden',
            opacity: barOpacity,
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: barWidth,
              backgroundColor: '#3B82F6',
              borderRadius: 999,
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};
