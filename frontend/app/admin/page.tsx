
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

import { fetchAPI } from "@/lib/api"

async function getDashboardData() {
  try {
    // Fetch data from Node.js backend
    const [eventsRes, equipmentRes, crewRes] = await Promise.all([
      fetchAPI('/events'),
      fetchAPI('/equipment'),
      fetchAPI('/crew')
    ]);

    const events = eventsRes.data || [];
    const equipmentData = equipmentRes.data || [];
    const crewData = crewRes.data || [];

    // Stats calculations
    const totalEvents = events.length;
    
    const today = new Date().toISOString().split("T")[0];
    const eventsToday = events.filter((e: any) => e.event_date && e.event_date.startsWith(today)).length;

    const totalRevenue = events
      .filter((e: any) => ["deal", "running", "selesai"].includes(e.status))
      .reduce((sum: number, e: any) => sum + (e.total_amount || 0), 0);

    const totalEquipment = equipmentData.reduce((sum: number, e: any) => sum + (e.total_stock || 0), 0);
    const availableEquipment = equipmentData.reduce((sum: number, e: any) => sum + (e.available_stock || 0), 0);

    const availableCrew = crewData.filter((c: any) => c.status === "available").length;
    const totalCrew = crewData.length;

    const recentEvents = [...events]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 5)
      .map((e: any) => ({
        ...e,
        total_price: e.total_amount,
        client: { full_name: e.client_name }
      }));

    const upcomingEvents = events
      .filter((e: any) => e.event_date && e.event_date >= today && ["pending", "survey", "deal", "running"].includes(e.status))
      .sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      .slice(0, 5)
      .map((e: any) => ({
        ...e,
        total_price: e.total_amount,
        client: { full_name: e.client_name }
      }));

    const statusCounts: Record<EventStatus, number> = {
      pending: 0, survey: 0, deal: 0, running: 0, selesai: 0, cancel: 0,
    };
    events.forEach((e: any) => {
      if (statusCounts[e.status as EventStatus] !== undefined) {
        statusCounts[e.status as EventStatus]++;
      }
    });

    const eventsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status: status as EventStatus,
      count,
      percentage: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0,
    }));

    const currentYear = new Date().getFullYear();
    const monthlyEvents = Array.from({ length: 12 }, (_, i) => {
      const month = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][i];
      const count = events.filter((e: any) => {
        if (!e.event_date) return false;
        const date = new Date(e.event_date);
        return date.getFullYear() === currentYear && date.getMonth() === i;
      }).length;
      return { month, count };
    });

    const topEquipment = equipmentData
      .sort((a: any, b: any) => (b.total_stock || 0) - (a.total_stock || 0))
      .slice(0, 5)
      .map((e: any) => ({
        ...e,
        total_quantity: e.total_stock,
        available_quantity: e.available_stock
      }));

    const crewList = crewData.slice(0, 6).map((c: any) => ({
      ...c,
      full_name: c.name,
      position: c.role,
      availability: c.status === 'available' ? 'tersedia' : 'on_job'
    }));

    return {
      stats: { totalEvents, eventsToday, totalRevenue, availableEquipment, totalEquipment, availableCrew, totalCrew },
      recentEvents,
      upcomingEvents,
      eventsByStatus,
      monthlyEvents,
      topEquipment,
      crewList,
    };
  } catch (error: any) {
    console.error("Failed to fetch dashboard data:", error);
    
    if (error.message === 'Unauthorized') {
      const { redirect } = await import('next/navigation');
      redirect('/auth/login');
    }

    // Return empty defaults if fetch fails
    return {
      stats: { totalEvents: 0, eventsToday: 0, totalRevenue: 0, availableEquipment: 0, totalEquipment: 0, availableCrew: 0, totalCrew: 0 },
      recentEvents: [], upcomingEvents: [], eventsByStatus: [], monthlyEvents: [], topEquipment: [], crewList: []
    };
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
