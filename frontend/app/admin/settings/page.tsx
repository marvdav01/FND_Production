"use client"

import { useState, useEffect, useRef } from "react"
import { fetchAPI, API_BASE_URL } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Shield, Palette, Globe, Camera } from "lucide-react"

export default function AdminSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatarUrl: null as string | null
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    try {
      const res = await fetchAPI('/auth/profile')
      if (res.success && res.data) {
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          avatarUrl: res.data.avatar_url || null
        })
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
      const uploadData = new FormData()
      uploadData.append('avatar', file)

      const res = await fetchAPI('/auth/profile/avatar', {
        method: 'POST',
        body: uploadData,
      })

      if (res.success && res.data) {
        setFormData(prev => ({ ...prev, avatarUrl: res.data.avatar_url }))
        // To refresh sidebar avatar immediately we would ideally use a context/state manager,
        // but for now reloading or waiting for next fetch is fine.
        window.location.reload()
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
    } finally {
      setUploading(false)
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetchAPI('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone
        })
      })
      if (res.success) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  function getAvatarSrc(url: string | null): string | null {
    if (!url) return null
    if (url.startsWith('http')) return url
    const backendBase = API_BASE_URL.replace('/api', '')
    return `${backendBase}${url}`
  }

  const avatarSrc = getAvatarSrc(formData.avatarUrl)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Konfigurasi aplikasi dan profil</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Keamanan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>Update informasi publik akun Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8 flex flex-col items-start gap-4">
                <Label>Foto Profil</Label>
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary border-2 border-background flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
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
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    disabled 
                    className="bg-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">No. Telepon</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <Button type="submit" className="bg-primary" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>Atur bagaimana Anda menerima notifikasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">Terima laporan harian via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Booking Baru</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi saat ada request booking baru</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Update Pembayaran</Label>
                  <p className="text-sm text-muted-foreground">Notifikasi saat client mengunggah bukti bayar</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan</CardTitle>
              <CardDescription>Ganti password dan atur keamanan akun</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current">Password Saat Ini</Label>
                <Input id="current" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new">Password Baru</Label>
                <Input id="new" type="password" />
              </div>
              <Button className="bg-primary">Ganti Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
