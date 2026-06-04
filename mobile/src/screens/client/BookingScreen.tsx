import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const BookingScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState(1);

  const renderStep1 = () => (
    <View>
      <Text className="text-xl font-bold text-[#0F172A] mb-4">Pilih Layanan</Text>
      {['Sound System', 'Lighting', 'LED Videotron', 'Panggung'].map((item, idx) => (
        <View key={idx} className="flex-row justify-between items-center bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-sm">
          <Text className="font-semibold text-[#1E293B]">{item}</Text>
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => setQty(Math.max(0, qty - 1))} className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Text className="text-xl font-bold text-gray-600">-</Text>
            </TouchableOpacity>
            <Text className="font-bold w-6 text-center">{idx === 0 ? qty : 0}</Text>
            <TouchableOpacity onPress={() => setQty(idx === 0 ? qty + 1 : 0)} className="w-8 h-8 bg-[#2563EB] rounded-full items-center justify-center ml-3">
              <Text className="text-xl font-bold text-white">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text className="text-xl font-bold text-[#0F172A] mb-4">Detail Event</Text>
      <Input label="Nama Event" placeholder="Contoh: Konser Musik Indie" />
      <Input label="Tanggal" placeholder="DD/MM/YYYY" />
      <Input label="Jam" placeholder="00:00" />
      <Input label="Lokasi" placeholder="Alamat lengkap venue" />
      <Input label="Jumlah Tamu" placeholder="Estimasi jumlah peserta" keyboardType="numeric" />
      <View className="mb-4">
        <Text className="text-[#1E293B] font-semibold mb-2">Catatan Tambahan</Text>
        <TextInput 
          multiline 
          numberOfLines={4} 
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#0F172A] min-h-[100px]"
          placeholder="Tuliskan kebutuhan khusus..."
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text className="text-xl font-bold text-[#0F172A] mb-4">Ringkasan Booking</Text>
      <View className="bg-white rounded-xl p-4 border border-gray-100 mb-4 shadow-sm">
        <Text className="font-bold text-[#1E293B] mb-2 border-b border-gray-100 pb-2">Layanan Terpilih</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Sound System x{qty}</Text>
          <Text className="font-semibold">Rp {qty * 2500000}</Text>
        </View>
      </View>
      <View className="bg-white rounded-xl p-4 border border-gray-100 mb-6 shadow-sm">
        <Text className="font-bold text-[#1E293B] mb-2 border-b border-gray-100 pb-2">Total Biaya</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Subtotal</Text>
          <Text className="font-semibold">Rp {qty * 2500000}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-green-600">Diskon (Promo)</Text>
          <Text className="font-semibold text-green-600">- Rp 500.000</Text>
        </View>
        <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
          <Text className="font-bold text-lg text-[#0F172A]">Total</Text>
          <Text className="font-bold text-lg text-[#2563EB]">Rp {Math.max(0, qty * 2500000 - 500000)}</Text>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View className="items-center py-10">
      <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
        <Text className="text-4xl">🎉</Text>
      </View>
      <Text className="text-2xl font-bold text-[#0F172A] mb-2">Booking Berhasil!</Text>
      <Text className="text-center text-gray-500 mb-6 px-4">
        Tim kami akan segera memproses permintaan Anda dan menghubungi Anda untuk konfirmasi lebih lanjut.
      </Text>
      <View className="bg-gray-50 p-4 rounded-xl w-full mb-8">
        <Text className="text-center text-sm text-gray-500 mb-1">Nomor Booking</Text>
        <Text className="text-center font-bold text-lg text-[#0F172A]">BKG-202611-001</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 pb-20">
      <View className="bg-[#0F172A] pt-16 pb-4 px-6 rounded-b-3xl">
        <Text className="text-white text-2xl font-bold mb-2">Booking Event</Text>
        <View className="flex-row justify-between mt-4">
          {[1, 2, 3, 4].map(i => (
            <View key={i} className={`h-1 flex-1 mx-1 rounded-full ${i <= step ? 'bg-[#2563EB]' : 'bg-gray-600'}`} />
          ))}
        </View>
        <Text className="text-white text-xs mt-2 font-medium">Langkah {step} dari 4</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        <View className="h-10" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex-row justify-between z-10">
        {step > 1 && step < 4 ? (
          <TouchableOpacity onPress={() => setStep(step - 1)} className="py-4 px-6 rounded-2xl border border-gray-200">
            <Text className="font-bold text-[#1E293B]">Kembali</Text>
          </TouchableOpacity>
        ) : <View />}

        {step < 3 ? (
          <Button title="Selanjutnya" onPress={() => setStep(step + 1)} className={step === 1 ? 'w-full' : 'flex-1 ml-4'} />
        ) : step === 3 ? (
          <Button title="Konfirmasi Booking" variant="primary" onPress={() => setStep(4)} className="flex-1 ml-4" />
        ) : (
          <Button title="Selesai" onPress={() => { setStep(1); navigation.navigate('Beranda'); }} className="w-full" />
        )}
      </View>
    </View>
  );
};
