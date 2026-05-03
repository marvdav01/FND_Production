"use client"

import { useState, useEffect } from "react"
import { fetchAPI } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Users, User, Phone, Edit, Trash2 } from "lucide-react"
import type { Profile, CrewAvailability } from "@/lib/types"

const positions = [
  "Operator Lighting",
  "Lighting Technician",
  "Lighting Operator",
  "Helper",
  "Rigger",
  "DMX Programmer",
  "Production Manager",
]

export default function CrewPage() {
  const [crew, setCrew] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    position: "",
    availability: "tersedia" as CrewAvailability,
  })

  useEffect(() => {
    fetchCrew()
  }, [availabilityFilter])

  async function fetchCrew() {
    setLoading(true)
    try {
      const endpoint = availabilityFilter !== "all" ? `/crew?status=${availabilityFilter}` : '/crew'
      const res = await fetchAPI(endpoint)
      
      if (res.success) {
        const mappedData = res.data.map((c: any) => ({
          ...c,
          full_name: c.name,
          position: c.role,
          availability: c.status || 'tersedia'
        }))
        setCrew(mappedData)
      } else {
        console.error("Error fetching crew:", res.error)
      }
    } catch (error) {
      console.error("Error fetching crew:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCrew = crew.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.position || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (editingItem) {
      try {
        const payload = {
          name: formData.full_name,
          phone: formData.phone || null,
          role: formData.position,
          status: formData.availability,
        }
        
        const res = await fetchAPI(`/crew/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        })

        if (res.success) {
          fetchCrew()
          closeDialog()
        }
      } catch (error) {
        console.error("Error updating crew:", error)
      }
    }
  }

  async function updateAvailability(id: string, availability: CrewAvailability) {
    try {
      const res = await fetchAPI(`/crew/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: availability })
      })

      if (res.success) {
        fetchCrew()
      }
    } catch (error) {
      console.error("Error updating availability:", error)
    }
  }

  function openEditDialog(member: Profile) {
    setEditingItem(member)
    setFormData({
      full_name: member.full_name,
      phone: member.phone || "",
      position: member.position || "",
      availability: member.availability || "tersedia",
    })
    setIsDialogOpen(true)
  }

  function closeDialog() {
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({
      full_name: "",
      phone: "",
      position: "",
      availability: "tersedia",
    })
  }

  const availabilityColors: Record<CrewAvailability, string> = {
    tersedia: "bg-green-100 text-green-700 border-green-300",
    on_job: "bg-orange-100 text-orange-700 border-orange-300",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Crew</h1>
          <p className="text-muted-foreground">Kelola tim dan operator</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Crew</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Posisi *</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih posisi" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Status</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) =>
                    setFormData({ ...formData, availability: value as CrewAvailability })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tersedia">Tersedia</SelectItem>
                    <SelectItem value="on_job">On Job</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Batal
                </Button>
                <Button type="submit" className="bg-primary">
                  Update
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{crew.length}</p>
                <p className="text-sm text-muted-foreground">Total Crew</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {crew.filter((c) => c.availability === "tersedia").length}
                </p>
                <p className="text-sm text-muted-foreground">Tersedia</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {crew.filter((c) => c.availability === "on_job").length}
                </p>
                <p className="text-sm text-muted-foreground">On Job</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari crew..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="tersedia">Tersedia</SelectItem>
                <SelectItem value="on_job">On Job</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredCrew.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Belum ada crew</h3>
              <p className="text-muted-foreground mt-1">
                Crew akan muncul setelah mendaftar dengan role crew
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCrew.map((member) => (
                <Card key={member.id} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{member.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{member.position}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      {member.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </div>
                      )}
                      <Badge
                        variant="outline"
                        className={availabilityColors[member.availability || "tersedia"]}
                      >
                        {member.availability === "on_job" ? "On Job" : "Tersedia"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
