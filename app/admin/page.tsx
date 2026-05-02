import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/header"
import { StatsCard } from "@/components/admin/stats-card"
import { EventsChart } from "@/components/admin/events-chart"
import { StatusChart } from "@/components/admin/status-chart"
import { UpcomingEvents } from "@/components/admin/upcoming-events"
import { EventsTable } from "@/components/admin/events-table"
import { InventoryStatus } from "@/components/admin/inventory-status"
import { CrewStatus } from "@/components/admin/crew-status"
import { Calendar, DollarSign, Package, Users } from "lucide-react"
import { EventStatus } from "@/lib/types"

async function getDashboardData() {
  const supabase = await createClient()

  // Get total events count
  const { count: totalEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })

  // Get today's events
  const today = new Date().toISOString().split("T")[0]
  const { count: eventsToday } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("event_date", today)

  // Get total revenue (from completed events)
  const { data: revenueData } = await supabase
    .from("events")
    .select("total_price")
    .in("status", ["deal", "running", "selesai"])

  const totalRevenue = revenueData?.reduce((sum, e) => sum + (e.total_price || 0), 0) || 0

  // Get equipment stats
  const { data: equipmentData } = await supabase
    .from("equipment")
    .select("total_quantity, available_quantity")

  const totalEquipment = equipmentData?.reduce((sum, e) => sum + e.total_quantity, 0) || 0
  const availableEquipment = equipmentData?.reduce((sum, e) => sum + e.available_quantity, 0) || 0

  // Get crew stats
  const { data: crewData, count: totalCrew } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("role", "crew")

  const availableCrew = crewData?.filter((c) => c.availability === "tersedia").length || 0

  // Get recent events with client info
  const { data: recentEvents } = await supabase
    .from("events")
    .select(`
      *,
      client:profiles!events_client_id_fkey(*)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get upcoming events
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", today)
    .in("status", ["pending", "survey", "deal", "running"])
    .order("event_date", { ascending: true })
    .limit(5)

  // Get events by status for pie chart
  const { data: statusData } = await supabase
    .from("events")
    .select("status")

  const statusCounts: Record<EventStatus, number> = {
    pending: 0,
    survey: 0,
    deal: 0,
    running: 0,
    selesai: 0,
    cancel: 0,
  }

  statusData?.forEach((e) => {
    statusCounts[e.status as EventStatus]++
  })

  const total = statusData?.length || 0
  const eventsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status: status as EventStatus,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }))

  // Get monthly events for chart (current year)
  const currentYear = new Date().getFullYear()
  const { data: monthlyData } = await supabase
    .from("events")
    .select("event_date")
    .gte("event_date", `${currentYear}-01-01`)
    .lte("event_date", `${currentYear}-12-31`)

  const monthlyEvents = Array.from({ length: 12 }, (_, i) => {
    const month = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][i]
    const count = monthlyData?.filter((e) => {
      const eventMonth = new Date(e.event_date).getMonth()
      return eventMonth === i
    }).length || 0
    return { month, count }
  })

  // Get top equipment
  const { data: topEquipment } = await supabase
    .from("equipment")
    .select("*")
    .order("total_quantity", { ascending: false })
    .limit(5)

  // Get crew list
  const { data: crewList } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "crew")
    .limit(6)

  return {
    stats: {
      totalEvents: totalEvents || 0,
      eventsToday: eventsToday || 0,
      totalRevenue,
      availableEquipment,
      totalEquipment,
      availableCrew,
      totalCrew: totalCrew || 0,
    },
    recentEvents: recentEvents || [],
    upcomingEvents: upcomingEvents || [],
    eventsByStatus,
    monthlyEvents,
    topEquipment: topEquipment || [],
    crewList: crewList || [],
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" subtitle="Welcome back, Administrator" />

      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total Event"
            value={data.stats.totalEvents}
            change={{ value: 12, label: "dari bulan lalu", type: "increase" }}
            icon={Calendar}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatsCard
            title="Event Hari Ini"
            value={data.stats.eventsToday}
            change={{ value: 7, label: "dari kemarin", type: "increase" }}
            icon={Calendar}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatsCard
            title="Total Revenue"
            value={`Rp ${(data.stats.totalRevenue / 1000000).toFixed(0)}.000.000`}
            change={{ value: 18, label: "dari bulan lalu", type: "increase" }}
            icon={DollarSign}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <StatsCard
            title="Alat Tersedia"
            value={data.stats.availableEquipment}
            subtitle={`dari total ${data.stats.totalEquipment} unit`}
            icon={Package}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatsCard
            title="Crew Tersedia"
            value={data.stats.availableCrew}
            subtitle={`dari total ${data.stats.totalCrew} crew`}
            icon={Users}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100"
          />
        </div>

        {/* Charts Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EventsChart data={data.monthlyEvents} />
          </div>
          <StatusChart data={data.eventsByStatus} total={data.stats.totalEvents} />
        </div>

        {/* Upcoming Events */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EventsTable events={data.recentEvents} />
          </div>
          <UpcomingEvents events={data.upcomingEvents} />
        </div>

        {/* Inventory and Crew Status */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <InventoryStatus equipment={data.topEquipment} />
          <CrewStatus crew={data.crewList} />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          &copy; 2026 FND Production. All rights reserved.
        </footer>
      </main>
    </div>
  )
}
