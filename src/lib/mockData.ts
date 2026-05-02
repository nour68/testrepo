import type { User, Gym, TimeSlot, Booking, Plan } from '@/types'
import { format, addDays } from 'date-fns'

export const MOCK_PLANS: Plan[] = [
  { id: 'plan-1', name: 'light', price_dt: 49, credits_per_month: 20 },
  { id: 'plan-2', name: 'all_city', price_dt: 89, credits_per_month: 50 },
  { id: 'plan-3', name: 'elite', price_dt: 149, credits_per_month: 999 },
]

export const MOCK_MEMBER: User = {
  id: 'mock-member-1',
  phone: '+21699000001',
  name: 'Sami Trabelsi',
  city: 'Tunis',
  role: 'member',
  plan: 'all_city',
  credits: 38,
  credits_reset_date: format(addDays(new Date(), 12), 'yyyy-MM-dd'),
}

export const MOCK_OWNER: User = {
  id: 'mock-owner-1',
  phone: '+21699000002',
  name: 'Amine Boughanmi',
  city: 'Tunis',
  role: 'gym_owner',
  plan: 'elite',
  credits: 999,
  credits_reset_date: format(addDays(new Date(), 12), 'yyyy-MM-dd'),
}

export const MOCK_GYMS: Gym[] = [
  {
    id: 'gym-1',
    owner_id: 'mock-owner-1',
    name: 'Iron Temple',
    city: 'Tunis',
    categories: ['Musculation', 'CrossFit'],
    credit_cost: 2,
    address: 'Av. Habib Bourguiba, Tunis',
    description:
      'Salle de musculation haut de gamme en plein cœur de Tunis. Équipements dernière génération et coachs certifiés. Plus de 500 membres actifs.',
    photos: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800',
    ],
    rating: 4.8,
    is_active: true,
    opening_hours: { open: '06:00', close: '22:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  },
  {
    id: 'gym-2',
    owner_id: 'mock-owner-1',
    name: 'Zen Flow Studio',
    city: 'Tunis',
    categories: ['Yoga', 'Cycling'],
    credit_cost: 3,
    address: 'Rue du Lac, Les Berges du Lac, Tunis',
    description:
      'Studio bien-être spécialisé en yoga et cycling. Ambiance calme et instructeurs expérimentés. Idéal pour se ressourcer.',
    photos: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    ],
    rating: 4.6,
    is_active: true,
    opening_hours: { open: '07:00', close: '21:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  },
  {
    id: 'gym-3',
    owner_id: 'mock-owner-1',
    name: 'Fight Club Tunis',
    city: 'Tunis',
    categories: ['Boxing', 'CrossFit'],
    credit_cost: 3,
    address: 'Av. Louis Braille, Tunis',
    description:
      'Centre de sports de combat et HIIT. Box, MMA, CrossFit dans un cadre authentique. Coachs champions nationaux.',
    photos: [
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
      'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800',
    ],
    rating: 4.7,
    is_active: true,
    opening_hours: { open: '08:00', close: '22:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  },
  {
    id: 'gym-4',
    owner_id: 'mock-owner-1',
    name: 'Aqua Sfax',
    city: 'Sfax',
    categories: ['Swimming'],
    credit_cost: 4,
    address: 'Route de Tunis km 5, Sfax',
    description:
      'Complexe aquatique avec piscine olympique et bassin pour enfants. Cours de natation tous niveaux, aqua-gym.',
    photos: [
      'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    ],
    rating: 4.5,
    is_active: true,
    opening_hours: { open: '07:00', close: '20:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  },
  {
    id: 'gym-5',
    owner_id: 'mock-owner-1',
    name: 'FitZone Sousse',
    city: 'Sousse',
    categories: ['Musculation', 'Yoga'],
    credit_cost: 2,
    address: 'Av. Taïeb Mhiri, Sousse',
    description:
      'Grande salle multisports avec espace cardio, musculation et studio yoga. Vue mer depuis les fenêtres.',
    photos: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
    ],
    rating: 4.4,
    is_active: true,
    opening_hours: { open: '06:30', close: '22:30', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  },
  {
    id: 'gym-6',
    owner_id: 'mock-owner-1',
    name: 'CrossFit Sfax',
    city: 'Sfax',
    categories: ['CrossFit', 'Boxing'],
    credit_cost: 3,
    address: 'Zone Industrielle, Sfax',
    description:
      'Box CrossFit affiliée avec programmation quotidienne (WOD), olympiques et compétitions régionales.',
    photos: [
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800',
    ],
    rating: 4.9,
    is_active: true,
    opening_hours: { open: '06:00', close: '21:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  },
  {
    id: 'gym-7',
    owner_id: 'mock-owner-1',
    name: 'Sousse Surf & Swim',
    city: 'Sousse',
    categories: ['Swimming', 'Cycling'],
    credit_cost: 4,
    address: 'Plage de Boujaffar, Sousse',
    description:
      'Centre nautique proposant natation, aqua-cycling et activités côtières. Cadre unique face à la mer.',
    photos: [
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800',
    ],
    rating: 4.3,
    is_active: false,
    opening_hours: { open: '08:00', close: '18:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  },
]

export const MOCK_SLOTS: TimeSlot[] = [
  { id: 'slot-1', gym_id: 'gym-1', date: format(new Date(), 'yyyy-MM-dd'), start_time: '07:00', end_time: '08:00', capacity: 12, booked_count: 5 },
  { id: 'slot-2', gym_id: 'gym-1', date: format(new Date(), 'yyyy-MM-dd'), start_time: '08:00', end_time: '09:00', capacity: 12, booked_count: 9 },
  { id: 'slot-3', gym_id: 'gym-1', date: format(new Date(), 'yyyy-MM-dd'), start_time: '09:00', end_time: '10:00', capacity: 12, booked_count: 3 },
  { id: 'slot-4', gym_id: 'gym-1', date: format(new Date(), 'yyyy-MM-dd'), start_time: '17:00', end_time: '18:00', capacity: 12, booked_count: 12 },
  { id: 'slot-5', gym_id: 'gym-1', date: format(new Date(), 'yyyy-MM-dd'), start_time: '18:00', end_time: '19:00', capacity: 12, booked_count: 7 },
  { id: 'slot-6', gym_id: 'gym-1', date: format(new Date(), 'yyyy-MM-dd'), start_time: '19:00', end_time: '20:00', capacity: 12, booked_count: 2 },
  { id: 'slot-7', gym_id: 'gym-1', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), start_time: '07:00', end_time: '08:00', capacity: 12, booked_count: 0 },
  { id: 'slot-8', gym_id: 'gym-1', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), start_time: '08:00', end_time: '09:00', capacity: 12, booked_count: 2 },
  { id: 'slot-9', gym_id: 'gym-1', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), start_time: '18:00', end_time: '19:00', capacity: 12, booked_count: 0 },
]

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    member_id: 'mock-member-1',
    gym_id: 'gym-1',
    slot_id: 'slot-5',
    status: 'upcoming',
    qr_code: 'RIA-847291',
    credit_cost: 2,
    created_at: new Date().toISOString(),
    gym: MOCK_GYMS[0],
    slot: MOCK_SLOTS[4],
  },
  {
    id: 'booking-2',
    member_id: 'mock-member-1',
    gym_id: 'gym-2',
    slot_id: 'slot-2',
    status: 'checked_in',
    qr_code: 'RIA-293847',
    credit_cost: 3,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    gym: MOCK_GYMS[1],
    slot: { ...MOCK_SLOTS[1], date: format(addDays(new Date(), -2), 'yyyy-MM-dd') },
  },
  {
    id: 'booking-3',
    member_id: 'mock-member-1',
    gym_id: 'gym-3',
    slot_id: 'slot-3',
    status: 'cancelled',
    qr_code: 'RIA-112233',
    credit_cost: 3,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    gym: MOCK_GYMS[2],
    slot: { ...MOCK_SLOTS[2], date: format(addDays(new Date(), -5), 'yyyy-MM-dd') },
  },
]

export const MOCK_OWNER_BOOKINGS: Booking[] = [
  {
    id: 'ob-1',
    member_id: 'u-100',
    gym_id: 'gym-1',
    slot_id: 'slot-5',
    status: 'upcoming',
    qr_code: 'RIA-847291',
    credit_cost: 2,
    created_at: new Date().toISOString(),
    gym: MOCK_GYMS[0],
    slot: MOCK_SLOTS[4],
  },
  {
    id: 'ob-2',
    member_id: 'u-101',
    gym_id: 'gym-1',
    slot_id: 'slot-2',
    status: 'checked_in',
    qr_code: 'RIA-293847',
    credit_cost: 2,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    gym: MOCK_GYMS[0],
    slot: MOCK_SLOTS[1],
  },
  {
    id: 'ob-3',
    member_id: 'u-102',
    gym_id: 'gym-1',
    slot_id: 'slot-1',
    status: 'checked_in',
    qr_code: 'RIA-556677',
    credit_cost: 2,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    gym: MOCK_GYMS[0],
    slot: MOCK_SLOTS[0],
  },
]
