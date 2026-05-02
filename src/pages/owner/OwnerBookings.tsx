import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { QrCode, Check, X } from 'lucide-react'
import { MOCK_OWNER_BOOKINGS } from '@/lib/mockData'
import type { Booking, BookingStatus } from '@/types'
import Badge from '@/components/ui/Badge'

const statusVariant = {
  upcoming: 'lime',
  checked_in: 'orange',
  cancelled: 'red',
} as const

const memberNames: Record<string, string> = {
  'u-100': 'Sami Trabelsi',
  'u-101': 'Youssef Kaabi',
  'u-102': 'Rania Ben Ali',
  'mock-member-1': 'Sami Trabelsi',
}

export default function OwnerBookings() {
  const { t } = useTranslation()
  const [bookings, setBookings] = useState<Booking[]>(MOCK_OWNER_BOOKINGS)
  const [scanCode, setScanCode] = useState('')
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null)
  const [showScanner, setShowScanner] = useState(false)

  const handleCheckIn = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'checked_in' as BookingStatus } : b)
    )
  }

  const handleScan = () => {
    const found = bookings.find(b => b.qr_code === scanCode.trim().toUpperCase())
    if (found && found.status === 'upcoming') {
      handleCheckIn(found.id)
      setScanResult('success')
      setScanCode('')
    } else {
      setScanResult('error')
    }
    setTimeout(() => setScanResult(null), 2000)
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 pt-14 pb-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl text-cream">{t('owner_bookings_title').toUpperCase()}</h1>
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 bg-lime text-black px-3 py-2 rounded-xl font-body font-medium text-sm"
          >
            <QrCode size={16} />
            Scanner
          </button>
        </div>
      </div>

      {/* Bookings list */}
      <div className="px-4 pt-4 max-w-lg mx-auto space-y-3">
        {bookings.map(booking => {
          const memberName = memberNames[booking.member_id] ?? 'Membre inconnu'
          const dateLabel = booking.slot
            ? format(parseISO(booking.slot.date), 'd MMM', { locale: fr })
            : '—'
          return (
            <div key={booking.id} className="bg-charcoal rounded-2xl p-4 border border-white/8">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-lime/20 flex items-center justify-center">
                      <span className="font-heading text-sm text-lime">{memberName[0]}</span>
                    </div>
                    <div>
                      <p className="text-cream font-body font-medium text-sm">{memberName}</p>
                      <p className="text-white/40 font-body text-xs">
                        {dateLabel}{booking.slot ? ` · ${booking.slot.start_time}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[booking.status]}>
                    {t(`booking_status_${booking.status}`)}
                  </Badge>
                  {booking.status === 'upcoming' && (
                    <button
                      onClick={() => handleCheckIn(booking.id)}
                      className="w-8 h-8 rounded-full bg-lime/20 border border-lime/40 flex items-center justify-center"
                    >
                      <Check size={14} className="text-lime" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
                <span className="text-white/30 font-body text-xs">QR: {booking.qr_code}</span>
                <span className="text-lime/70 font-body text-xs">{booking.credit_cost} crédits</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* QR Scanner modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-end">
          <div className="w-full max-w-lg mx-auto bg-charcoal rounded-t-3xl p-6 border-t border-white/10">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-2xl text-cream">{t('owner_scan_qr').toUpperCase()}</h3>
              <button onClick={() => { setShowScanner(false); setScanResult(null) }}>
                <X size={22} className="text-white/50" />
              </button>
            </div>

            {/* Simulated QR scanner area */}
            <div className="relative bg-black rounded-2xl h-48 flex items-center justify-center mb-4 overflow-hidden">
              <div className="border-2 border-lime/40 w-36 h-36 rounded-xl relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-lime rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-lime rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-lime rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-lime rounded-br-lg" />
              </div>
              <p className="absolute bottom-3 text-white/30 font-body text-xs text-center px-4">
                Ou saisir le code manuellement
              </p>
            </div>

            {/* Manual input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={scanCode}
                onChange={e => setScanCode(e.target.value.toUpperCase())}
                placeholder="RIA-XXXXXX"
                className="flex-1 bg-black text-cream font-body px-4 py-3 rounded-xl border border-white/10 focus:border-lime focus:outline-none tracking-widest text-center uppercase"
              />
              <button
                onClick={handleScan}
                className="bg-lime text-black px-5 py-3 rounded-xl font-body font-bold"
              >
                {t('owner_check_in')}
              </button>
            </div>

            {scanResult === 'success' && (
              <div className="flex items-center gap-2 bg-lime/10 border border-lime/30 rounded-xl p-3">
                <Check size={16} className="text-lime" />
                <p className="text-lime font-body text-sm font-medium">Check-in validé !</p>
              </div>
            )}
            {scanResult === 'error' && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <X size={16} className="text-red-400" />
                <p className="text-red-400 font-body text-sm">Code invalide ou déjà utilisé</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
