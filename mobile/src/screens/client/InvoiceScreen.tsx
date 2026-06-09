import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';

const TABS = ['Belum Lunas', 'Lunas'];

export const InvoiceScreen = () => {
  const [activeTab, setActiveTab] = useState('Belum Lunas');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoices = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await api.get('/events');
      if (response.data?.success) {
        const baseEvents = response.data.data || [];
        const details = await Promise.all(
          baseEvents.map((event: any) =>
            api.get(`/events/${event.id}`).then((res) => res.data?.data || event).catch(() => event)
          )
        );
        setEvents(details);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || error.message || 'Gagal memuat invoice');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInvoices(true);
    setRefreshing(false);
  };

  const invoices = useMemo(() => {
    return events.map((event) => {
      const total = Number(event.total_amount || 0);
      const paid = Number(event.paid_amount || 0);
      const isPaid = total > 0 && paid >= total;
      return {
        id: `INV-${String(event.id).padStart(5, '0')}`,
        event: event.name,
        date: event.event_date,
        amount: total,
        paid,
        status: isPaid ? 'Lunas' : 'Belum Lunas',
      };
    }).filter((invoice) => invoice.status === activeTab);
  }, [events, activeTab]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row px-6 py-4 border-b border-slate-100">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 mx-1 items-center rounded-xl ${activeTab === tab ? 'bg-primary' : 'bg-slate-100'}`}
          >
            <Text className={`font-semibold text-sm ${activeTab === tab ? 'text-white' : 'text-slate-500'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
      >
        {invoices.length === 0 && (
          <View className="py-16 items-center">
            <Ionicons name="receipt-outline" size={48} color="#CBD5E1" />
            <Text className="text-slate-400 mt-4">Tidak ada invoice</Text>
          </View>
        )}
        {invoices.map((invoice) => {
          const paid = invoice.status === 'Lunas';
          return (
            <View
              key={invoice.id}
              className="bg-white rounded-2xl mb-4 border border-slate-100 overflow-hidden"
              style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}
            >
              <View className="p-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-slate-500 text-xs font-medium">Invoice #{invoice.id}</Text>
                  <View className={`${paid ? 'bg-emerald-100' : 'bg-red-100'} px-3 py-1 rounded-full`}>
                    <Text className={`${paid ? 'text-emerald-600' : 'text-red-600'} font-bold text-[10px]`}>{invoice.status}</Text>
                  </View>
                </View>
                <Text className="text-primary font-bold text-base mb-1">{invoice.event}</Text>
                <View className="flex-row items-center mb-3">
                  <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs ml-1">{invoice.date}</Text>
                </View>
                <Text className="text-accent font-bold text-lg mb-4">Rp {invoice.amount.toLocaleString('id-ID')}</Text>
                <Text className="text-slate-400 text-xs">Terbayar Rp {invoice.paid.toLocaleString('id-ID')}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
