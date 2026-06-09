import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../services/api';

const SERVICES = [
  { type: 'Sound System', price: 2500000 },
  { type: 'Lighting', price: 3500000 },
  { type: 'LED Videotron', price: 4000000 },
  { type: 'Panggung', price: 3000000 },
];

export const BookingScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(SERVICES[1]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    eventDate: '',
    location: '',
    guests: '',
    notes: '',
  });

  const totalAmount = selectedService.price;

  const renderStep1 = () => (
    <View>
      <Text className="text-xl font-bold text-[#0F172A] mb-4">Pilih Layanan</Text>
      {SERVICES.map((item) => {
        const selected = selectedService.type === item.type;
        return (
          <TouchableOpacity
            key={item.type}
            onPress={() => setSelectedService(item)}
            className={`bg-white p-4 rounded-xl mb-3 border shadow-sm ${selected ? 'border-[#2563EB]' : 'border-gray-100'}`}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-semibold text-[#1E293B]">{item.type}</Text>
                <Text className="text-gray-500 text-xs mt-1">Mulai Rp {item.price.toLocaleString('id-ID')}</Text>
              </View>
              <View className={`w-6 h-6 rounded-full border items-center justify-center ${selected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300'}`}>
                {selected && <Text className="text-white text-xs font-bold">✓</Text>}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text className="text-xl font-bold text-[#0F172A] mb-4">Detail Event</Text>
      <Input label="Nama Event" placeholder="Contoh: Wedding Rina & Adi" value={formData.name} onChangeText={(value) => setFormData({ ...formData, name: value })} />
      <Input label="Tanggal" placeholder="YYYY-MM-DD" value={formData.eventDate} onChangeText={(value) => setFormData({ ...formData, eventDate: value })} />
      <Input label="Lokasi" placeholder="Alamat lengkap venue" value={formData.location} onChangeText={(value) => setFormData({ ...formData, location: value })} />
      <Input label="Jumlah Tamu" placeholder="Estimasi peserta" keyboardType="numeric" value={formData.guests} onChangeText={(value) => setFormData({ ...formData, guests: value })} />
      <View className="mb-4">
        <Text className="text-[#1E293B] font-semibold mb-2">Catatan Tambahan</Text>
        <TextInput
          multiline
          numberOfLines={4}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#0F172A] min-h-[100px]"
          placeholder="Tuliskan kebutuhan khusus..."
          value={formData.notes}
          onChangeText={(value) => setFormData({ ...formData, notes: value })}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text className="text-xl font-bold text-[#0F172A] mb-4">Ringkasan Booking</Text>
      <View className="bg-white rounded-xl p-4 border border-gray-100 mb-4 shadow-sm">
        <Text className="font-bold text-[#1E293B] mb-3 border-b border-gray-100 pb-2">Event</Text>
        <Text className="text-gray-600 mb-1">{formData.name || '-'}</Text>
        <Text className="text-gray-600 mb-1">{formData.eventDate || '-'}</Text>
        <Text className="text-gray-600">{formData.location || '-'}</Text>
      </View>
      <View className="bg-white rounded-xl p-4 border border-gray-100 mb-6 shadow-sm">
        <Text className="font-bold text-[#1E293B] mb-2 border-b border-gray-100 pb-2">Total Estimasi</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">{selectedService.type}</Text>
          <Text className="font-semibold">Rp {totalAmount.toLocaleString('id-ID')}</Text>
        </View>
        <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
          <Text className="font-bold text-lg text-[#0F172A]">Total</Text>
          <Text className="font-bold text-lg text-[#2563EB]">Rp {totalAmount.toLocaleString('id-ID')}</Text>
        </View>
      </View>
    </View>
  );

  const validate = () => {
    if (!formData.name.trim()) return 'Nama event wajib diisi';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.eventDate)) return 'Tanggal harus berformat YYYY-MM-DD';
    if (!formData.location.trim()) return 'Lokasi wajib diisi';
    return null;
  };

  const submitBooking = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Data belum lengkap', validationError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/events', {
        name: formData.name,
        type: selectedService.type,
        eventDate: formData.eventDate,
        location: formData.location,
        notes: `${formData.notes}${formData.guests ? `\nEstimasi tamu: ${formData.guests}` : ''}`,
        totalAmount,
        dpAmount: 0,
        equipment: [],
        crew: [],
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Booking gagal');
      }

      Alert.alert('Booking Berhasil', 'Permintaan Anda sudah masuk ke dashboard admin.', [
        { text: 'Lihat Event Saya', onPress: () => navigation.navigate('EventSaya') },
      ]);
      setStep(1);
      setFormData({ name: '', eventDate: '', location: '', guests: '', notes: '' });
    } catch (error: any) {
      Alert.alert('Booking Gagal', error.response?.data?.error || error.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 pb-20">
      <View className="bg-[#0F172A] pt-16 pb-4 px-6 rounded-b-3xl">
        <Text className="text-white text-2xl font-bold mb-2">Booking Event</Text>
        <View className="flex-row justify-between mt-4">
          {[1, 2, 3].map(i => (
            <View key={i} className={`h-1 flex-1 mx-1 rounded-full ${i <= step ? 'bg-[#2563EB]' : 'bg-gray-600'}`} />
          ))}
        </View>
        <Text className="text-white text-xs mt-2 font-medium">Langkah {step} dari 3</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        <View className="h-10" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex-row justify-between z-10">
        {step > 1 ? (
          <TouchableOpacity onPress={() => setStep(step - 1)} className="py-4 px-6 rounded-2xl border border-gray-200">
            <Text className="font-bold text-[#1E293B]">Kembali</Text>
          </TouchableOpacity>
        ) : <View />}

        {step < 3 ? (
          <Button title="Selanjutnya" onPress={() => setStep(step + 1)} className={step === 1 ? 'w-full' : 'flex-1 ml-4'} />
        ) : (
          <Button title="Konfirmasi Booking" variant="primary" onPress={submitBooking} isLoading={isLoading} disabled={isLoading} className="flex-1 ml-4" />
        )}
      </View>
    </View>
  );
};
