import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { api, getAssetUrl } from '../../services/api';
import { EmptyState, FndHeader } from '../../components/FndUi';
import { buildServicesFromEquipment, formatCurrency, ServiceItem } from '../../utils/fnd';

type BookingForm = {
  name: string;
  eventDate: string;
  startTime: string;
  location: string;
  guests: string;
  notes: string;
};

const emptyForm: BookingForm = {
  name: '',
  eventDate: '',
  startTime: '08.00',
  location: '',
  guests: '',
  notes: '',
};

export const BookingScreen = ({ route, navigation }: any) => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selected, setSelected] = useState<Record<string, { service: ServiceItem; qty: number }>>({});
  const [formData, setFormData] = useState<BookingForm>(emptyForm);
  const [references, setReferences] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<any>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/equipment');
        const nextServices = buildServicesFromEquipment(response.data?.data || []);
        setServices(nextServices);
        const routeService = route?.params?.selectedService as ServiceItem | undefined;
        const initial = routeService || nextServices[0];
        if (initial) {
          setSelected({ [initial.id]: { service: initial, qty: 1 } });
        }
      } catch {
        const fallback = buildServicesFromEquipment([]);
        setServices(fallback);
        setSelected({ [fallback[0].id]: { service: fallback[0], qty: 1 } });
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const routeService = route?.params?.selectedService as ServiceItem | undefined;
    if (!routeService) return;
    setSelected((prev) => ({
      ...prev,
      [routeService.id]: {
        service: routeService,
        qty: prev[routeService.id]?.qty || 1,
      },
    }));
  }, [route?.params?.selectedService?.id]);

  const selectedItems = Object.values(selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.service.price * item.qty, 0);
  const discount = subtotal >= 10000000 ? 500000 : 0;
  const totalAmount = Math.max(subtotal - discount, 0);

  const updateQty = (service: ServiceItem, delta: number) => {
    setSelected((prev) => {
      const current = prev[service.id]?.qty || 0;
      const nextQty = Math.max(0, current + delta);
      const next = { ...prev };
      if (nextQty === 0) delete next[service.id];
      else next[service.id] = { service, qty: nextQty };
      return next;
    });
  };

  const validateDetail = () => {
    if (!formData.name.trim()) return 'Nama event wajib diisi.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.eventDate)) return 'Tanggal event harus berformat YYYY-MM-DD.';
    if (!formData.location.trim()) return 'Lokasi event wajib diisi.';
    return null;
  };

  const pickReference = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin Ditolak', 'Aplikasi memerlukan akses galeri untuk memilih referensi.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.75,
    });

    if (!result.canceled) {
      setReferences(result.assets.slice(0, 4));
    }
  };

  const uploadReferences = async () => {
    if (!references.length) return [];

    const formDataUpload = new FormData();
    references.forEach((asset, index) => {
      formDataUpload.append('images', {
        uri: asset.uri,
        name: asset.fileName || `reference-${Date.now()}-${index}.jpg`,
        type: asset.mimeType || 'image/jpeg',
      } as any);
    });

    const response = await api.post('/uploads/images', formDataUpload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return (response.data?.data || []).map((item: any) => item.url).filter(Boolean);
  };

  const submitBooking = async () => {
    const validationError = validateDetail();
    if (validationError) {
      Alert.alert('Data belum lengkap', validationError);
      setStep(2);
      return;
    }
    if (!selectedItems.length) {
      Alert.alert('Pilih layanan', 'Pilih minimal satu layanan untuk booking.');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const referenceImages = await uploadReferences();
      const serviceSummary = selectedItems.map((item) => `${item.service.name} x${item.qty}`).join(', ');
      const notes = [
        formData.notes.trim(),
        formData.guests ? `Estimasi tamu: ${formData.guests}` : '',
        `Layanan dipilih: ${serviceSummary}`,
        `Jam mulai: ${formData.startTime}`,
      ].filter(Boolean).join('\n');

      const response = await api.post('/events', {
        name: formData.name.trim(),
        type: selectedItems[0].service.category,
        eventDate: formData.eventDate,
        location: formData.location.trim(),
        notes,
        totalAmount,
        dpAmount: 0,
        referenceImages,
        equipment: selectedItems
          .filter((item) => item.service.equipmentId)
          .map((item) => ({ equipmentId: item.service.equipmentId, quantity: item.qty })),
        crew: [],
      });

      if (!response.data?.success) throw new Error(response.data?.error || 'Booking gagal');

      setCreatedEvent({
        id: response.data.data?.eventId,
        name: formData.name.trim(),
        date: formData.eventDate,
        total: totalAmount,
      });
      setStep(4);
      setFormData(emptyForm);
      setReferences([]);
    } catch (error: any) {
      Alert.alert('Booking Gagal', error.response?.data?.error || error.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    if (step === 1 && !selectedItems.length) {
      Alert.alert('Pilih layanan', 'Pilih minimal satu layanan.');
      return false;
    }
    if (step === 2) {
      const validationError = validateDetail();
      if (validationError) {
        Alert.alert('Data belum lengkap', validationError);
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!canGoNext()) return;
    setStep((current) => Math.min(current + 1, 3));
  };

  const stepLabels = ['Layanan', 'Detail', 'Ringkasan', 'Selesai'];

  const renderStepper = () => (
    <View className="mb-7 flex-row items-start justify-between">
      {stepLabels.map((label, index) => {
        const number = index + 1;
        const done = step > number;
        const active = step === number;
        return (
          <View key={label} className="flex-1 items-center">
            <View className="w-full flex-row items-center">
              <View className="flex-1">
                {index > 0 ? <View className={`h-px ${step > index ? 'bg-emerald-400' : 'bg-slate-200'}`} /> : null}
              </View>
              <View className={`h-8 w-8 items-center justify-center rounded-full ${done ? 'bg-emerald-500' : active ? 'bg-primary' : 'bg-slate-200'}`}>
                {done ? <Ionicons name="checkmark" size={15} color="#FFFFFF" /> : <Text className={`text-xs font-black ${active ? 'text-white' : 'text-slate-500'}`}>{number}</Text>}
              </View>
              <View className="flex-1">
                {index < stepLabels.length - 1 ? <View className={`h-px ${step > number ? 'bg-emerald-400' : 'bg-slate-200'}`} /> : null}
              </View>
            </View>
            <Text className={`mt-2 text-[10px] font-semibold ${active ? 'text-primary' : done ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</Text>
          </View>
        );
      })}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text className="mb-4 text-lg font-black text-primary">Pilih Layanan</Text>
      {loadingServices ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : services.length === 0 ? (
        <EmptyState icon="construct-outline" title="Layanan belum tersedia" />
      ) : (
        services.slice(0, 8).map((service) => {
          const qty = selected[service.id]?.qty || 0;
          return (
            <View key={service.id} className="mb-4 flex-row rounded-xl border border-slate-100 bg-white p-3" style={{ elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}>
              <Image source={{ uri: getAssetUrl(service.image) || service.image }} className="mr-3 h-16 w-16 rounded-lg" resizeMode="cover" />
              <View className="flex-1">
                <Text className="font-bold text-primary">{service.name}</Text>
                <Text className="mt-1 text-xs text-slate-500">{formatCurrency(service.price)}</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-md bg-slate-50" onPress={() => updateQty(service, -1)}>
                  <Ionicons name="remove" size={16} color="#0B1241" />
                </TouchableOpacity>
                <Text className="w-8 text-center font-bold text-primary">{qty}</Text>
                <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-md bg-slate-50" onPress={() => updateQty(service, 1)}>
                  <Ionicons name="add" size={16} color="#0B1241" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
      <TouchableOpacity className="mt-2 flex-row items-center justify-center rounded-lg bg-slate-50 py-4" onPress={() => navigation.navigate('Layanan')}>
        <Ionicons name="add" size={18} color="#0B1241" />
        <Text className="ml-2 font-bold text-primary">Tambah Layanan Lain</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInput = (label: string, value: string, onChangeText: (value: string) => void, placeholder: string, multiline = false) => (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-bold text-primary">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-lg bg-slate-50 px-4 text-sm text-primary ${multiline ? 'min-h-[92px] py-3' : 'h-12'}`}
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text className="mb-4 text-lg font-black text-primary">Detail Event</Text>
      {renderInput('Nama Event', formData.name, (value) => setFormData({ ...formData, name: value }), 'Wedding Andi & Sinta')}
      <View className="flex-row">
        <View className="mr-2 flex-1">
          {renderInput('Tanggal Event', formData.eventDate, (value) => setFormData({ ...formData, eventDate: value }), 'YYYY-MM-DD')}
        </View>
        <View className="ml-2 flex-1">
          {renderInput('Jam', formData.startTime, (value) => setFormData({ ...formData, startTime: value }), '08.00')}
        </View>
      </View>
      {renderInput('Lokasi Event', formData.location, (value) => setFormData({ ...formData, location: value }), 'Gedung Graha Sarana')}
      {renderInput('Jumlah Tamu (Estimasi)', formData.guests, (value) => setFormData({ ...formData, guests: value.replace(/[^\d]/g, '') }), '500 Orang')}
      {renderInput('Catatan Tambahan', formData.notes, (value) => setFormData({ ...formData, notes: value }), 'Tuliskan kebutuhan khusus Anda di sini...', true)}

      <Text className="mb-2 text-xs font-bold text-primary">Upload Referensi (Opsional)</Text>
      <TouchableOpacity className="mb-4 flex-row items-center rounded-lg border border-slate-100 bg-white px-4 py-3" onPress={pickReference}>
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-md border border-slate-200">
          <Ionicons name="image-outline" size={19} color="#0B1241" />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-primary">Tambah Foto / Video</Text>
          <Text className="mt-1 text-[10px] text-slate-400">PNG, JPG, maks. 8MB</Text>
        </View>
      </TouchableOpacity>
      {references.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {references.map((asset) => (
            <Image key={asset.uri} source={{ uri: asset.uri }} className="mr-2 h-16 w-16 rounded-lg" />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text className="mb-5 text-lg font-black text-primary">Detail Event</Text>
      <Text className="mb-2 text-xl font-black text-primary">{formData.name || '-'}</Text>
      {[
        ['calendar-outline', formData.eventDate],
        ['time-outline', `${formData.startTime} - Selesai`],
        ['location-outline', formData.location],
        ['people-outline', `Tamu (Estimasi) ${formData.guests || '0'} Orang`],
      ].map(([icon, text]) => (
        <View key={String(icon)} className="mb-2 flex-row items-center">
          <Ionicons name={icon as any} size={16} color="#64748B" />
          <Text className="ml-2 text-sm text-slate-600">{text}</Text>
        </View>
      ))}

      <Text className="mb-3 mt-4 font-bold text-primary">Layanan yang Dipilih</Text>
      {selectedItems.map((item) => (
        <View key={item.service.id} className="mb-2 flex-row justify-between">
          <Text className="text-sm text-slate-600">{item.service.name} x{item.qty}</Text>
          <Text className="text-sm font-semibold text-primary">{formatCurrency(item.service.price * item.qty)}</Text>
        </View>
      ))}
      <View className="my-4 h-px bg-slate-100" />
      <View className="mb-2 flex-row justify-between">
        <Text className="text-sm text-slate-500">Subtotal</Text>
        <Text className="text-sm text-primary">{formatCurrency(subtotal)}</Text>
      </View>
      <View className="mb-3 flex-row justify-between">
        <Text className="text-sm text-slate-500">Diskon</Text>
        <Text className="text-sm text-danger">- {formatCurrency(discount)}</Text>
      </View>
      <View className="flex-row justify-between">
        <Text className="font-black text-primary">Total Estimasi</Text>
        <Text className="font-black text-primary">{formatCurrency(totalAmount)}</Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View className="items-center pt-8">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-emerald-500">
        <Ionicons name="checkmark" size={46} color="#FFFFFF" />
      </View>
      <Text className="text-xl font-black text-primary">Terima kasih!</Text>
      <Text className="mt-2 text-center text-sm text-slate-500">Booking event Anda telah berhasil dibuat.</Text>

      <View className="mt-8 w-full rounded-xl border border-slate-100 bg-white p-5" style={{ elevation: 2 }}>
        <Text className="mb-4 text-lg font-black text-primary">{createdEvent?.name || 'Booking Event'}</Text>
        <View className="mb-2 flex-row justify-between">
          <Text className="text-sm text-slate-500">No. Booking</Text>
          <Text className="font-bold text-primary">FND-{createdEvent?.id || 'NEW'}</Text>
        </View>
        <View className="mb-2 flex-row justify-between">
          <Text className="text-sm text-slate-500">Tanggal</Text>
          <Text className="font-bold text-primary">{createdEvent?.date || '-'}</Text>
        </View>
        <View className="mb-2 flex-row justify-between">
          <Text className="text-sm text-slate-500">Total Estimasi</Text>
          <Text className="font-bold text-primary">{formatCurrency(createdEvent?.total || 0)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-slate-500">Status</Text>
          <Text className="font-bold text-primary">Menunggu Konfirmasi</Text>
        </View>
      </View>

      <Text className="mt-6 text-center text-xs leading-5 text-slate-500">Kami akan segera memproses booking Anda dan menghubungi untuk konfirmasi lebih lanjut.</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <FndHeader title={step === 4 ? 'Booking Berhasil' : 'Booking Event'} onBack={() => (step > 1 && step < 4 ? setStep(step - 1) : navigation.goBack())} />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: step === 4 ? 70 : 132 }}>
        {renderStepper()}
        {step === 1 ? renderStep1() : null}
        {step === 2 ? renderStep2() : null}
        {step === 3 ? renderStep3() : null}
        {step === 4 ? renderStep4() : null}
      </ScrollView>

      {step < 4 ? (
        <View className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white px-5 pb-7 pt-4">
          <View className="mb-3">
            <Text className="text-xs text-slate-500">Total Estimasi</Text>
            <Text className="text-lg font-black text-primary">{formatCurrency(totalAmount)}</Text>
          </View>
          <TouchableOpacity
            className="items-center rounded-md bg-primary py-4"
            disabled={isSubmitting}
            onPress={step === 3 ? submitBooking : nextStep}
          >
            <Text className="font-bold text-white">{isSubmitting ? 'Mengirim...' : step === 3 ? 'Kirim Booking' : 'Lanjutkan'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pb-8 pt-3">
          <TouchableOpacity className="items-center rounded-md bg-primary py-4" onPress={() => navigation.getParent()?.navigate('EventSaya')}>
            <Text className="font-bold text-white">Lihat Event Saya</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center py-4" onPress={() => navigation.getParent()?.navigate('Beranda')}>
            <Text className="font-bold text-primary">Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
