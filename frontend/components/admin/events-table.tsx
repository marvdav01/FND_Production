import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Event, EventStatus, EVENT_STATUS_LABELS, formatCurrency } from "@/lib/types"

interface EventsTableProps {
  events: Event[]
  showViewAll?: boolean
}

const STATUS_CLASS: Record<EventStatus, string> = {
  pending: "border-gray-300 text-gray-600 bg-gray-50",
  survey: "border-amber-300 text-amber-700 bg-amber-50",
  deal: "border-blue-300 text-blue-700 bg-blue-50",
  running: "border-orange-300 text-orange-700 bg-orange-50",
  selesai: "border-green-300 text-green-700 bg-green-50",
  cancel: "border-red-300 text-red-700 bg-red-50",
}

export function EventsTable({ events, showViewAll = true }: EventsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-5 pb-0">
        <h3 className="font-semibold text-card-foreground">Event Terbaru</h3>
        {showViewAll && (
          <Link
            href="/admin/events"
            className="text-sm text-primary hover:underline"
          >
            Lihat Semua
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Nama Event
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Client
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Tanggal
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Lokasi
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">
                Total
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium text-card-foreground">
                  {event.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {event.client?.full_name || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(event.event_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {event.location}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={STATUS_CLASS[event.status]}>
                    {EVENT_STATUS_LABELS[event.status]}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-card-foreground">
                  {formatCurrency(event.total_price)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
