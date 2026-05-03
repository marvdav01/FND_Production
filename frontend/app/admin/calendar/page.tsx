"use client"

import { useState, useEffect } from "react"
import { fetchAPI } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Clock, Calendar as CalendarIcon } from "lucide-react"
import { EventStatus } from "@/lib/types"

const statusColors: Record<EventStatus, string> = {
  pending: "bg-gray-100 text-gray-700 border-gray-300",
  survey: "bg-amber-100 text-amber-700 border-amber-300",
  deal: "bg-blue-100 text-blue-700 border-blue-300",
  running: "bg-orange-100 text-orange-700 border-orange-300",
  selesai: "bg-green-100 text-green-700 border-green-300",
  cancel: "bg-red-100 text-red-700 border-red-300",
}

export default function AdminCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setLoading(true)
    try {
      const res = await fetchAPI('/events')
      if (res.success) {
        setEvents(res.data)
      }
    } catch (error) {
      console.error("Error fetching calendar events:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedDateEvents = events.filter(e => {
    if (!e.event_date || !date) return false
    const eventDate = new Date(e.event_date)
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    )
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
        <p className="text-muted-foreground">Jadwal event dan booking</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 lg:col-span-4">
          <CardHeader>
            <CardTitle>Pilih Tanggal</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-7 lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Event pada {date?.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
            </CardTitle>
            <Badge variant="secondary">{selectedDateEvents.length} Event</Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Tidak ada event</h3>
                  <p className="text-muted-foreground mt-1">
                    Silakan pilih tanggal lain atau buat event baru
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg border border-border bg-sidebar hover:bg-sidebar-accent transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{event.name}</h4>
                          <p className="text-sm text-muted-foreground">{event.type}</p>
                        </div>
                        <Badge variant="outline" className={statusColors[event.status as EventStatus]}>
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.start_time || "09:00"} - {event.end_time || "Selesai"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
