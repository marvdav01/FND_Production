"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Menu, Calendar, MapPin, ArrowRight, ChevronRight } from "lucide-react"
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

export default function ClientHomePage() {
  const supabase = createClient()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Edisyah")

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()
    
    if (userData.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userData.user.id)
        .single()
      
      if (profile) {
        setUserName(profile.full_name.split(" ")[0])
      }

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("client_id", userData.user.id)
        .in("status", ["pending", "survey", "deal", "running"])
        .order("event_date", { ascending: true })
        .limit(5)

      setEvents(eventsData || [])
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">F</span>
            <span className="text-xl font-bold text-white">ND</span>
            <span className="text-sm text-gray-400">Production</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative text-white">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center">
            3
          </span>
        </Button>
      </header>

      {/* Welcome */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-white">
          Hi, {userName} <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-gray-400">Selamat datang kembali</p>
      </div>

      {/* Booking CTA */}
      <div className="px-4 mb-6">
        <Link href="/client/booking">
          <Card className="bg-primary border-0 overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Booking Event</h3>
                  <p className="text-sm text-white/80">Buat booking event baru</p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-white" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Active Events */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Event Aktif</h2>
          <Link href="/client/events" className="text-sm text-primary">
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
          <Card className="bg-[#1a2029] border-gray-800">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Belum ada event aktif</p>
              <Link href="/client/booking">
                <Button className="mt-4 bg-primary">Booking Sekarang</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Link key={event.id} href={`/client/events/${event.id}`}>
                <Card className="bg-[#1a2029] border-gray-800 hover:border-gray-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white">{event.name}</h3>
                          <Badge className={statusColors[event.status]}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(event.event_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-600" />
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
