import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminMobileNav } from "@/components/admin/mobile-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <AdminMobileNav />
      <div className="lg:pl-64">
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
