import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { ChevronLeft } from 'lucide-react'

export default function OTPVerify() {
  const { t } = useTranslation()
  const { verifyOTP, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const phone: string = location.state?.phone ?? ''

  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (user) {
      const dest = !user.name ? '/auth/setup' : user.role === 'gym_owner' ? '/owner' : '/'
      navigate(dest, { replace: true })
    }
  }, [user, navigate])

  const handleDigit = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...digits]
    next[idx] = val.slice(-1)
    setDigits(next)
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
    if (next.every(d => d)) submitOTP(next.join(''))
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const submitOTP = async (code: string) => {
    setError('')
    setIsLoading(true)
    try {
      await verifyOTP(phone, code)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg === 'INVALID_OTP' ? t('auth_invalid_otp') : t('err_network'))
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col px-6">
      <div className="pt-14 pb-4">
        <button onClick={() => navigate('/auth')} className="text-cream/60 flex items-center gap-1 font-body">
          <ChevronLeft size={20} /> {t('back')}
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <h2 className="font-heading text-4xl text-cream mb-2">VÉRIFICATION</h2>
        <p className="text-cream/60 font-body text-sm mb-8">
          {t('auth_otp_sent', { phone })}
        </p>

        {/* OTP Input */}
        <div className="flex gap-3 justify-center mb-6">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-2xl font-body font-bold bg-charcoal text-cream rounded-xl border border-white/10 focus:border-lime focus:outline-none transition-colors"
              autoFocus={i === 0}
            />
          ))}
        </div>

        <p className="text-cream/40 text-xs font-body text-center mb-6">{t('auth_otp_hint')}</p>

        {error && (
          <div className="bg-orange/10 border border-orange/30 rounded-xl p-3 mb-4">
            <p className="text-orange text-sm font-body text-center">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center">
            <div className="inline-block w-6 h-6 border-2 border-lime border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <button
          onClick={() => navigate('/auth')}
          className="mt-4 text-cream/40 text-sm font-body text-center"
        >
          {t('auth_otp_resend')}
        </button>
      </div>
    </div>
  )
}
