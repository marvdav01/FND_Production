"use client"

import { useState, useEffect, use } from "react"
import { fetchAPI } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Edit,
  Info,
  Package,
  Users,
  CreditCard,
  CheckCircle2,
  Circle,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import type { Event, EventStatus, Equipment, Payment } from "@/lib/types"

const statusColors: Record<EventStatus, string> = {
  pending: "bg-gray-700 text-gray-300",
  survey: "bg-amber-600 text-white",
  deal: "bg-blue-600 text-white",
  running: "bg-orange-600 text-white",
  selesai: "bg-green-600 text-white",
  cancel: "bg-red-600 text-white",
}

const statusOrder: EventStatus[] = ["pending", "survey", "deal", "running", "selesai"]

export default function ClientEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [equipment, setEquipment] = useState<any[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [statusHistory, setStatusHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  async function fetchEventDetails() {
    setLoading(true)
    try {
      const res = await fetchAPI(`/events/${id}`)
      if (res.success) {
        const e = res.data
        setEvent({
          ...e,
          event_type: e.type,
          total_price: e.total_amount
        } as any)
        
        setEquipment(e.equipment?.map((eq: any) => ({
          id: eq.id,
          quantity: eq.quantity,
          equipment: { name: eq.name }
        })) || [])
        
        setPayments(e.payments || [])
        setStatusHistory([]) // status history is not implemented in local backend yet
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-gray-400 mb-4">Event tidak ditemukan</p>
        <Link href="/client/events">
          <Button>Kembali</Button>
        </Link>
      </div>
    )
  }

  const currentStatusIndex = statusOrder.indexOf(event.status)

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-12">
        <Link href="/client/events">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-white">Detail Event</h1>
        <Button variant="ghost" size="icon" className="text-white">
          <Edit className="h-5 w-5" />
        </Button>
      </header>

      {/* Event Info */}
      <div className="px-4 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-white">{event.name}</h2>
            <Badge className={`mt-2 ${statusColors[event.status]}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-gray-400">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.venue_name || event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.event_date)}</span>
          </div>
          {event.start_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {event.start_time} - {event.end_time || "Selesai"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="px-4 mb-6">
        <Card className="bg-[#1a2029] border-gray-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white mb-4">Status Event</h3>
            <div className="space-y-4">
              {statusOrder.map((status, index) => {
                const historyItem = statusHistory.find((h) => h.status === status)
                const isCompleted = index < currentStatusIndex
                const isCurrent = index === currentStatusIndex

                return (
                  <div key={status} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          isCompleted || isCurrent
                            ? "bg-primary text-white"
                            : "bg-gray-700 text-gray-500"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                      </div>
                      {index < statusOrder.length - 1 && (
                        <div
                          className={`w-0.5 h-8 ${
                            isCompleted ? "bg-primary" : "bg-gray-700"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p
                        className={`font-medium capitalize ${
                          isCompleted || isCurrent ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {status === "selesai" ? "Selesai" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </p>
                      {historyItem && (
                        <p className="text-xs text-gray-500">
                          {formatDateTime(historyItem.changed_at)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="w-full bg-[#1a2029] border-gray-800">
            <TabsTrigger value="equipment" className="flex-1 text-xs">
              Equipment
            </TabsTrigger>
            <TabsTrigger value="crew" className="flex-1 text-xs">
              Crew
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex-1 text-xs">
              Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="mt-4">
            <Card className="bg-[#1a2029] border-gray-800">
              <CardContent className="p-4">
                {equipment.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Belum ada equipment</p>
                ) : (
                  <div className="space-y-3">
                    {equipment.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                      >
                        <span className="text-white">{item.equipment.name}</span>
                        <span className="text-gray-400">{item.quantity} Unit</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crew" className="mt-4">
            <Card className="bg-[#1a2029] border-gray-800">
              <CardContent className="p-4">
                <p className="text-center text-gray-500 py-4">
                  Crew akan ditampilkan setelah status Deal
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-4">
            <Card className="bg-[#1a2029] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Total Pembayaran</span>
                  <span className="text-xl font-bold text-white">
                    {formatCurrency(Number(event.total_price) || 0)}
                  </span>
                </div>

                {payments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Belum ada pembayaran</p>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between py-3 border-t border-gray-800"
                      >
                        <div>
                          <p className="text-white">
                            {payment.payment_type === "dp"
                              ? `DP (${payment.percentage}%)`
                              : "Pelunasan"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.payment_date
                              ? formatDateTime(payment.payment_date)
                              : "Belum dibayar"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            {formatCurrency(Number(payment.amount))}
                          </p>
                          <Badge
                            className={
                              payment.status === "lunas"
                                ? "bg-green-600 text-white"
                                : "bg-amber-600 text-white"
                            }
                          >
                            {payment.status === "lunas" ? "Lunas" : "Belum Lunas"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {payments.some((p) => p.status === "belum_lunas") && (
                  <Link href={`/client/events/${id}/payment`}>
                    <Button className="w-full mt-4 bg-primary">
                      Upload Bukti Pembayaran
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
