import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MOCK_BOOKINGS } from '@/lib/mockData'
import BookingCard from '@/components/booking/BookingCard'
const tabs: { key: 'upcoming' | 'past'; label: string }[] = [
  { key: 'upcoming', label: 'bookings_upcoming' },
  { key: 'past', label: 'bookings_past' },
]

export default function Bookings() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  const filtered = MOCK_BOOKINGS.filter(b => {
    if (activeTab === 'upcoming') return b.status === 'upcoming'
    return b.status === 'checked_in' || b.status === 'cancelled'
  })

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 pt-14 pb-4 max-w-lg mx-auto">
        <h1 className="font-heading text-3xl text-cream mb-4">{t('bookings_title').toUpperCase()}</h1>

        {/* Tabs */}
        <div className="flex bg-charcoal rounded-xl p-1 gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-body font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-lime text-black'
                  : 'text-cream/50'
              }`}
            >
              {t(tab.label)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 pt-4 max-w-lg mx-auto space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/30 font-body">{t('bookings_empty')}</p>
          </div>
        ) : (
          filtered.map(b => <BookingCard key={b.id} booking={b} showQR />)
        )}
      </div>
    </div>
  )
}
