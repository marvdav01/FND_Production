"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  CalendarDays,
  DollarSign,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Calendar, label: "Event", href: "/admin/events" },
  { icon: FileText, label: "Request", href: "/admin/request" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: CalendarDays, label: "Calendar", href: "/admin/calendar" },
  { icon: Package, label: "Inventory", href: "/admin/inventory" },
  { icon: Users, label: "Crew", href: "/admin/crew" },
  { icon: DollarSign, label: "Finance", href: "/admin/finance" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function AdminMobileNav() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
      <Link href="/admin" className="font-bold tracking-tight">
        <span className="text-primary">F</span>ND
        <span className="ml-2 text-xs font-medium text-muted-foreground">PRODUCTION</span>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="border-b px-5 py-4 text-left">
            <SheetTitle>FND Production</SheetTitle>
          </SheetHeader>
          <nav className="space-y-1 p-3">
            {menuItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
