export type UserRole = 'member' | 'gym_owner'
export type PlanName = 'light' | 'all_city' | 'elite'
export type BookingStatus = 'upcoming' | 'checked_in' | 'cancelled'
export type SportCategory = 'Musculation' | 'Yoga' | 'CrossFit' | 'Boxing' | 'Swimming' | 'Cycling'
export type City = 'Tunis' | 'Sfax' | 'Sousse'

export interface User {
  id: string
  phone: string
  name: string
  city: City
  role: UserRole
  plan: PlanName
  credits: number
  credits_reset_date: string
  created_at?: string
}

export interface OpeningHours {
  open: string
  close: string
  days: string[]
}

export interface Gym {
  id: string
  owner_id: string
  name: string
  city: City
  categories: SportCategory[]
  credit_cost: number
  opening_hours: OpeningHours
  address: string
  description: string
  photos: string[]
  rating: number
  is_active: boolean
  created_at?: string
}

export interface TimeSlot {
  id: string
  gym_id: string
  date: string
  start_time: string
  end_time: string
  capacity: number
  booked_count: number
}

export interface Booking {
  id: string
  member_id: string
  gym_id: string
  slot_id: string
  status: BookingStatus
  qr_code: string
  credit_cost: number
  created_at: string
  gym?: Gym
  slot?: TimeSlot
}

export interface Plan {
  id: string
  name: PlanName
  price_dt: number
  credits_per_month: number
}

export const PLANS: Record<PlanName, { label: string; price_dt: number; credits_per_month: number; color: string }> = {
  light: { label: 'Light', price_dt: 49, credits_per_month: 20, color: '#6B7280' },
  all_city: { label: 'All City', price_dt: 89, credits_per_month: 50, color: '#C8F135' },
  elite: { label: 'Elite', price_dt: 149, credits_per_month: 999, color: '#FF5C1A' },
}

export const CITIES: City[] = ['Tunis', 'Sfax', 'Sousse']

export const CATEGORIES: SportCategory[] = [
  'Musculation', 'Yoga', 'CrossFit', 'Boxing', 'Swimming', 'Cycling',
]
