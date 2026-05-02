// Database Types for FND Production

export type UserRole = 'admin' | 'crew' | 'client'
export type EventStatus = 'pending' | 'survey' | 'deal' | 'running' | 'selesai' | 'cancel'
export type PaymentStatus = 'belum_lunas' | 'lunas'
export type CrewAvailability = 'tersedia' | 'on_job'

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  address: string | null
  role: UserRole
  position: string | null
  avatar_url: string | null
  availability: CrewAvailability | null
  created_at: string
  updated_at: string
}

export interface Equipment {
  id: string
  name: string
  description: string | null
  total_quantity: number
  available_quantity: number
  image_url: string | null
  category: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
  event_type: string
  event_date: string
  start_time: string | null
  end_time: string | null
  location: string
  venue_name: string | null
  description: string | null
  requirements: string | null
  status: EventStatus
  total_price: number
  client_id: string | null
  reference_images: string[] | null
  notes: string | null
  created_at: string
  updated_at: string
  // Joined data
  client?: Profile
}

export interface EventEquipment {
  id: string
  event_id: string
  equipment_id: string
  quantity: number
  created_at: string
  // Joined data
  equipment?: Equipment
}

export interface EventCrew {
  id: string
  event_id: string
  crew_id: string
  role: string | null
  created_at: string
  // Joined data
  crew?: Profile
}

export interface Payment {
  id: string
  event_id: string
  amount: number
  payment_type: string
  percentage: number | null
  status: PaymentStatus
  payment_date: string | null
  payment_method: string | null
  bank_account: string | null
  proof_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Joined data
  event?: Event
}

export interface EventSchedule {
  id: string
  event_id: string
  schedule_time: string
  activity: string
  description: string | null
  created_at: string
}

export interface EventStatusHistory {
  id: string
  event_id: string
  status: EventStatus
  changed_at: string
  notes: string | null
}

// Dashboard Stats
export interface DashboardStats {
  totalEvents: number
  eventsToday: number
  totalRevenue: number
  availableEquipment: number
  totalEquipment: number
  availableCrew: number
  totalCrew: number
  monthlyChange: {
    events: number
    revenue: number
  }
}

export interface EventsByMonth {
  month: string
  count: number
}

export interface EventsByStatus {
  status: EventStatus
  count: number
  percentage: number
}

// Form types
export interface BookingFormData {
  event_type: string
  event_date: string
  location: string
  requirements: string
  reference_images?: File[]
}

// Utility types
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  pending: 'Pending',
  survey: 'Survey',
  deal: 'Deal',
  running: 'Running',
  selesai: 'Selesai',
  cancel: 'Cancel'
}

export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  pending: 'bg-gray-100 text-gray-800',
  survey: 'bg-amber-100 text-amber-800',
  deal: 'bg-blue-100 text-blue-800',
  running: 'bg-orange-100 text-orange-800',
  selesai: 'bg-green-100 text-green-800',
  cancel: 'bg-red-100 text-red-800'
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  belum_lunas: 'Belum Lunas',
  lunas: 'Lunas'
}

export const CREW_AVAILABILITY_LABELS: Record<CrewAvailability, string> = {
  tersedia: 'Tersedia',
  on_job: 'On Job'
}

export const CREW_AVAILABILITY_COLORS: Record<CrewAvailability, string> = {
  tersedia: 'bg-green-100 text-green-800',
  on_job: 'bg-orange-100 text-orange-800'
}

// Format helpers
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date))
}

export function formatTime(time: string): string {
  return time.slice(0, 5)
}
