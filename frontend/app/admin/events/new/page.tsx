"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchAPI } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Calendar, MapPin, Clock, User } from "lucide-react"
import Link from "next/link"
import type { Profile, Equipment } from "@/lib/types"
import { toast } from "sonner"

const eventTypes = [
  "Wedding",
  "Concert",
  "Corporate Event",
  "Awarding Night",
  "Private Party",
  "Gala Dinner",
  "Festival",
  "Exhibition",
  "Conference",
  "Other",
]

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Profile[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<{ id: string; quantity: number }[]>([])
  
  const [formData, setFormData] = useState({
    name: "",
    event_type: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    venue_name: "",
    requirements: "",
    client_id: "",
    total_price: "",
    notes: "",
  })

  useEffect(() => {
    fetchClients()
    fetchEquipment()
  }, [])

  async function fetchClients() {
    try {
      const res = await fetchAPI('/auth/users?role=client')
      if (res.success) {
        setClients(res.data)
      }
    } catch (err) {
      console.error("Error fetching clients:", err)
    }
  }

  async function fetchEquipment() {
    try {
      const res = await fetchAPI('/equipment')
      if (res.success) {
        const mapped = res.data.map((eq: any) => ({
          ...eq,
          available_quantity: eq.available_stock || 0
        }))
        setEquipment(mapped.filter((eq: any) => eq.available_quantity > 0))
      }
    } catch (err) {
      console.error("Error fetching equipment:", err)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        type: formData.event_type,
        eventDate: formData.event_date,
        location: formData.location,
        notes: formData.notes,
        totalAmount: parseFloat(formData.total_price) || 0,
        dpAmount: 0,
        clientId: formData.client_id || null,
        equipment: selectedEquipment.map(eq => ({ equipmentId: eq.id, quantity: eq.quantity })),
        crew: []
      }

      const res = await fetchAPI('/events', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (res.success) {
        toast.success("Event berhasil dibuat!")
        router.push("/admin/events")
      } else {
        toast.error(res.error || "Gagal membuat event")
      }
    } catch (error: any) {
      console.error("Error creating event:", error)
      toast.error(error.message || "Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }

  const addEquipment = (equipmentId: string) => {
    if (!selectedEquipment.find((eq) => eq.id === equipmentId)) {
      setSelectedEquipment([...selectedEquipment, { id: equipmentId, quantity: 1 }])
    }
  }

  const removeEquipment = (equipmentId: string) => {
    setSelectedEquipment(selectedEquipment.filter((eq) => eq.id !== equipmentId))
  }

  const updateEquipmentQuantity = (equipmentId: string, quantity: number) => {
    setSelectedEquipment(
      selectedEquipment.map((eq) =>
        eq.id === equipmentId ? { ...eq, quantity: Math.max(1, quantity) } : eq
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tambah Event Baru</h1>
          <p className="text-muted-foreground">Buat booking event baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Detail Event
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Event *</Label>
                <Input
                  id="name"
                  placeholder="Contoh: Wedding - Bandung"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_type">Jenis Event *</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis event" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Tanggal Event *</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Waktu Mulai</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">Waktu Selesai</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Lokasi & Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi *</Label>
                <Input
                  id="location"
                  placeholder="Contoh: Bandung"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue_name">Nama Venue</Label>
                <Input
                  id="venue_name"
                  placeholder="Contoh: Gedung Serbaguna"
                  value={formData.venue_name}
                  onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_id">Client</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_price">Total Harga (Rp)</Label>
                <Input
                  id="total_price"
                  type="number"
                  placeholder="10000000"
                  value={formData.total_price}
                  onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Kebutuhan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Detail Kebutuhan</Label>
                <Textarea
                  id="requirements"
                  placeholder="Lighting panggung, efek smoke, laser, dan operator"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan lainnya..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipment Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Pilih Equipment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={addEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="Tambah equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment
                    .filter((eq) => !selectedEquipment.find((sel) => sel.id === eq.id))
                    .map((eq) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name} ({eq.available_quantity} tersedia)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {selectedEquipment.length > 0 && (
                <div className="space-y-2">
                  {selectedEquipment.map((sel) => {
                    const eq = equipment.find((e) => e.id === sel.id)
                    if (!eq) return null
                    return (
                      <div
                        key={sel.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span className="font-medium">{eq.name}</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={sel.quantity}
                            onChange={(e) =>
                              updateEquipmentQuantity(sel.id, parseInt(e.target.value))
                            }
                            className="w-20"
                            min={1}
                            max={eq.available_quantity}
                          />
                          <span className="text-sm text-muted-foreground">unit</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEquipment(sel.id)}
                            className="text-destructive"
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/events">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-primary">
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Event
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
