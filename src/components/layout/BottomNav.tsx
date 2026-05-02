import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Compass, CalendarDays, User, Dumbbell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const memberTabs = [
  { to: '/', icon: Home, labelKey: 'nav_home', exact: true },
  { to: '/explore', icon: Compass, labelKey: 'nav_explore', exact: false },
  { to: '/bookings', icon: CalendarDays, labelKey: 'nav_bookings', exact: false },
  { to: '/profile', icon: User, labelKey: 'nav_profile', exact: false },
]

const ownerTabs = [
  { to: '/owner', icon: Home, labelKey: 'nav_home', exact: true },
  { to: '/owner/bookings', icon: CalendarDays, labelKey: 'nav_bookings', exact: false },
  { to: '/owner/gym', icon: Dumbbell, labelKey: 'owner_gym_profile', exact: false },
  { to: '/owner/profile', icon: User, labelKey: 'nav_profile', exact: false },
]

export default function BottomNav() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const tabs = user?.role === 'gym_owner' ? ownerTabs : memberTabs

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-white/10 safe-area-bottom">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.exact}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? 'text-lime' : 'text-white/40'
              }`
            }
          >
            <tab.icon size={22} />
            <span className="text-[10px] font-body font-medium">{t(tab.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
