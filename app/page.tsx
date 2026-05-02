import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl font-bold">
            <span className="text-primary">F</span>
            <span className="text-white">ND</span>
          </span>
          <span className="text-lg text-muted-foreground">PRODUCTION</span>
        </div>

        <h1 className="text-3xl font-bold text-white">
          Event Lighting Management System
        </h1>
        
        <p className="text-muted-foreground text-lg">
          Sistem manajemen lengkap untuk perusahaan event lighting.
          Kelola event, inventory, crew, dan keuangan dalam satu platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/client">Client Portal</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/crew">Crew Portal</Link>
          </Button>
        </div>

        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">128+</p>
            <p className="text-sm text-muted-foreground">Events</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">520+</p>
            <p className="text-sm text-muted-foreground">Equipment</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">35+</p>
            <p className="text-sm text-muted-foreground">Crew</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">50+</p>
            <p className="text-sm text-muted-foreground">Clients</p>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-6 text-sm text-muted-foreground">
        &copy; 2026 FND Production. All rights reserved.
      </footer>
    </div>
  )
}
