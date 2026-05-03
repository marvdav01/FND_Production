"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { fetchAPI } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
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
import { ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

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

export default function BookingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    event_type: "",
    event_date: "",
    location: "",
    requirements: "",
  })

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetchAPI('/events', {
        method: 'POST',
        body: JSON.stringify({
          name: `${formData.event_type} - ${formData.location}`,
          type: formData.event_type,
          eventDate: formData.event_date,
          location: formData.location,
          notes: formData.requirements,
        })
      })

      if (res.success) {
        router.push("/client/events")
      } else {
        console.error("Error creating booking:", res.error)
        alert("Gagal membuat booking: " + (res.error || 'Unknown error'))
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Gagal membuat booking")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 pt-12">
        <Link href="/client">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-white">Booking Event</h1>
      </header>

      {/* Progress */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s <= step
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-0.5 ml-2 ${
                    s < step ? "bg-primary" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-4">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Jenis Event</Label>
              <Select
                value={formData.event_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, event_type: value })
                }
              >
                <SelectTrigger className="bg-[#1a2029] border-gray-700 text-white">
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
              <Label className="text-gray-300">Tanggal Event</Label>
              <Input
                type="date"
                value={formData.event_date}
                onChange={(e) =>
                  setFormData({ ...formData, event_date: e.target.value })
                }
                className="bg-[#1a2029] border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Lokasi</Label>
              <Input
                placeholder="Gedung Serbaguna, Bandung"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="bg-[#1a2029] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Kebutuhan</Label>
              <Textarea
                placeholder="Lighting panggung, efek smoke, laser, dan operator"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                className="bg-[#1a2029] border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Upload Referensi (Opsional)</Label>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 w-16 rounded-lg bg-[#1a2029] border border-gray-700 border-dashed flex items-center justify-center"
                  >
                    <span className="text-2xl text-gray-600">+</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full mt-6 bg-primary"
              disabled={
                !formData.event_type ||
                !formData.event_date ||
                !formData.location
              }
              onClick={() => setStep(2)}
            >
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Card className="bg-[#1a2029] border-gray-800">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-white">Ringkasan Booking</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Jenis Event</span>
                    <span className="text-white">{formData.event_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tanggal</span>
                    <span className="text-white">
                      {new Date(formData.event_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lokasi</span>
                    <span className="text-white">{formData.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a2029] border-gray-800">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2">Kebutuhan</h3>
                <p className="text-gray-400 text-sm">
                  {formData.requirements || "Tidak ada kebutuhan khusus"}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-gray-700 text-white"
                onClick={() => setStep(1)}
              >
                Kembali
              </Button>
              <Button
                className="flex-1 bg-primary"
                onClick={() => setStep(3)}
              >
                Lanjutkan
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Card className="bg-[#1a2029] border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <ChevronRight className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Konfirmasi Booking
                </h3>
                <p className="text-gray-400 text-sm">
                  Dengan menekan tombol kirim, Anda akan mengirim permintaan
                  booking ke FND Production. Tim kami akan segera menghubungi
                  Anda untuk proses selanjutnya.
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-gray-700 text-white"
                onClick={() => setStep(2)}
              >
                Kembali
              </Button>
              <Button
                className="flex-1 bg-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Mengirim..." : "Kirim Booking"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
