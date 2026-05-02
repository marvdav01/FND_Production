"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { EventStatus, EVENT_STATUS_LABELS } from "@/lib/types"

interface StatusChartProps {
  data: { status: EventStatus; count: number; percentage: number }[]
  total: number
}

const STATUS_COLORS: Record<EventStatus, string> = {
  pending: "#6B7280",
  survey: "#F59E0B",
  deal: "#3B82F6",
  running: "#F97316",
  selesai: "#22C55E",
  cancel: "#EF4444",
}

export function StatusChart({ data, total }: StatusChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold text-card-foreground">Status Event</h3>
      <div className="flex items-center gap-6">
        <div className="relative h-40 w-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="count"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-card-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.status} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[item.status] }}
                />
                <span className="text-muted-foreground">
                  {EVENT_STATUS_LABELS[item.status]}
                </span>
              </div>
              <span className="text-card-foreground">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
