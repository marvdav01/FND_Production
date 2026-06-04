"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signupAction } from "@/lib/actions"
import { User, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const res = await signupAction(formData)

    if (!res.success) {
      setError(res.error || "Gagal mendaftar")
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 p-6">
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ 
            backgroundImage: `url('/mobile_login_background_1777809481060.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-green-500/20 border border-green-500/50 text-green-500">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Berhasil!</h1>
            <p className="text-slate-400">Akun Anda telah berhasil dibuat. Silakan login untuk melanjutkan.</p>
          </div>
          <Button asChild className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl">
            <Link href="/auth/login">Masuk Sekarang</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 p-6">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{ 
          backgroundImage: `url('/mobile_login_background_1777809481060.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-primary/10" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <span className="text-4xl font-black tracking-tighter text-primary">F</span>
            <span className="text-4xl font-black tracking-tighter text-white">ND</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Daftar Sebagai Client</h1>
          <p className="mt-2 text-slate-400">Buat akun untuk memesan jasa event lighting FND Production</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl sm:p-10">
          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 text-sm text-red-200 bg-red-500/20 border border-red-500/50 rounded-xl animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-slate-300 ml-1">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="Nama Anda"
                    required
                    className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

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
                    className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300 ml-1">No. Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0812..."
                  className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Role is always client for public signup */}
            <input type="hidden" name="role" value="client" />

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group" 
              disabled={loading}
            >
              {loading ? "Memproses..." : (
                <span className="flex items-center justify-center">
                  Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-primary font-bold hover:underline underline-offset-4">
                Masuk di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
    </div>
  )
}
