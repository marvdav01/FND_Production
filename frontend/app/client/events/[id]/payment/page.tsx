"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { fetchAPI } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { Event, Payment } from "@/lib/types"

export default function ClientPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [unpaidPayments, setUnpaidPayments] = useState<Payment[]>([])
  const [selectedPayment, setSelectedPayment] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetchAPI(`/events/${id}`)
      if (res.success) {
        setEvent(res.data)
        const unpaid = (res.data.payments || []).filter((p: any) => p.status === 'unpaid')
        setUnpaidPayments(unpaid)
        if (unpaid.length > 0) {
          setSelectedPayment(unpaid[0].id.toString())
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("Gagal mengambil data pembayaran")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar (maks 5MB)")
        return
      }
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPayment || !file) {
      toast.error("Silakan pilih pembayaran dan unggah file")
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("proof", file)

      const res = await fetchAPI(`/payments/${selectedPayment}/upload-proof`, {
        method: "POST",
        body: formData,
      })

      if (res.success) {
        toast.success("Bukti pembayaran berhasil diunggah!")
        router.push(`/client/events/${id}`)
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah bukti pembayaran")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!event || unpaidPayments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-white">Semua Pembayaran Lunas</h2>
        <p className="text-gray-400 text-center mt-2 mb-6">
          Tidak ada tagihan yang perlu dibayar untuk event ini.
        </p>
        <Link href={`/client/events/${id}`}>
          <Button>Kembali ke Detail</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 bg-[#0f172a]">
      <header className="flex items-center gap-4 p-4 pt-12">
        <Link href={`/client/events/${id}`}>
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-white">Upload Bukti Bayar</h1>
      </header>

      <main className="px-4 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-[#1a2029] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Pilih Tagihan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unpaidPayments.map((payment) => (
                <div
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment.id.toString())}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedPayment === payment.id.toString()
                      ? "border-primary bg-primary/10"
                      : "border-gray-800 bg-[#0f172a]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white capitalize">
                        {payment.payment_type === 'dp' ? 'DP (Uang Muka)' : 'Pelunasan'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Total Tagihan: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(payment.amount))}
                      </p>
                    </div>
                    {selectedPayment === payment.id.toString() && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#1a2029] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Unggah Gambar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                    previewUrl ? "border-primary/50 bg-primary/5" : "border-gray-700 hover:border-primary/50"
                  }`}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 rounded-lg mb-4"
                    />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-600 mb-4" />
                  )}
                  <p className="text-sm text-gray-400 text-center">
                    {file ? file.name : "Ketuk untuk memilih foto bukti transfer"}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Format: JPG, PNG (Maks 5MB)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={submitting || !file}
              className="w-full h-12 text-lg font-semibold bg-primary"
            >
              {submitting ? "Mengunggah..." : "Kirim Bukti Pembayaran"}
            </Button>
            <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Bukti akan diverifikasi oleh admin dalam 1x24 jam
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}
