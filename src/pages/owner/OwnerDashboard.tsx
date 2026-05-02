import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { MOCK_GYMS, MOCK_OWNER_BOOKINGS } from '@/lib/mockData'
import { TrendingUp, Users, DollarSign, ChevronRight } from 'lucide-react'

const PEAK_HOURS = [
  { hour: '06', pct: 20 }, { hour: '07', pct: 45 }, { hour: '08', pct: 80 },
  { hour: '09', pct: 65 }, { hour: '10', pct: 40 }, { hour: '11', pct: 30 },
  { hour: '12', pct: 25 }, { hour: '13', pct: 20 }, { hour: '14', pct: 15 },
  { hour: '15', pct: 20 }, { hour: '16', pct: 35 }, { hour: '17', pct: 70 },
  { hour: '18', pct: 95 }, { hour: '19', pct: 90 }, { hour: '20', pct: 75 },
  { hour: '21', pct: 50 }, { hour: '22', pct: 20 },
]

export default function OwnerDashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const ownerGym = MOCK_GYMS.find(g => g.owner_id === user?.id) ?? MOCK_GYMS[0]
  const totalVisits = 127
  const revenue = totalVisits * ownerGym.credit_cost * 1.8 // ~DT
  const todayBookings = MOCK_OWNER_BOOKINGS.length

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 max-w-lg mx-auto">
        <p className="text-white/50 font-body text-sm">Salut, {user?.name || 'Gérant'}</p>
        <h1 className="font-heading text-3xl text-cream">TABLEAU DE BORD</h1>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-4">
        {/* Gym card */}
        <div
          className="relative rounded-2xl overflow-hidden h-36 cursor-pointer"
          onClick={() => navigate('/owner/gym')}
        >
          {ownerGym.photos[0] && (
            <img src={ownerGym.photos[0]} alt={ownerGym.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 p-4 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-2xl text-cream">{ownerGym.name}</h2>
              <p className="text-white/60 font-body text-xs">{ownerGym.city} · {ownerGym.categories.join(', ')}</p>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <span className="font-body text-xs">Gérer</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Users size={18} className="text-lime" />}
            value={totalVisits.toString()}
            label={t('owner_total_visits')}
          />
          <StatCard
            icon={<DollarSign size={18} className="text-orange" />}
            value={`${Math.round(revenue)} DT`}
            label={t('owner_revenue')}
          />
          <StatCard
            icon={<TrendingUp size={18} className="text-lime" />}
            value={todayBookings.toString()}
            label="Aujourd'hui"
          />
        </div>

        {/* Peak hours heatmap */}
        <div className="bg-charcoal rounded-2xl p-5 border border-white/8">
          <h3 className="font-heading text-lg text-cream mb-4">{t('owner_peak_hours').toUpperCase()}</h3>
          <div className="flex items-end gap-1 h-16">
            {PEAK_HOURS.map(({ hour, pct }) => (
              <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm transition-all"
                  style={{
                    height: `${(pct / 100) * 48}px`,
                    background: pct > 70 ? '#FF5C1A' : pct > 40 ? '#C8F135' : '#1C1C1C',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/30 font-body text-xs">06h</span>
            <span className="text-white/30 font-body text-xs">14h</span>
            <span className="text-white/30 font-body text-xs">22h</span>
          </div>
          <div className="flex gap-4 mt-3">
            <LegendDot color="#FF5C1A" label="Forte affluence" />
            <LegendDot color="#C8F135" label="Modérée" />
            <LegendDot color="#1C1C1C" label="Faible" />
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/owner/bookings')}
            className="bg-charcoal rounded-2xl p-4 border border-white/8 text-left"
          >
            <p className="text-white/50 font-body text-xs mb-1">Aujourd'hui</p>
            <p className="font-heading text-2xl text-cream">{todayBookings}</p>
            <p className="text-lime font-body text-sm">Réservations →</p>
          </button>
          <button
            onClick={() => navigate('/owner/bookings?scan=1')}
            className="bg-lime rounded-2xl p-4 text-left"
          >
            <p className="text-black/60 font-body text-xs mb-1">Scanner</p>
            <p className="font-heading text-2xl text-black">QR</p>
            <p className="text-black/70 font-body text-sm">Valider entrée →</p>
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-charcoal rounded-2xl p-4 border border-white/8">
      <div className="mb-2">{icon}</div>
      <p className="font-heading text-2xl text-cream">{value}</p>
      <p className="text-white/40 font-body text-xs leading-tight mt-0.5">{label}</p>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
      <span className="text-white/40 font-body text-xs">{label}</span>
    </div>
  )
}
