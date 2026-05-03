"use client"

import { useState, useEffect } from "react"
import { fetchAPI } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventsChart } from "@/components/admin/events-chart"
import { StatusChart } from "@/components/admin/status-chart"
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign,
  FileText,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EventStatus } from "@/lib/types"
import { toast } from "sonner"

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [rawEvents, setRawEvents] = useState<any[]>([])
  const [rawPayments, setRawPayments] = useState<any[]>([])

  useEffect(() => {
    fetchReportData()
  }, [])

  async function fetchReportData() {
    setLoading(true)
    try {
      const [eventsRes, paymentsRes] = await Promise.all([
        fetchAPI('/events'),
        fetchAPI('/payments')
      ])

      if (eventsRes.success && paymentsRes.success) {
        const events = eventsRes.data
        const payments = paymentsRes.data
        setRawEvents(events)
        setRawPayments(payments)

        // Monthly stats for chart
        const currentYear = new Date().getFullYear()
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
          const month = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][i]
          const count = events.filter((e: any) => {
            const date = new Date(e.event_date)
            return date.getFullYear() === currentYear && date.getMonth() === i
          }).length
          return { month, count }
        })

        // Status distribution
        const statusCounts: Record<string, number> = {}
        events.forEach((e: any) => {
          statusCounts[e.status] = (statusCounts[e.status] || 0) + 1
        })
        const eventsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
          status: status as EventStatus,
          count,
          percentage: Math.round((count / events.length) * 100)
        }))

        // Financial summary
        const totalRevenue = payments.filter((p: any) => p.status === 'paid').reduce((sum: number, p: any) => sum + Number(p.amount), 0)
        const pendingRevenue = payments.filter((p: any) => p.status === 'unpaid').reduce((sum: number, p: any) => sum + Number(p.amount), 0)

        setData({
          monthlyData,
          eventsByStatus,
          totalRevenue,
          pendingRevenue,
          totalEvents: events.length
        })
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function exportToPDF() {
    try {
      const token = localStorage.getItem('token')
      const url = `http://localhost:4000/api/reports/export/pdf?token=${token}`
      window.open(url, '_blank')
      toast.success("Mempersiapkan download PDF...")
    } catch (error) {
      console.error(error)
      toast.error("Gagal mengekspor PDF")
    }
  }

  async function exportToExcel() {
    try {
      const token = localStorage.getItem('token')
      const url = `http://localhost:4000/api/reports/export/excel?token=${token}`
      
      // We can use a simple link click for downloading
      const a = document.createElement('a')
      a.href = url
      // Adding authorization header via query param is one way if the backend supports it, 
      // but a better way is to use a form or fetch and then download.
      // For now, let's just use window.open if the backend allows auth via cookie or query.
      
      window.open(url, '_blank')
      toast.success("Mempersiapkan download Excel...")
    } catch (error) {
      console.error(error)
      toast.error("Gagal mengekspor Excel")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Analisa performa dan keuangan</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportToPDF}>
              Export ke PDF (.pdf)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToExcel}>
              Export ke Excel (.xlsx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Event</p>
                <p className="text-xl font-bold">{data?.totalEvents || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold">Rp {(data?.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">Rp {(data?.pendingRevenue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-xl font-bold">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EventsChart data={data?.monthlyData || []} />
        <StatusChart data={data?.eventsByStatus || []} total={data?.totalEvents || 0} />
      </div>
    </div>
  )
}
