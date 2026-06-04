"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { fetchAPI } from "@/lib/api"
import { setClientSession } from "@/lib/session"
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (!res.success) {
        setError(res.error || "Gagal masuk")
        return
      }

      const token = res.data?.token ?? res.token
      const user = res.data?.user ?? res.user

      if (!token || !user) {
        setError("Gagal mengambil data pengguna")
        return
      }

      localStorage.setItem('token', token)
      setClientSession(token)

      if (user.role !== "admin") {
        setError("Akun hanya dapat mengakses admin")
        return
      }

      router.push("/admin")
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan pada server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 p-6">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{ 
          backgroundImage: `url('/mobile_login_background_1777809481060.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <span className="text-4xl font-black tracking-tighter text-primary">F</span>
            <span className="text-4xl font-black tracking-tighter text-white">ND</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Selamat Datang</h1>
          <p className="mt-2 text-slate-400">Masuk untuk akses sistem FND Production</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-200 bg-red-500/20 border border-red-500/50 rounded-xl animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 ml-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  className="h-13 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Lupa Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-13 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  Masuk Sekarang <LogIn className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Belum punya akun?{" "}
              <Link href="/auth/signup" className="text-primary font-bold hover:underline underline-offset-4">
                Daftar Gratis <ArrowRight className="inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
