"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Filter } from "lucide-react"
import Link from "next/link"
import type { Event, EventStatus } from "@/lib/types"

const statusColors: Record<EventStatus, string> = {
  pending: "bg-gray-700 text-gray-300",
  survey: "bg-amber-600 text-white",
  deal: "bg-blue-600 text-white",
  running: "bg-orange-600 text-white",
  selesai: "bg-green-600 text-white",
  cancel: "bg-red-600 text-white",
}

const filters = ["Semua", "Survey", "Deal", "Running", "Selesai"]

export default function ClientEventsPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("Semua")

  useEffect(() => {
    fetchEvents()
  }, [activeFilter])

  async function fetchEvents() {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()

    if (userData.user) {
      let query = supabase
        .from("events")
        .select("*")
        .eq("client_id", userData.user.id)
        .order("event_date", { ascending: false })

      if (activeFilter !== "Semua") {
        query = query.eq("status", activeFilter.toLowerCase())
      }

      const { data } = await query
      setEvents(data || [])
    }
    setLoading(false)
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 pt-12">
        <Link href="/client">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-white">Event Saya</h1>
        <div className="ml-auto">
          <Button variant="ghost" size="icon" className="text-white">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              size="sm"
              className={
                activeFilter === filter
                  ? "bg-primary text-white"
                  : "bg-[#1a2029] text-gray-400 hover:bg-[#252d38]"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 py-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
          <Card className="bg-[#1a2029] border-gray-800">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Belum ada event</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Link key={event.id} href={`/client/events/${event.id}`}>
                <Card className="bg-[#1a2029] border-gray-800 overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2029] to-transparent" />
                  </div>
                  <CardContent className="p-4 -mt-8 relative">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{event.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.event_date)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <MapPin className="h-3 w-3" />
                          {event.venue_name || event.location}
                        </div>
                      </div>
                      <Badge className={statusColors[event.status]}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                      <span className="text-sm text-gray-400">Total</span>
                      <span className="font-semibold text-white">
                        {formatCurrency(Number(event.total_price) || 0)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
