"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CalendarDays,
  Package,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  user?: {
    name: string
    role: string
    avatar?: string
  }
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Calendar, label: "Event", href: "/admin/events" },
  { icon: FileText, label: "Request", href: "/admin/requests" },
  { icon: CalendarDays, label: "Calendar", href: "/admin/calendar" },
  { icon: Package, label: "Inventory", href: "/admin/inventory" },
  { icon: Users, label: "Crew", href: "/admin/crew" },
  { icon: DollarSign, label: "Finance", href: "/admin/finance" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function AdminSidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <span className="text-2xl font-bold">
          <span className="text-primary">F</span>
          <span>ND</span>
        </span>
        <span className="text-xs text-muted-foreground">PRODUCTION</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || "Victor Wonggow"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role || "Administrator"}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent transition-colors">
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}
