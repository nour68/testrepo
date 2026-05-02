import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { PLANS, type PlanName } from '@/types'
import { setLanguage } from '@/locales/i18n'
import { LogOut, CreditCard, Globe, Check, ChevronRight } from 'lucide-react'

export default function Profile() {
  const { t, i18n } = useTranslation()
  const { user, updateProfile, signOut } = useAuth()
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanName>(user?.plan ?? 'light')

  if (!user) return null

  const plan = PLANS[user.plan]

  const handleChangePlan = async () => {
    await updateProfile({ plan: selectedPlan, credits: PLANS[selectedPlan].credits_per_month })
    setShowPlanModal(false)
  }

  const handleLang = (lang: 'fr' | 'en' | 'ar') => {
    setLanguage(lang)
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="px-4 pt-14 pb-4 max-w-lg mx-auto">
        <h1 className="font-heading text-3xl text-cream mb-6">{t('profile_title').toUpperCase()}</h1>

        {/* Avatar & name */}
        <div className="flex items-center gap-4 bg-charcoal rounded-2xl p-5 mb-4 border border-white/8">
          <div className="w-16 h-16 rounded-full bg-lime flex items-center justify-center shrink-0">
            <span className="font-heading text-3xl text-black">{(user.name || 'R')[0].toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h2 className="font-heading text-2xl text-cream">{user.name || '—'}</h2>
            <p className="text-white/50 font-body text-sm">{user.phone}</p>
            <p className="text-white/40 font-body text-xs mt-0.5">{user.city}</p>
          </div>
        </div>

        {/* Plan */}
        <div className="bg-charcoal rounded-2xl p-5 mb-4 border border-white/8">
          <p className="text-white/50 font-body text-xs uppercase tracking-widest mb-3">{t('profile_plan')}</p>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-heading text-2xl" style={{ color: plan.color }}>{plan.label.toUpperCase()}</span>
              <p className="text-white/50 font-body text-sm">{plan.price_dt} DT / mois</p>
            </div>
            <div className="text-right">
              <p className="font-heading text-3xl text-cream">{user.plan === 'elite' ? '∞' : user.credits}</p>
              <p className="text-white/40 font-body text-xs">{t('credits')} restants</p>
            </div>
          </div>
          <button
            onClick={() => setShowPlanModal(true)}
            className="w-full py-3 rounded-xl bg-lime/10 border border-lime/30 text-lime font-body font-medium text-sm"
          >
            {t('profile_change_plan')}
          </button>
        </div>

        {/* Payment placeholder */}
        <div className="bg-charcoal rounded-2xl p-5 mb-4 border border-white/8 opacity-50">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-white/40" />
            <div>
              <p className="text-cream font-body font-medium text-sm">{t('profile_payment_placeholder')}</p>
              <p className="text-white/30 font-body text-xs">Bientôt disponible</p>
            </div>
            <ChevronRight size={16} className="text-white/30 ml-auto" />
          </div>
        </div>

        {/* Language */}
        <div className="bg-charcoal rounded-2xl p-5 mb-4 border border-white/8">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-white/50" />
            <p className="text-white/50 font-body text-xs uppercase tracking-widest">{t('profile_language')}</p>
          </div>
          <div className="flex gap-2">
            {(['fr', 'en', 'ar'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => handleLang(lang)}
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

        {/* Sign out */}
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/30 text-red-400 font-body font-medium"
        >
          <LogOut size={18} />
          {t('profile_logout')}
        </button>
      </div>

      {/* Plan modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end">
          <div className="w-full max-w-lg mx-auto bg-charcoal rounded-t-3xl p-6 border-t border-white/10">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            <h3 className="font-heading text-2xl text-cream mb-4">{t('setup_plan_label').toUpperCase()}</h3>
            <div className="space-y-3 mb-6">
              {(Object.entries(PLANS) as [PlanName, typeof PLANS[PlanName]][]).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    selectedPlan === key ? 'border-lime bg-lime/10' : 'border-white/10 bg-black/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading text-xl" style={{ color: p.color }}>{p.label.toUpperCase()}</span>
                      <p className="text-white/50 font-body text-sm">
                        {key === 'elite' ? t('plan_unlimited') : t('plan_credits', { count: p.credits_per_month })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cream font-body font-bold">{p.price_dt} DT</span>
                      {selectedPlan === key && <Check size={16} className="text-lime" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPlanModal(false)} className="flex-1 py-4 rounded-xl border border-white/20 text-cream font-body">
                {t('cancel')}
              </button>
              <button onClick={handleChangePlan} className="flex-[2] py-4 rounded-xl bg-lime text-black font-body font-bold">
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
