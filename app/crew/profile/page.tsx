"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Phone,
  Mail,
  Briefcase,
  Lock,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
} from "lucide-react"
import type { Profile, CrewAvailability } from "@/lib/types"

export default function CrewProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()

    if (userData.user) {
      setEmail(userData.user.email || "")
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }
    }
    setLoading(false)
  }

  async function toggleAvailability() {
    if (!profile) return

    const newAvailability: CrewAvailability =
      profile.availability === "tersedia" ? "on_job" : "tersedia"

    const { error } = await supabase
      .from("profiles")
      .update({ availability: newAvailability })
      .eq("id", profile.id)

    if (!error) {
      setProfile({ ...profile, availability: newAvailability })
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

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
        <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center mb-4 relative">
          <User className="h-12 w-12 text-gray-400" />
          <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#1a2029] border-2 border-gray-700 flex items-center justify-center">
            <Settings className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white">
          {profile?.full_name || "User"}
        </h2>
        <p className="text-gray-400">{profile?.position || "Crew"}</p>
        <Badge
          className={`mt-2 ${
            profile?.availability === "tersedia"
              ? "bg-green-600 text-white"
              : "bg-orange-600 text-white"
          }`}
        >
          {profile?.availability === "tersedia" ? "Tersedia" : "On Job"}
        </Badge>
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
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Posisi</p>
                <p className="text-white">{profile?.position || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Toggle */}
        <Card className="bg-[#1a2029] border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Status Ketersediaan</p>
                <p className="text-sm text-gray-400">
                  {profile?.availability === "tersedia"
                    ? "Anda tersedia untuk penugasan"
                    : "Anda sedang dalam tugas"}
                </p>
              </div>
              <Switch
                checked={profile?.availability === "tersedia"}
                onCheckedChange={toggleAvailability}
              />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="bg-[#1a2029] border-gray-800">
          <CardContent className="p-0">
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
