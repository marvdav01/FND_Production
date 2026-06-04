import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = ['Belum Lunas', 'Lunas'];

const INVOICES = [
  {
    id: 'Invoice #INV-110524-001', event: 'Wedding Andi & Sinta',
    date: '11 Mei 2024', amount: 'Rp 7.000.000',
    status: 'Belum Lunas', statusBg: 'bg-red-100', statusText: 'text-red-600',
  },
  {
    id: 'Invoice #INV-300524-001', event: 'Corporate Gathering PT Maju',
    date: '30 Mei 2024', amount: 'Rp 5.060.000',
    status: 'Belum Lunas', statusBg: 'bg-red-100', statusText: 'text-red-600',
  },
  {
    id: 'Invoice #INV-150624-001', event: 'Seminar Nasional 2024',
    date: '15 April 2024', amount: 'Rp 4.500.000',
    status: 'Lunas', statusBg: 'bg-emerald-100', statusText: 'text-emerald-600',
  },
];

export const InvoiceScreen = () => {
  const [activeTab, setActiveTab] = useState('Belum Lunas');
  const filtered = INVOICES.filter(inv => inv.status === activeTab);

  return (
    <View className="flex-1 bg-white">
      {/* Tabs */}
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

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View className="py-16 items-center">
            <Ionicons name="receipt-outline" size={48} color="#CBD5E1" />
            <Text className="text-slate-400 mt-4">Tidak ada invoice</Text>
          </View>
        )}
        {filtered.map((inv, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl mb-4 border border-slate-100 overflow-hidden"
            style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}
          >
            <View className="p-4">
              {/* ID + Status */}
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-slate-500 text-xs font-medium">{inv.id}</Text>
                <View className={`${inv.statusBg} px-3 py-1 rounded-full`}>
                  <Text className={`${inv.statusText} font-bold text-[10px]`}>{inv.status}</Text>
                </View>
              </View>

              {/* Event name */}
              <Text className="text-primary font-bold text-base mb-1">{inv.event}</Text>
              <View className="flex-row items-center mb-3">
                <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                <Text className="text-slate-400 text-xs ml-1">{inv.date}</Text>
              </View>

              {/* Amount */}
              <Text className="text-accent font-bold text-lg mb-4">{inv.amount}</Text>

              {/* Actions */}
              <View className="flex-row border-t border-slate-50 pt-3 gap-2">
                <TouchableOpacity className="flex-1 border border-slate-200 py-2.5 rounded-xl items-center flex-row justify-center">
                  <Ionicons name="document-text-outline" size={14} color="#0F172A" />
                  <Text className="text-primary font-semibold text-xs ml-1">Lihat Invoice</Text>
                </TouchableOpacity>
                {inv.status === 'Belum Lunas' && (
                  <TouchableOpacity className="flex-1 bg-accent py-2.5 rounded-xl items-center flex-row justify-center">
                    <Ionicons name="card-outline" size={14} color="#FFFFFF" />
                    <Text className="text-white font-semibold text-xs ml-1">Bayar</Text>
                  </TouchableOpacity>
                )}
                {inv.status === 'Lunas' && (
                  <TouchableOpacity className="flex-1 border border-slate-200 py-2.5 rounded-xl items-center flex-row justify-center">
                    <Ionicons name="download-outline" size={14} color="#0F172A" />
                    <Text className="text-primary font-semibold text-xs ml-1">Unduh PDF</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
