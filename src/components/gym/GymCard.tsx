import { useNavigate } from 'react-router-dom'
import { Star, Zap } from 'lucide-react'
import type { Gym } from '@/types'
import Badge from '@/components/ui/Badge'

interface GymCardProps {
  gym: Gym
}

function isOpenNow(gym: Gym): boolean {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const [oh, om] = gym.opening_hours.open.split(':').map(Number)
  const [ch, cm] = gym.opening_hours.close.split(':').map(Number)
  const nowMin = h * 60 + m
  return nowMin >= oh * 60 + om && nowMin < ch * 60 + cm
}

export default function GymCard({ gym }: GymCardProps) {
  const navigate = useNavigate()
  const open = isOpenNow(gym)

  return (
    <button
      onClick={() => navigate(`/gym/${gym.id}`)}
      className="w-full bg-charcoal rounded-2xl overflow-hidden border border-white/8 text-left active:scale-[0.98] transition-transform"
    >
      {/* Photo */}
      <div className="relative h-40 bg-black/40 overflow-hidden">
        {gym.photos[0] && (
          <img
            src={gym.photos[0]}
            alt={gym.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        {/* Status */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-body font-bold px-2.5 py-1 rounded-full ${
            !gym.is_active ? 'bg-black/70 text-white/40' :
            open ? 'bg-lime/90 text-black' : 'bg-black/70 text-white/40'
          }`}>
            {!gym.is_active ? 'FERMÉ' : open ? 'OUVERT' : 'FERMÉ'}
          </span>
        </div>
        {/* Credit cost */}
        <div className="absolute bottom-3 right-3">
          <span className="flex items-center gap-1 bg-black/80 text-lime text-xs font-body font-bold px-2.5 py-1 rounded-full">
            <Zap size={10} /> {gym.credit_cost} crédits
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-xl text-cream">{gym.name}</h3>
            <p className="text-white/50 font-body text-xs mt-0.5">{gym.city} · {gym.address}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={12} className="text-lime fill-lime" />
            <span className="text-cream font-body text-sm font-medium">{gym.rating}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {gym.categories.map(cat => (
            <Badge key={cat} variant="gray">{cat}</Badge>
          ))}
        </div>
      </div>
    </button>
  )
}
