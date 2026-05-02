import { MobileNav } from "@/components/mobile/mobile-nav"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0f1419] text-white">
      <div className="mx-auto max-w-md min-h-screen pb-20">
        {children}
      </div>
      <MobileNav userType="client" />
    </div>
  )
}
