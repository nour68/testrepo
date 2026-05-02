import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { differenceInDays, parseISO } from 'date-fns'
import { Zap, ChevronRight, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { PLANS } from '@/types'
import { MOCK_BOOKINGS, MOCK_GYMS } from '@/lib/mockData'
import BookingCard from '@/components/booking/BookingCard'

export default function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const plan = PLANS[user.plan]
  const isElite = user.plan === 'elite'
  const resetDays = user.credits_reset_date
    ? differenceInDays(parseISO(user.credits_reset_date), new Date())
    : 0
  const creditPct = isElite ? 100 : Math.min(100, (user.credits / plan.credits_per_month) * 100)
  const recentBookings = MOCK_BOOKINGS.slice(0, 3)
  const featuredGym = MOCK_GYMS[0]

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Top bar */}
      <div className="px-4 pt-14 pb-4 flex items-center justify-between max-w-lg mx-auto">
        <div>
          <p className="text-white/50 font-body text-sm">{t('home_greeting', { name: user.name || 'toi' })}</p>
          <h1 className="font-heading text-3xl text-cream">MON ESPACE</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center">
          <span className="font-heading text-lg text-black">{(user.name || 'R')[0].toUpperCase()}</span>
        </div>
      </div>

      <div className="px-4 space-y-4 max-w-lg mx-auto">
        {/* Plan card */}
        <div className="relative bg-charcoal rounded-2xl p-5 overflow-hidden border border-white/8">
          {/* Accent blob */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: plan.color }} />

          <div className="relative">
            <p className="text-white/50 font-body text-xs uppercase tracking-widest mb-1">{t('home_plan_label')}</p>
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-heading text-4xl" style={{ color: plan.color }}>
                {plan.label.toUpperCase()}
              </h2>
              <div className="text-right">
                <p className="font-heading text-3xl text-cream">
                  {isElite ? '∞' : user.credits}
                </p>
                <p className="text-white/50 font-body text-xs">{t('credits')}</p>
              </div>
            </div>

            {/* Credit bar */}
            {!isElite && (
              <div className="mb-3">
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${creditPct}%`, background: plan.color }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-white/40 font-body text-xs">
                    {t('home_credits_remaining', { count: user.credits })}
                  </span>
                  <span className="text-white/40 font-body text-xs">
                    {t('home_credits_reset', { days: Math.max(0, resetDays) })}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1 text-xs font-body text-white/40"
            >
              {t('profile_change_plan')} <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Featured gym */}
        <div className="relative rounded-2xl overflow-hidden h-44" onClick={() => navigate(`/gym/${featuredGym.id}`)}>
          <img src={featuredGym.photos[0]} alt={featuredGym.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white/60 font-body text-xs mb-1">SALLE RECOMMANDÉE</p>
            <div className="flex items-end justify-between">
              <h3 className="font-heading text-2xl text-cream">{featuredGym.name}</h3>
              <div className="flex items-center gap-1 bg-lime/20 border border-lime/30 px-2 py-1 rounded-full">
                <Zap size={11} className="text-lime" />
                <span className="text-lime text-xs font-body font-bold">{featuredGym.credit_cost} crédits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick explore CTA */}
        <button
          onClick={() => navigate('/explore')}
          className="w-full flex items-center justify-between bg-lime text-black px-5 py-4 rounded-2xl"
        >
          <span className="font-heading text-xl">{t('home_explore_gyms').toUpperCase()}</span>
          <ArrowRight size={20} />
        </button>

        {/* Recent bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-xl text-cream">{t('home_recent_bookings').toUpperCase()}</h3>
            <button onClick={() => navigate('/bookings')} className="text-lime text-sm font-body">Tout voir</button>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-white/40 font-body text-sm text-center py-6">{t('home_no_bookings')}</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(b => <BookingCard key={b.id} booking={b} showQR />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
