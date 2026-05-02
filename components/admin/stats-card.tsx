import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: {
    value: number
    label: string
    type: "increase" | "decrease"
  }
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs",
                change.type === "increase" ? "text-green-600" : "text-red-600"
              )}
            >
              {change.type === "increase" ? "+" : ""}
              {change.value}% {change.label}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", iconBgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </div>
  )
}
