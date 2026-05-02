import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { FullPageLoader } from '@/components/ui/LoadingSpinner'
import BottomNav from '@/components/layout/BottomNav'
import '@/locales/i18n'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
})

// Auth pages
const PhoneAuth = lazy(() => import('@/pages/auth/PhoneAuth'))
const OTPVerify = lazy(() => import('@/pages/auth/OTPVerify'))
const ProfileSetup = lazy(() => import('@/pages/auth/ProfileSetup'))

// Member pages
const Home = lazy(() => import('@/pages/member/Home'))
const Explore = lazy(() => import('@/pages/member/Explore'))
const Bookings = lazy(() => import('@/pages/member/Bookings'))
const Profile = lazy(() => import('@/pages/member/Profile'))
const GymDetail = lazy(() => import('@/pages/member/GymDetail'))
const BookingFlow = lazy(() => import('@/pages/member/BookingFlow'))
const BookingDetail = lazy(() => import('@/pages/member/BookingDetail'))

// Owner pages
const OwnerDashboard = lazy(() => import('@/pages/owner/OwnerDashboard'))
const OwnerBookings = lazy(() => import('@/pages/owner/OwnerBookings'))
const OwnerGymProfile = lazy(() => import('@/pages/owner/OwnerGymProfile'))
const OwnerProfile = lazy(() => import('@/pages/owner/OwnerProfile'))

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <FullPageLoader />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function RequireNoAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) return <FullPageLoader />
  if (isAuthenticated) {
    const dest = !user?.name ? '/auth/setup' : user.role === 'gym_owner' ? '/owner' : '/'
    return <Navigate to={dest} replace />
  }
  return <>{children}</>
}

function MemberLayout() {
  const { user } = useAuth()
  if (!user?.name) return <Navigate to="/auth/setup" replace />
  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <Outlet />
      <BottomNav />
    </div>
  )
}

function OwnerLayout() {
  const { user } = useAuth()
  if (!user?.name) return <Navigate to="/auth/setup" replace />
  if (user.role !== 'gym_owner') return <Navigate to="/" replace />
  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <Outlet />
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<FullPageLoader />}>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<RequireNoAuth><PhoneAuth /></RequireNoAuth>} />
              <Route path="/auth/otp" element={<OTPVerify />} />
              <Route path="/auth/setup" element={<RequireAuth><ProfileSetup /></RequireAuth>} />

              {/* Member routes */}
              <Route element={<RequireAuth><MemberLayout /></RequireAuth>}>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/bookings/:id" element={<BookingDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/gym/:id" element={<GymDetail />} />
                <Route path="/book/:gymId/:slotId" element={<BookingFlow />} />
              </Route>

              {/* Owner routes */}
              <Route element={<RequireAuth><OwnerLayout /></RequireAuth>}>
                <Route path="/owner" element={<OwnerDashboard />} />
                <Route path="/owner/bookings" element={<OwnerBookings />} />
                <Route path="/owner/gym" element={<OwnerGymProfile />} />
                <Route path="/owner/profile" element={<OwnerProfile />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
