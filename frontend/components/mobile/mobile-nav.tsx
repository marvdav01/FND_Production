"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileNavProps {
  userType: "client" | "crew"
}

export function MobileNav({ userType }: MobileNavProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
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

  if (!isMobile) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/20 shadow-2xl">
      <div className="mx-auto max-w-md px-2 pb-safe">
        <div className="flex items-center justify-around py-3">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all duration-300 active:scale-95",
                  isActive 
                    ? "text-primary bg-primary/20 shadow-lg" 
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                )}
              >
                <link.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
