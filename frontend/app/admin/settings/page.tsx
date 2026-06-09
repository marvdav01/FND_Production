"use client"

import { useEffect, useRef, useState } from "react"
import { fetchAPI, getAssetUrl } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Bell, Camera, Shield, Trash2, Upload, User } from "lucide-react"
import { toast } from "sonner"

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const maxImageSize = 5 * 1024 * 1024

type ProfileForm = {
  name: string
  email: string
  phone: string
  avatarUrl: string | null
}

async function compressAvatar(file: File): Promise<File> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"))
    reader.readAsDataURL(file)
  })

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Gambar tidak valid"))
    img.src = dataUrl
  })

  const size = Math.min(image.width, image.height)
  const sourceX = (image.width - size) / 2
  const sourceY = (image.height - size) / 2
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Browser tidak mendukung kompresi gambar")

  context.drawImage(image, sourceX, sourceY, size, size, 0, 0, 512, 512)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result)
      else reject(new Error("Gagal mengompresi gambar"))
    }, "image/jpeg", 0.82)
  })

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" })
}

function uploadAvatar(file: File, onProgress: (progress: number) => void) {
  return new Promise<any>((resolve, reject) => {
    const formData = new FormData()
    formData.append("avatar", file)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/proxy/auth/profile/avatar")
    xhr.withCredentials = true

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText || "{}")
      if (xhr.status >= 200 && xhr.status < 300 && response.success) {
        resolve(response)
      } else {
        reject(new Error(response.error || "Upload avatar gagal"))
      }
    }
    xhr.onerror = () => reject(new Error("Koneksi upload gagal"))
    xhr.send(formData)
  })
}

export default function AdminSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [formData, setFormData] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
    avatarUrl: null,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchAPI<any>("/auth/profile")
      if (res.success && res.data) {
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          avatarUrl: res.data.avatar_url || null,
        })
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat profil")
    } finally {
      setLoading(false)
    }
  }

  async function handleAvatarSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file harus JPG, PNG, atau WebP")
      return
    }
    if (file.size > maxImageSize) {
      toast.error("Ukuran file maksimal 5MB")
      return
    }

    try {
      const compressed = await compressAvatar(file)
      setCompressedFile(compressed)
      setPreviewUrl(URL.createObjectURL(compressed))
      setUploadProgress(0)
      toast.info("Preview avatar siap. Klik Upload untuk menyimpan.")
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses gambar")
    }
  }

  async function handleAvatarUpload() {
    if (!compressedFile) return

    setUploading(true)
    setUploadProgress(0)
    try {
      const res = await uploadAvatar(compressedFile, setUploadProgress)
      setFormData((prev) => ({ ...prev, avatarUrl: res.data.avatar_url }))
      setPreviewUrl(null)
      setCompressedFile(null)
      setUploadProgress(100)
      toast.success("Avatar berhasil diperbarui")
    } catch (err: any) {
      toast.error(err.message || "Upload avatar gagal")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleDeleteAvatar() {
    setUploading(true)
    try {
      const res = await fetchAPI<any>("/auth/profile/avatar", { method: "DELETE" })
      if (res.success) {
        setFormData((prev) => ({ ...prev, avatarUrl: null }))
        setPreviewUrl(null)
        setCompressedFile(null)
        toast.success("Avatar berhasil dihapus")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus avatar")
    } finally {
      setUploading(false)
    }
  }

  async function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      const res = await fetchAPI<any>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      })

      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          name: res.data.name,
          phone: res.data.phone || "",
          avatarUrl: res.data.avatar_url || null,
        }))
        toast.success("Profil berhasil disimpan")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan profil")
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(event: React.FormEvent) {
    event.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Konfirmasi password tidak sama")
      return
    }

    setSaving(true)
    try {
      await fetchAPI("/auth/profile/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      toast.success("Password berhasil diganti. Login ulang diperlukan di sesi lain.")
    } catch (err: any) {
      toast.error(err.message || "Gagal mengganti password")
    } finally {
      setSaving(false)
    }
  }

  const avatarSrc = previewUrl || getAssetUrl(formData.avatarUrl)

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Profil, keamanan, dan preferensi notifikasi</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Gagal memuat settings</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Keamanan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>Update data akun admin yang tampil di dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-24 w-24 overflow-hidden rounded-full border bg-muted">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      <Camera className="mr-2 h-4 w-4" />
                      Pilih Foto
                    </Button>
                    <Button type="button" onClick={handleAvatarUpload} disabled={!compressedFile || uploading}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? "Mengupload..." : "Upload Avatar"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleDeleteAvatar} disabled={uploading || !formData.avatarUrl}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </Button>
                  </div>
                  <input ref={fileInputRef} type="file" accept={allowedTypes.join(",")} onChange={handleAvatarSelect} className="hidden" />
                  {(uploading || uploadProgress > 0) && <Progress value={uploadProgress} className="h-2 max-w-sm" />}
                  {compressedFile && (
                    <p className="text-sm text-muted-foreground">
                      Gambar akan dicrop persegi dan dikompresi otomatis sebelum disimpan.
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} disabled className="bg-muted" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">No. Telepon</Label>
                  <Input id="phone" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>Atur bagaimana admin menerima pembaruan sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {["Notifikasi Email", "Booking Baru", "Update Pembayaran"].map((label) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <Label>{label}</Label>
                    <p className="text-sm text-muted-foreground">Preferensi disimpan lokal sampai modul notifikasi aktif.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan</CardTitle>
              <CardDescription>Ganti password akun dan revoke refresh token sesi lain</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="current">Password Saat Ini</Label>
                  <Input id="current" type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new">Password Baru</Label>
                  <Input id="new" type="password" minLength={8} value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm">Konfirmasi Password</Label>
                  <Input id="confirm" type="password" minLength={8} value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Memproses..." : "Ganti Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
