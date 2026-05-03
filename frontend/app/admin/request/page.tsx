"use client"

import { useState, useEffect } from "react"
import { fetchAPI } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, XCircle, Eye, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/lib/types"

interface EventRequest extends Omit<Event, "client"> {
  client: {
    full_name: string
    phone: string
  } | null
}

export default function RequestPage() {
  const [requests, setRequests] = useState<EventRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    setLoading(true)
    try {
      const res = await fetchAPI('/events?status=pending')
      if (res.success) {
        const mappedData = res.data.map((e: any) => ({
          ...e,
          event_type: e.type,
          total_price: e.total_amount,
          client: { full_name: e.client_name, phone: e.client_phone || '-' }
        }))
        setRequests(mappedData)
      } else {
        console.error("Error fetching requests:", res.error)
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(eventId: string, status: "survey" | "cancel") {
    try {
      const res = await fetchAPI(`/events/${eventId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
      if (res.success) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Request</h1>
          <p className="text-muted-foreground">Permintaan booking event baru</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{requests.length}</p>
                <p className="text-sm text-muted-foreground">Pending Request</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Tidak ada request</h3>
              <p className="text-muted-foreground mt-1">
                Semua request sudah diproses
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Tanggal Event</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead className="text-right">Estimasi</TableHead>
                    <TableHead className="w-[150px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.name}</div>
                        <div className="text-sm text-muted-foreground">{request.event_type}</div>
                      </TableCell>
                      <TableCell>
                        <div>{request.client?.full_name || "-"}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.client?.phone}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(request.event_date)}</TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(Number(request.total_price) || 0)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Link href={`/admin/events/${request.id}`}>
                            <Button variant="ghost" size="icon" title="Lihat Detail">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600"
                            onClick={() => updateStatus(request.id, "survey")}
                            title="Terima"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => updateStatus(request.id, "cancel")}
                            title="Tolak"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
