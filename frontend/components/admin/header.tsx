"use client"

import { Bell, Calendar, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function AdminHeader({ title, subtitle, onMenuClick }: HeaderProps) {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search event, client, equipment..."
            className="w-80 pl-10 bg-muted/50"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            6
          </span>
        </Button>

        {/* Calendar */}
        <Button variant="ghost" size="icon">
          <Calendar className="h-5 w-5" />
        </Button>

        {/* Date */}
        <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm md:flex">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {today}
        </div>
      </div>
    </header>
  )
}
