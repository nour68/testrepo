import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Star, MapPin, Clock, Zap, ChevronLeft } from 'lucide-react'
import { MOCK_GYMS, MOCK_SLOTS } from '@/lib/mockData'
import { useAuth } from '@/context/AuthContext'
import type { TimeSlot } from '@/types'
import Badge from '@/components/ui/Badge'

export default function GymDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [photoIdx, setPhotoIdx] = useState(0)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  const gym = MOCK_GYMS.find(g => g.id === id)

  if (!gym) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-body">Salle introuvable</p>
      </div>
    )
  }

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))
  const slotsForDate = MOCK_SLOTS.filter(s => s.gym_id === gym.id && s.date === selectedDate)
  const hasCredits = user ? user.credits >= gym.credit_cost || user.plan === 'elite' : false

  const handleBook = () => {
    if (!selectedSlot) return
    navigate(`/book/${gym.id}/${selectedSlot.id}`)
  }

  return (
    <div className="min-h-screen bg-black pb-32">
      {/* Photos */}
      <div className="relative h-72 bg-black/40">
        {gym.photos.length > 0 && (
          <img
            src={gym.photos[photoIdx]}
            alt={gym.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left-4 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center"
        >
          <ChevronLeft size={20} className="text-cream" />
        </button>

        {/* Photo dots */}
        {gym.photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {gym.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIdx ? 'bg-lime' : 'bg-white/30'}`}
              />
            ))}
          </div>
        )}

        {/* Gym name overlay */}
        <div className="absolute bottom-6 left-4 right-4">
          <h1 className="font-heading text-4xl text-cream">{gym.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <Star size={13} className="text-lime fill-lime" />
              <span className="text-cream font-body text-sm font-medium">{gym.rating}</span>
            </div>
            <span className="text-white/30">·</span>
            <div className="flex items-center gap-1 text-white/60 font-body text-sm">
              <MapPin size={12} /> {gym.city}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {/* Categories & credit cost */}
        <div className="flex items-center justify-between py-4 border-b border-white/8">
          <div className="flex gap-1.5 flex-wrap">
            {gym.categories.map(c => <Badge key={c}>{c}</Badge>)}
          </div>
          <div className="flex items-center gap-1.5 bg-lime/15 border border-lime/30 px-3 py-1.5 rounded-full">
            <Zap size={13} className="text-lime" />
            <span className="text-lime font-body font-bold text-sm">{gym.credit_cost} crédits</span>
          </div>
        </div>

        {/* Description */}
        <div className="py-4 border-b border-white/8">
          <h2 className="font-heading text-lg text-cream mb-2">{t('gym_about').toUpperCase()}</h2>
          <p className="text-white/60 font-body text-sm leading-relaxed">{gym.description}</p>
        </div>

        {/* Hours & Address */}
        <div className="py-4 border-b border-white/8 space-y-3">
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-lime mt-0.5 shrink-0" />
            <div>
              <p className="text-cream font-body text-sm font-medium">{gym.opening_hours.open} – {gym.opening_hours.close}</p>
              <p className="text-white/40 font-body text-xs">{gym.opening_hours.days.join(', ')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-lime mt-0.5 shrink-0" />
            <p className="text-cream font-body text-sm">{gym.address}</p>
          </div>
        </div>

        {/* Date picker */}
        <div className="py-4 border-b border-white/8">
          <h2 className="font-heading text-lg text-cream mb-3">{t('gym_select_date').toUpperCase()}</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {dates.map(d => {
              const key = format(d, 'yyyy-MM-dd')
              const isSelected = key === selectedDate
              return (
                <button
                  key={key}
                  onClick={() => { setSelectedDate(key); setSelectedSlot(null) }}
                  className={`shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border transition-colors ${
                    isSelected ? 'bg-lime text-black border-lime' : 'bg-charcoal text-cream/60 border-white/10'
                  }`}
                >
                  <span className="font-body text-xs font-medium">{format(d, 'EEE', { locale: fr }).toUpperCase()}</span>
                  <span className="font-heading text-xl">{format(d, 'd')}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Slots */}
        <div className="py-4">
          <h2 className="font-heading text-lg text-cream mb-3">{t('gym_available_slots').toUpperCase()}</h2>
          {slotsForDate.length === 0 ? (
            <p className="text-white/30 font-body text-sm text-center py-6">Aucun créneau disponible</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slotsForDate.map(slot => {
                const isFull = slot.booked_count >= slot.capacity
                const isSelected = selectedSlot?.id === slot.id
                return (
                  <button
                    key={slot.id}
                    disabled={isFull}
                    onClick={() => setSelectedSlot(isSelected ? null : slot)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isFull
                        ? 'bg-black/20 border-white/5 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-lime text-black border-lime'
                        : 'bg-charcoal border-white/10 text-cream'
                    }`}
                  >
                    <p className="font-body font-bold text-sm">{slot.start_time}</p>
                    <p className={`font-body text-xs mt-0.5 ${isFull ? 'text-red-400' : isSelected ? 'text-black/60' : 'text-white/40'}`}>
                      {isFull ? t('gym_slot_full') : `${slot.capacity - slot.booked_count} pl.`}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 p-4 max-w-lg mx-auto">
        {!hasCredits && selectedSlot && (
          <p className="text-orange font-body text-xs text-center mb-2">{t('gym_not_enough_credits')}</p>
        )}
        <button
          disabled={!selectedSlot || !hasCredits}
          onClick={handleBook}
          className={`w-full py-4 rounded-xl font-body font-bold text-base transition-all ${
            selectedSlot && hasCredits
              ? 'bg-lime text-black'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          {selectedSlot
            ? hasCredits
              ? `${t('gym_book_now')} — ${gym.credit_cost} crédits`
              : t('gym_not_enough_credits')
            : t('gym_book_slot')}
        </button>
      </div>
    </div>
  )
}
