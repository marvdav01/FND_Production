"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
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

const eventStatuses = ["pending", "survey", "deal", "running", "selesai", "cancel"]

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    eventDate: "",
    location: "",
    notes: "",
    status: "pending",
    totalAmount: "",
    dpAmount: "",
  })

  useEffect(() => {
    async function loadEvent() {
      setLoading(true)
      try {
        const res = await fetchAPI<any>(`/events/${id}`)
        const event = res.data
        setFormData({
          name: event.name || "",
          type: event.type || "",
          eventDate: String(event.event_date || "").slice(0, 10),
          location: event.location || "",
          notes: event.notes || "",
          status: event.status || "pending",
          totalAmount: String(event.total_amount || ""),
          dpAmount: String(event.dp_amount || ""),
        })
      } catch (err: any) {
        toast.error(err.message || "Gagal memuat event")
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      await fetchAPI(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          eventDate: formData.eventDate,
          location: formData.location,
          notes: formData.notes,
          status: formData.status,
          totalAmount: Number(formData.totalAmount || 0),
          dpAmount: Number(formData.dpAmount || 0),
          equipment: [],
          crew: [],
        }),
      })
      toast.success("Event berhasil diperbarui")
      router.push(`/admin/events/${id}`)
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan event")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/events/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Edit Event</h1>
          <p className="text-muted-foreground">Perbarui detail booking dan status event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Detail Event</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Event</Label>
              <Input id="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label>Jenis Event</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis event" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" type="date" value={formData.eventDate} onChange={(event) => setFormData({ ...formData, eventDate: event.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventStatuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input id="location" value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total">Total Harga</Label>
              <Input id="total" type="number" value={formData.totalAmount} onChange={(event) => setFormData({ ...formData, totalAmount: event.target.value })} min={0} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dp">DP</Label>
              <Input id="dp" type="number" value={formData.dpAmount} onChange={(event) => setFormData({ ...formData, dpAmount: event.target.value })} min={0} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea id="notes" value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} rows={4} />
            </div>
            <div className="flex justify-end gap-2 md:col-span-2">
              <Link href={`/admin/events/${id}`}>
                <Button type="button" variant="outline">Batal</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
