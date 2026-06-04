"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { fetchAPI, API_BASE_URL } from "@/lib/api"
import { logoutAction } from "@/lib/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Lock,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
  Camera,
} from "lucide-react"
import type { Profile } from "@/lib/types"

export default function ClientProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    try {
      const res = await fetchAPI('/auth/profile')
      if (res.success && res.data) {
        setEmail(res.data.email || "")
        setAvatarUrl(res.data.avatar_url || null)
        setProfile({
          id: res.data.id,
          full_name: res.data.name,
          phone: res.data.phone || "",
          address: res.data.address || "",
        } as any)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetchAPI('/auth/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      if (res.success && res.data) {
        setAvatarUrl(res.data.avatar_url)
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
    } finally {
      setUploading(false)
    }
  }

  function getAvatarSrc(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith('http')) return url
    // Build absolute URL from backend
    const backendBase = API_BASE_URL.replace('/api', '')
    return `${backendBase}${url}`
  }

  async function handleLogout() {
    try {
      await logoutAction()
      localStorage.removeItem('token')
      router.push("/auth/login")
    } catch (error) {
      console.error("Error logging out:", error)
      router.push("/")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const avatarSrc = getAvatarSrc(avatarUrl)

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-12">
        <h1 className="text-xl font-semibold text-white">Profile</h1>
        <Button variant="ghost" size="icon" className="text-white">
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      {/* Avatar */}
      <div className="flex flex-col items-center py-6">
        <div className="relative mb-4">
          <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary border-2 border-[#0f1419] flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Camera className="h-4 w-4 text-white" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <h2 className="text-xl font-semibold text-white">
          {profile?.full_name || "User"}
        </h2>
        <p className="text-gray-400">Client</p>
      </div>

      {/* Contact Info */}
      <div className="px-4 space-y-3">
        <Card className="bg-[#1a2029] border-gray-800">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Telepon</p>
                <p className="text-white">{profile?.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-white">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Alamat</p>
                <p className="text-white">{profile?.address || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="bg-[#1a2029] border-gray-800">
          <CardContent className="p-0">
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-400" />
                <span className="text-white">Informasi Perusahaan</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-400" />
                <span className="text-white">Ubah Password</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="text-white">Notifikasi</span>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <button className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-gray-400" />
                <span className="text-white">Bantuan & FAQ</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="bg-[#1a2029] border-gray-800">
          <CardContent className="p-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 text-red-500"
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <span>Keluar</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
