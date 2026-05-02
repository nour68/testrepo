import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Check, ChevronLeft } from 'lucide-react'
import QRCode from 'qrcode.react'
import { MOCK_GYMS, MOCK_SLOTS } from '@/lib/mockData'
import { useAuth } from '@/context/AuthContext'
import type { Booking } from '@/types'

function generateQR(): string {
  return `RIA-${Math.floor(100000 + Math.random() * 900000)}`
}

type Step = 'confirm' | 'success'

export default function BookingFlow() {
  const { gymId, slotId } = useParams<{ gymId: string; slotId: string }>()
  const { t } = useTranslation()
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('confirm')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const gym = MOCK_GYMS.find(g => g.id === gymId)
  const slot = MOCK_SLOTS.find(s => s.id === slotId)

  if (!gym || !slot || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-body">Données introuvables</p>
      </div>
    )
  }

  const creditsAfter = user.plan === 'elite' ? user.credits : user.credits - gym.credit_cost
  const dateLabel = format(parseISO(slot.date), 'EEEE d MMMM', { locale: fr })

  const handleConfirm = async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 800)) // simulate API call
    const qr = generateQR()
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      member_id: user.id,
      gym_id: gym.id,
      slot_id: slot.id,
      status: 'upcoming',
      qr_code: qr,
      credit_cost: gym.credit_cost,
      created_at: new Date().toISOString(),
      gym,
      slot,
    }
    setBooking(newBooking)
    if (user.plan !== 'elite') {
      await updateProfile({ credits: creditsAfter })
    }
    setStep('success')
    setIsLoading(false)
  }

  if (step === 'success' && booking) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Success header */}
        <div className="bg-lime px-4 py-8 text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-lime" />
          </div>
          <h1 className="font-heading text-3xl text-black">{t('booking_success_title').toUpperCase()}</h1>
          <p className="text-black/60 font-body text-sm mt-1">{gym.name}</p>
        </div>

        <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center mb-6">
            <QRCode value={booking.qr_code} size={180} level="M" />
            <p className="font-heading text-2xl text-black mt-4 tracking-widest">{booking.qr_code}</p>
            <p className="text-black/50 font-body text-xs mt-1">{t('booking_qr_hint')}</p>
          </div>

          {/* Booking details */}
          <div className="bg-charcoal rounded-2xl p-5 border border-white/8 space-y-3 mb-6">
            <DetailRow label={t('booking_confirm_gym')} value={gym.name} />
            <DetailRow label={t('booking_confirm_date')} value={dateLabel} />
            <DetailRow label={t('booking_confirm_time')} value={`${slot.start_time} – ${slot.end_time}`} />
            <DetailRow label={t('booking_confirm_cost')} value={`${gym.credit_cost} crédits`} accent />
          </div>

          <button
            onClick={() => navigate('/bookings')}
            className="w-full bg-lime text-black font-body font-bold py-4 rounded-xl"
          >
            {t('done')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center gap-3 max-w-lg mx-auto w-full border-b border-white/8">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft size={22} className="text-cream/70" />
        </button>
        <h1 className="font-heading text-2xl text-cream">{t('booking_confirm_title').toUpperCase()}</h1>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {/* Gym photo */}
        <div className="relative h-36 rounded-2xl overflow-hidden mb-6">
          {gym.photos[0] && (
            <img src={gym.photos[0]} alt={gym.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <h2 className="font-heading text-2xl text-cream">{gym.name}</h2>
            <p className="text-white/60 font-body text-xs">{gym.city}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-charcoal rounded-2xl p-5 border border-white/8 space-y-4 mb-6">
          <DetailRow label={t('booking_confirm_date')} value={dateLabel} />
          <DetailRow label={t('booking_confirm_time')} value={`${slot.start_time} – ${slot.end_time}`} />
          <div className="border-t border-white/8 pt-4 space-y-3">
            <DetailRow label={t('booking_confirm_cost')} value={`${gym.credit_cost} crédits`} accent />
            <DetailRow
              label={t('booking_confirm_balance_after')}
              value={user.plan === 'elite' ? '∞ crédits' : `${creditsAfter} crédits`}
            />
          </div>
        </div>

        {creditsAfter < 0 && (
          <div className="bg-orange/10 border border-orange/30 rounded-xl p-3 mb-4">
            <p className="text-orange text-sm font-body text-center">{t('gym_not_enough_credits')}</p>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={isLoading || (user.plan !== 'elite' && creditsAfter < 0)}
          className="w-full bg-lime text-black font-body font-bold py-4 rounded-xl disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Confirmation...
            </span>
          ) : (
            t('confirm')
          )}
        </button>
      </div>
    </div>
  )
}

function DetailRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50 font-body text-sm">{label}</span>
      <span className={`font-body font-semibold text-sm ${accent ? 'text-lime' : 'text-cream'}`}>{value}</span>
    </div>
  )
}
