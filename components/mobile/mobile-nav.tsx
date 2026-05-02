"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  userType: "client" | "crew"
}

export function MobileNav({ userType }: MobileNavProps) {
  const pathname = usePathname()
  const basePath = userType === "client" ? "/client" : "/crew"

  const links = [
    {
      href: basePath,
      label: "Home",
      icon: Home,
    },
    {
      href: `${basePath}/events`,
      label: "Event",
      icon: Calendar,
    },
    {
      href: `${basePath}/profile`,
      label: "Profile",
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f1419] border-t border-gray-800">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around py-3">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-1",
                  isActive ? "text-primary" : "text-gray-400"
                )}
              >
                <link.icon className="h-5 w-5" />
                <span className="text-xs">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
