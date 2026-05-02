"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock } from "lucide-react"
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

export default function CrewEventsPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  async function fetchAssignments() {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()

    if (userData.user) {
      const { data: assignments } = await supabase
        .from("event_crew")
        .select("event_id")
        .eq("crew_id", userData.user.id)

      if (assignments && assignments.length > 0) {
        const eventIds = assignments.map((a) => a.event_id)

        const { data: eventsData } = await supabase
          .from("events")
          .select("*")
          .in("id", eventIds)
          .order("event_date", { ascending: true })

        setEvents(eventsData || [])
      }
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

  const formatTime = (time: string | null) => {
    return time ? time.slice(0, 5) : "-"
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="p-4 pt-12">
        <h1 className="text-xl font-semibold text-white">Event Saya</h1>
        <p className="text-gray-400">Semua event yang ditugaskan</p>
      </header>

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
              <p className="text-gray-400">Belum ada penugasan</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Link key={event.id} href={`/crew/events/${event.id}`}>
                <Card className="bg-[#1a2029] border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-white">{event.name}</h3>
                        <p className="text-sm text-gray-500">{event.event_type}</p>
                      </div>
                      <Badge className={statusColors[event.status]}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.event_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(event.start_time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
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
