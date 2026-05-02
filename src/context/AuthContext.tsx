import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { MOCK_MEMBER } from '@/lib/mockData'
import type { User, City } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  sendOTP: (phone: string) => Promise<void>
  verifyOTP: (phone: string, token: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  signOut: () => Promise<void>
  setMockUser: (role: 'member' | 'owner') => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const MOCK_OTP_PHONE = '+21699000001'
const MOCK_OTP_CODE = '123456'
const MOCK_OWNER_OTP_PHONE = '+21699000002'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load persisted mock user on mount
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('riadha_mock_user')
      if (saved) {
        try { setUser(JSON.parse(saved)) } catch { /* ignore */ }
      }
      setIsLoading(false)
      return
    }

    // Real Supabase flow
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        await loadUserProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setUser(data as User)
  }

  const sendOTP = useCallback(async (phone: string) => {
    if (!isSupabaseConfigured) {
      // Mock: accept any +216 number
      if (!phone.startsWith('+216')) throw new Error('INVALID_PHONE')
      return
    }
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) throw error
  }, [])

  const verifyOTP = useCallback(async (phone: string, token: string) => {
    if (!isSupabaseConfigured) {
      // Mock auth: accept demo credentials
      if (token !== MOCK_OTP_CODE) throw new Error('INVALID_OTP')
      const isMockOwner = phone === MOCK_OWNER_OTP_PHONE
      const mockUser: User = isMockOwner
        ? { id: 'mock-owner-1', phone, name: 'Amine Boughanmi', city: 'Tunis', role: 'gym_owner', plan: 'elite', credits: 999, credits_reset_date: '' }
        : { ...MOCK_MEMBER, phone }
      // If unknown demo phone, treat as new member needing profile setup
      const isNew = phone !== MOCK_OTP_PHONE && phone !== MOCK_OWNER_OTP_PHONE
      const finalUser = isNew ? { ...MOCK_MEMBER, id: `mock-${Date.now()}`, phone, name: '', city: 'Tunis' as City } : mockUser
      setUser(finalUser)
      localStorage.setItem('riadha_mock_user', JSON.stringify(finalUser))
      return
    }
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
    if (error) throw error
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...data }
    setUser(updated)
    if (!isSupabaseConfigured) {
      localStorage.setItem('riadha_mock_user', JSON.stringify(updated))
      return
    }
    await supabase.from('users').update(data).eq('id', user.id)
  }, [user])

  const signOut = useCallback(async () => {
    setUser(null)
    localStorage.removeItem('riadha_mock_user')
    if (isSupabaseConfigured) await supabase.auth.signOut()
  }, [])

  // Dev helper: quick-login as member or owner
  const setMockUser = useCallback((role: 'member' | 'owner') => {
    const u: User = role === 'owner'
      ? { id: 'mock-owner-1', phone: MOCK_OWNER_OTP_PHONE, name: 'Amine Boughanmi', city: 'Tunis', role: 'gym_owner', plan: 'elite', credits: 999, credits_reset_date: '' }
      : { ...MOCK_MEMBER }
    setUser(u)
    localStorage.setItem('riadha_mock_user', JSON.stringify(u))
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, sendOTP, verifyOTP, updateProfile, signOut, setMockUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
