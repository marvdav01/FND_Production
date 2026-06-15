import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, getAssetUrl } from '../../services/api';
import { EmptyState, FndHeader } from '../../components/FndUi';
import { buildServicesFromEquipment, formatCurrency, serviceCategories, ServiceItem } from '../../utils/fnd';

export const LayananScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const fetchServices = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await api.get('/equipment');
      setServices(buildServicesFromEquipment(response.data?.data || []));
    } catch {
      setServices(buildServicesFromEquipment([]));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices(true);
    setRefreshing(false);
  };

  const categories = useMemo(() => {
    const fromServices = Array.from(new Set(services.map((service) => service.category)));
    return serviceCategories.filter((category) => category === 'Semua' || fromServices.includes(category));
  }, [services]);

  const filtered = services.filter((service) => {
    const matchCategory = activeCategory === 'Semua' || service.category === activeCategory;
    const matchSearch = service.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const selectService = (service: ServiceItem) => {
    navigation.getParent()?.navigate('Booking', {
      screen: 'BookingHome',
      params: { selectedService: service },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <FndHeader title="Layanan Kami" onBack={() => navigation.goBack()} rightIcon="search-outline" onRightPress={() => setShowSearch(!showSearch)} />

      {showSearch ? (
        <View className="px-5 pb-3">
          <View className="flex-row items-center rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              className="ml-2 flex-1 text-sm text-primary"
              placeholder="Cari layanan..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>
      ) : null}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <View className="flex-1 flex-row">
          <ScrollView className="w-28 bg-white" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 104 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
                className={`mx-3 mb-2 rounded-md px-2 py-3 ${activeCategory === category ? 'bg-primary' : 'bg-white'}`}
              >
                <Text className={`text-center text-xs font-semibold leading-4 ${activeCategory === category ? 'text-white' : 'text-primary'}`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            className="flex-1 border-l border-slate-100 px-4 pt-1"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 104 }}
          >
            {filtered.length === 0 ? (
              <EmptyState icon="construct-outline" title="Layanan tidak ditemukan" />
            ) : (
              filtered.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  className="mb-3 flex-row rounded-xl border border-slate-100 bg-white p-3"
                  style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
                  onPress={() => selectService(service)}
                >
                  <Image source={{ uri: getAssetUrl(service.image) || service.image }} className="mr-3 h-20 w-20 rounded-lg" resizeMode="cover" />
                  <View className="flex-1 justify-center">
                    <Text className="font-bold text-primary" numberOfLines={1}>{service.name}</Text>
                    <Text className="mt-1 text-xs leading-4 text-slate-500" numberOfLines={2}>{service.description}</Text>
                    <Text className="mt-2 text-xs font-black text-primary">Mulai dari</Text>
                    <Text className="text-xs font-black text-primary">{formatCurrency(service.price)}</Text>
                    {service.stock !== undefined ? <Text className="mt-1 text-[10px] text-slate-400">Stok tersedia: {service.stock}</Text> : null}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
