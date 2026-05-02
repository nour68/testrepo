import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format, parseISO, differenceInHours } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, MapPin, Clock } from 'lucide-react'
import QRCode from 'qrcode.react'
import { MOCK_BOOKINGS } from '@/lib/mockData'
import Badge from '@/components/ui/Badge'

const statusVariant = {
  upcoming: 'lime',
  checked_in: 'orange',
  cancelled: 'red',
} as const

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cancelled, setCancelled] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const booking = MOCK_BOOKINGS.find(b => b.id === id)

  if (!booking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-body">Réservation introuvable</p>
      </div>
    )
  }

  const status = cancelled ? 'cancelled' : booking.status
  const canCancel = status === 'upcoming'
  const slotDateTime = booking.slot ? `${booking.slot.date}T${booking.slot.start_time}` : null
  const hoursUntil = slotDateTime ? differenceInHours(parseISO(slotDateTime), new Date()) : 0

  const handleCancel = () => {
    if (hoursUntil < 2) return
    setCancelled(true)
    setShowConfirm(false)
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="px-4 pt-14 pb-4 flex items-center gap-3 border-b border-white/8 max-w-lg mx-auto">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft size={22} className="text-cream/70" />
        </button>
        <h1 className="font-heading text-2xl text-cream">MA RÉSERVATION</h1>
        <div className="ml-auto">
          <Badge variant={statusVariant[status]}>{t(`booking_status_${status}`)}</Badge>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {/* Gym */}
        {booking.gym?.photos[0] && (
          <div className="relative h-40 rounded-2xl overflow-hidden mt-4">
            <img src={booking.gym.photos[0]} alt={booking.gym.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-3 left-4">
              <h2 className="font-heading text-2xl text-cream">{booking.gym?.name}</h2>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-charcoal rounded-2xl p-5 mt-4 border border-white/8 space-y-3">
          {booking.slot && (
            <>
              <div className="flex items-center gap-2 text-sm font-body text-cream/70">
                <Clock size={15} className="text-lime" />
                <span>
                  {format(parseISO(booking.slot.date), 'EEEE d MMMM yyyy', { locale: fr })}
                  {' · '}{booking.slot.start_time} – {booking.slot.end_time}
                </span>
              </div>
            </>
          )}
          {booking.gym && (
            <div className="flex items-center gap-2 text-sm font-body text-cream/70">
              <MapPin size={15} className="text-lime" />
              <span>{booking.gym.address}, {booking.gym.city}</span>
            </div>
          )}
        </div>

        {/* QR Code */}
        {status === 'upcoming' && (
          <div className="bg-white rounded-2xl p-6 mt-4 flex flex-col items-center">
            <QRCode value={booking.qr_code} size={200} level="M" />
            <p className="font-heading text-2xl text-black mt-4 tracking-widest">{booking.qr_code}</p>
            <p className="text-black/50 font-body text-xs mt-1 text-center">{t('booking_qr_hint')}</p>
          </div>
        )}

        {/* Cancel */}
        {canCancel && (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full mt-4 py-4 rounded-xl border border-red-500/30 text-red-400 font-body font-medium"
          >
            {t('booking_cancel')}
          </button>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end">
          <div className="w-full max-w-lg mx-auto bg-charcoal rounded-t-3xl p-6 border-t border-white/10">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            <h3 className="font-heading text-xl text-cream mb-2">ANNULER LA RÉSERVATION</h3>
            {hoursUntil < 2 ? (
              <p className="text-orange font-body text-sm mb-6">{t('booking_cancel_too_late')}</p>
            ) : (
              <p className="text-white/60 font-body text-sm mb-6">{t('booking_cancel_confirm')}</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 rounded-xl border border-white/20 text-cream font-body">
                {t('cancel')}
              </button>
              {hoursUntil >= 2 && (
                <button onClick={handleCancel} className="flex-[2] py-4 rounded-xl bg-red-500/80 text-white font-body font-bold">
                  Confirmer l'annulation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
