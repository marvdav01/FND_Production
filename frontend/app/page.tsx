import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Package, Users, ShieldCheck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{ 
          backgroundImage: `url('/mobile_login_background_1777809481060.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

      {/* Navbar (Minimalist) */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-8 sm:px-12">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-primary">F</span>
          <span className="text-2xl font-black tracking-tighter text-white">ND</span>
        </div>
        <div className="hidden sm:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Fitur</Link>
          <Link href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Tentang Kami</Link>
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link href="/auth/login">Masuk</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Sistem Manajemen Event Terpadu</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Terangi Event Anda dengan <span className="text-primary">FND Production</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Solusi profesional untuk manajemen lighting, crew, dan inventory. 
            Kelola seluruh operasional event Anda dalam satu platform cerdas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 group">
              <Link href="/auth/login">
                Mulai Sekarang <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 rounded-2xl">
              <Link href="/auth/signup">Daftar Akun</Link>
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-16 border-t border-white/10 pt-12">
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">120+</p>
            <p className="text-sm text-slate-500 font-medium">Event Sukses</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">500+</p>
            <p className="text-sm text-slate-500 font-medium">Alat Ready</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">40+</p>
            <p className="text-sm text-slate-500 font-medium">Crew Ahli</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-white">24/7</p>
            <p className="text-sm text-slate-500 font-medium">Dukungan</p>
          </div>
        </div>
      </main>

      {/* Feature Section (Quick Peek) */}
      <section className="relative z-10 bg-slate-950/50 backdrop-blur-3xl border-t border-white/10 py-20 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
            <div className="p-3 w-fit rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Manajemen Event</h3>
            <p className="text-slate-400 leading-relaxed">Pantau jadwal, status, dan detail teknis setiap event secara real-time.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
            <div className="p-3 w-fit rounded-2xl bg-orange-500/10 mb-6 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Inventory Alat</h3>
            <p className="text-slate-400 leading-relaxed">Kontrol stok alat lighting dan perlengkapan panggung secara otomatis.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
            <div className="p-3 w-fit rounded-2xl bg-blue-500/10 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Portal Keamanan</h3>
            <p className="text-slate-400 leading-relaxed">Akses terproteksi untuk Admin, Crew, dan Client dengan peran yang jelas.</p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-6 py-12 text-center border-t border-white/5">
        <p className="text-sm text-slate-500">
          &copy; 2026 FND Production. Didesain untuk keunggulan operasional.
        </p>
      </footer>

      {/* Decorative Blobs */}
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
    </div>
  )
}
