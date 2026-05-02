import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'

export default function PhoneAuth() {
  const { t } = useTranslation()
  const { sendOTP, setMockUser } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('+216')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const cleaned = phone.replace(/\s/g, '')
    if (cleaned.length < 8) {
      setError(t('auth_invalid_phone'))
      return
    }
    setIsLoading(true)
    try {
      await sendOTP(cleaned)
      navigate('/auth/otp', { state: { phone: cleaned } })
    } catch {
      setError(t('err_network'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-10 text-center">
            <h1 className="font-heading text-7xl text-lime tracking-widest">RIADHA</h1>
            <p className="text-cream/60 font-body text-sm mt-1">{t('auth_tagline')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-cream/70 text-sm font-body mb-2">
                {t('auth_phone_label')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={t('auth_phone_placeholder')}
                className="w-full bg-charcoal text-cream font-body text-lg px-4 py-4 rounded-xl border border-white/10 focus:border-lime focus:outline-none transition-colors placeholder:text-white/30"
                autoFocus
              />
              {error && <p className="text-orange text-sm mt-2 font-body">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime text-black font-body font-bold text-base py-4 rounded-xl transition-opacity disabled:opacity-50"
            >
              {isLoading ? t('loading') : t('auth_send_otp')}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-8 p-4 rounded-xl bg-charcoal border border-white/10">
            <p className="text-white/50 text-xs font-body text-center mb-3">Mode démo — connexion rapide</p>
            <div className="flex gap-2">
              <button
                onClick={() => setMockUser('member')}
                className="flex-1 py-2 rounded-lg bg-lime/20 text-lime text-sm font-body font-medium border border-lime/30"
              >
                Membre
              </button>
              <button
                onClick={() => setMockUser('owner')}
                className="flex-1 py-2 rounded-lg bg-orange/20 text-orange text-sm font-body font-medium border border-orange/30"
              >
                Gérant
              </button>
            </div>
            <p className="text-white/30 text-xs font-body text-center mt-2">
              OTP: +216 XX et code 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
