"use client"

import { useState, useEffect } from "react"
import { fetchAPI } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Clock, ChevronRight, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Event } from "@/lib/types"
import { logoutAction } from "@/lib/actions"

const filters = ["Hari Ini", "Besok", "Minggu Ini"]

interface CrewEvent extends Event {
  schedules: {
    schedule_time: string
    activity: string
    description: string
  }[]
}

export default function CrewHomePage() {
  const router = useRouter()
  const [events, setEvents] = useState<CrewEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("Hari Ini")

  async function handleLogout() {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      await logoutAction()
      localStorage.removeItem('token')
      router.push("/auth/login")
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [activeFilter])

  async function fetchAssignments() {
    setLoading(true)
    try {
      const res = await fetchAPI('/events/assigned')
      if (res.success) {
        let eventsData = res.data

        let dateFilter = new Date()
        let endDate = new Date()

        if (activeFilter === "Hari Ini") {
          // Today only
        } else if (activeFilter === "Besok") {
          dateFilter.setDate(dateFilter.getDate() + 1)
          endDate.setDate(endDate.getDate() + 1)
        } else {
          // This week
          endDate.setDate(endDate.getDate() + 7)
        }

        const dateFilterStr = dateFilter.toISOString().split("T")[0]
        const endDateStr = endDate.toISOString().split("T")[0]

        eventsData = eventsData.filter((e: any) => 
          e.event_date >= dateFilterStr && e.event_date <= endDateStr
        )

        setEvents(eventsData)
      } else {
        console.error("Error fetching assignments:", res.error)
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
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5)
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Crew Saya</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-400 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </header>

      {/* Filter Tabs */}
      <div className="px-4 py-3">
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

      {/* Events */}
      <div className="px-4 py-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
          <Card className="bg-[#1a2029] border-gray-800">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Tidak ada jadwal</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id}>
                <Card className="bg-[#1a2029] border-gray-800 mb-3">
                  <div className="h-24 bg-gradient-to-r from-primary/30 to-primary/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2029] to-transparent" />
                  </div>
                  <CardContent className="p-4 -mt-8 relative">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-lg">
                            {event.name}
                          </h3>
                          <Badge className="bg-primary text-white">
                            {activeFilter === "Hari Ini" ? "Hari Ini" : formatDate(event.event_date)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                          <Clock className="h-3 w-3" />
                          {event.start_time
                            ? `${formatTime(event.start_time)} - ${event.end_time ? formatTime(event.end_time) : "Selesai"}`
                            : "-"}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <MapPin className="h-3 w-3" />
                          {event.venue_name || event.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule */}
                {event.schedules && event.schedules.length > 0 && (
                  <Card className="bg-[#1a2029] border-gray-800">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-white mb-4">Jadwal</h4>
                      <div className="space-y-4">
                        {event.schedules
                          .sort((a, b) => a.schedule_time.localeCompare(b.schedule_time))
                          .map((schedule, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="h-3 w-3 rounded-full bg-primary" />
                                {index < event.schedules.length - 1 && (
                                  <div className="w-0.5 flex-1 bg-gray-700 mt-1" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <p className="text-sm text-gray-500">
                                  {formatTime(schedule.schedule_time)}
                                </p>
                                <p className="font-medium text-white">
                                  {schedule.activity}
                                </p>
                                {schedule.description && (
                                  <p className="text-sm text-gray-400">
                                    {schedule.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
