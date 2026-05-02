import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { setLanguage } from '@/locales/i18n'
import { LogOut, Globe } from 'lucide-react'

export default function OwnerProfile() {
  const { t, i18n } = useTranslation()
  const { user, signOut } = useAuth()
  if (!user) return null

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="px-4 pt-14 pb-4 max-w-lg mx-auto">
        <h1 className="font-heading text-3xl text-cream mb-6">{t('profile_title').toUpperCase()}</h1>

        <div className="flex items-center gap-4 bg-charcoal rounded-2xl p-5 mb-4 border border-white/8">
          <div className="w-16 h-16 rounded-full bg-orange flex items-center justify-center shrink-0">
            <span className="font-heading text-3xl text-black">{(user.name || 'G')[0].toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-heading text-2xl text-cream">{user.name || '—'}</h2>
            <p className="text-white/50 font-body text-sm">{user.phone}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-orange/20 text-orange text-xs font-body">
              Gérant de salle
            </span>
          </div>
        </div>

        <div className="bg-charcoal rounded-2xl p-5 mb-4 border border-white/8">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-white/50" />
            <p className="text-white/50 font-body text-xs uppercase tracking-widest">{t('profile_language')}</p>
          </div>
          <div className="flex gap-2">
            {(['fr', 'en', 'ar'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-body font-medium transition-colors ${
                  i18n.language === lang
                    ? 'bg-lime text-black border-lime'
                    : 'bg-black/30 text-cream/60 border-white/10'
                }`}
              >
                {lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/30 text-red-400 font-body font-medium"
        >
          <LogOut size={18} />
          {t('profile_logout')}
        </button>
      </div>
    </div>
  )
}
