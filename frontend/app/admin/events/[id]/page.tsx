"use client"

import { useState, useEffect, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  Phone,
  Package,
  Users,
  CreditCard,
  Edit,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import type { Event, EventStatus, Equipment, Profile, Payment } from "@/lib/types"

const statusColors: Record<EventStatus, string> = {
  pending: "bg-gray-100 text-gray-700 border-gray-300",
  survey: "bg-amber-100 text-amber-700 border-amber-300",
  deal: "bg-blue-100 text-blue-700 border-blue-300",
  running: "bg-orange-100 text-orange-700 border-orange-300",
  selesai: "bg-green-100 text-green-700 border-green-300",
  cancel: "bg-red-100 text-red-700 border-red-300",
}

const statusOrder: EventStatus[] = ["pending", "survey", "deal", "running", "selesai"]

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()
  const [event, setEvent] = useState<Event | null>(null)
  const [eventEquipment, setEventEquipment] = useState<any[]>([])
  const [eventCrew, setEventCrew] = useState<any[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  async function fetchEventDetails() {
    setLoading(true)

    // Fetch event
    const { data: eventData } = await supabase
      .from("events")
      .select(`
        *,
        client:profiles!events_client_id_fkey(id, full_name, phone, address)
      `)
      .eq("id", id)
      .single()

    if (eventData) {
      setEvent(eventData)
    }

    // Fetch equipment
    const { data: eqData } = await supabase
      .from("event_equipment")
      .select(`
        *,
        equipment(*)
      `)
      .eq("event_id", id)

    setEventEquipment(eqData || [])

    // Fetch crew
    const { data: crewData } = await supabase
      .from("event_crew")
      .select(`
        *,
        crew:profiles(*)
      `)
      .eq("event_id", id)

    setEventCrew(crewData || [])

    // Fetch payments
    const { data: paymentData } = await supabase
      .from("payments")
      .select("*")
      .eq("event_id", id)
      .order("created_at")

    setPayments(paymentData || [])

    setLoading(false)
  }

  async function updateStatus(newStatus: EventStatus) {
    const { error } = await supabase
      .from("events")
      .update({ status: newStatus })
      .eq("id", id)

    if (!error) {
      setEvent((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Event tidak ditemukan</h2>
        <Link href="/admin/events">
          <Button className="mt-4">Kembali ke Events</Button>
        </Link>
      </div>
    )
  }

  const currentStatusIndex = statusOrder.indexOf(event.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{event.name}</h1>
            <p className="text-muted-foreground">{event.event_type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={statusColors[event.status]}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
          <Link href={`/admin/events/${id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Status Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {statusOrder.map((status, index) => (
              <div key={status} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStatusIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStatusIndex ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 capitalize ${
                    index <= currentStatusIndex ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {status}
                </span>
                {index < statusOrder.length - 1 && (
                  <div
                    className={`absolute h-0.5 w-full max-w-[100px] ${
                      index < currentStatusIndex ? "bg-primary" : "bg-muted"
                    }`}
                    style={{ left: "50%", top: "20px" }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Select value={event.status} onValueChange={(v) => updateStatus(v as EventStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOrder.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
                <SelectItem value="cancel">Cancel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="crew">Crew</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4 text-primary" />
                  Detail Event
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tanggal</span>
                  <span className="font-medium">{formatDate(event.event_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waktu</span>
                  <span className="font-medium">
                    {event.start_time || "-"} - {event.end_time || "Selesai"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium text-primary">
                    {formatCurrency(Number(event.total_price) || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-primary" />
                  Lokasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="font-medium">{event.venue_name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lokasi</span>
                  <span className="font-medium">{event.location}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-primary" />
                  Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama</span>
                  <span className="font-medium">{event.client?.full_name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telepon</span>
                  <span className="font-medium">{event.client?.phone || "-"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kebutuhan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {event.requirements || "Tidak ada kebutuhan khusus"}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Equipment ({eventEquipment.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventEquipment.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Belum ada equipment</p>
              ) : (
                <div className="space-y-3">
                  {eventEquipment.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{item.equipment.name}</p>
                        <p className="text-sm text-muted-foreground">{item.equipment.category}</p>
                      </div>
                      <span className="font-medium">{item.quantity} Unit</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crew">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Crew ({eventCrew.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventCrew.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Belum ada crew</p>
              ) : (
                <div className="space-y-3">
                  {eventCrew.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.crew.full_name}</p>
                          <p className="text-sm text-muted-foreground">{item.role || item.crew.position}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment
              </CardTitle>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(Number(event.total_price) || 0)}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Belum ada pembayaran</p>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {payment.payment_type === "dp"
                            ? `DP (${payment.percentage}%)`
                            : "Pelunasan"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.payment_date
                            ? new Date(payment.payment_date).toLocaleDateString("id-ID")
                            : "Belum dibayar"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(Number(payment.amount))}</p>
                        <Badge
                          variant="outline"
                          className={
                            payment.status === "lunas"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-amber-100 text-amber-700 border-amber-300"
                          }
                        >
                          {payment.status === "lunas" ? "Lunas" : "Belum Lunas"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
