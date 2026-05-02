import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { MapPin, Clock, Zap } from 'lucide-react'
import type { Booking } from '@/types'
import Badge from '@/components/ui/Badge'

const statusVariant = {
  upcoming: 'lime',
  checked_in: 'orange',
  cancelled: 'red',
} as const

const statusLabel = {
  upcoming: 'booking_status_upcoming',
  checked_in: 'booking_status_checked_in',
  cancelled: 'booking_status_cancelled',
} as const

interface BookingCardProps {
  booking: Booking
  showQR?: boolean
}

export default function BookingCard({ booking, showQR }: BookingCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const dateStr = booking.slot?.date
    ? format(parseISO(booking.slot.date), 'd MMM yyyy', { locale: fr })
    : '—'

  return (
    <button
      onClick={() => showQR && navigate(`/bookings/${booking.id}`)}
      className="w-full bg-charcoal rounded-2xl p-4 border border-white/8 text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg text-cream truncate">{booking.gym?.name}</h3>
          <div className="flex items-center gap-1 text-white/50 font-body text-xs mt-1">
            <MapPin size={11} />
            <span>{booking.gym?.city}</span>
          </div>
        </div>
        <Badge variant={statusVariant[booking.status]}>
          {t(statusLabel[booking.status])}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mt-3 text-sm font-body">
        <span className="flex items-center gap-1.5 text-cream/60">
          <Clock size={13} />
          {dateStr}{booking.slot ? ` · ${booking.slot.start_time}` : ''}
        </span>
        <span className="flex items-center gap-1 text-lime/80">
          <Zap size={12} /> {booking.credit_cost} {t('credits')}
        </span>
      </div>

      {booking.status === 'upcoming' && (
        <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
          <span className="text-white/40 font-body text-xs">QR: {booking.qr_code}</span>
          <span className="text-lime text-xs font-body font-medium">Voir QR →</span>
        </div>
      )}
    </button>
  )
}
