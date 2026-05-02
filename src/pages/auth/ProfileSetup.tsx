import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { PLANS, CITIES, type PlanName, type City, type UserRole } from '@/types'
import { Check } from 'lucide-react'

export default function ProfileSetup() {
  const { t } = useTranslation()
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<'basic' | 'plan'>('basic')
  const [name, setName] = useState(user?.name ?? '')
  const [city, setCity] = useState<City>(user?.city ?? 'Tunis')
  const [role, setRole] = useState<UserRole>(user?.role ?? 'member')
  const [plan, setPlan] = useState<PlanName>(user?.plan ?? 'all_city')
  const [isLoading, setIsLoading] = useState(false)

  const handleBasicNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setStep('plan')
  }

  const handleFinish = async () => {
    setIsLoading(true)
    const credits = PLANS[plan].credits_per_month
    await updateProfile({ name: name.trim(), city, role, plan, credits })
    navigate(role === 'gym_owner' ? '/owner' : '/', { replace: true })
  }

  if (step === 'basic') {
    return (
      <div className="min-h-screen bg-black flex flex-col px-6">
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
          <h2 className="font-heading text-4xl text-cream mb-1">{t('setup_title').toUpperCase()}</h2>
          <p className="text-cream/50 font-body text-sm mb-8">Étape 1 / 2</p>

          <form onSubmit={handleBasicNext} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-cream/70 text-sm font-body mb-2">{t('setup_name_label')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('setup_name_placeholder')}
                className="w-full bg-charcoal text-cream font-body text-lg px-4 py-4 rounded-xl border border-white/10 focus:border-lime focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-cream/70 text-sm font-body mb-2">{t('setup_city_label')}</label>
              <div className="flex gap-2">
                {CITIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`flex-1 py-3 rounded-xl font-body text-sm font-medium border transition-colors ${
                      city === c
                        ? 'bg-lime text-black border-lime'
                        : 'bg-charcoal text-cream/60 border-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-cream/70 text-sm font-body mb-2">{t('setup_role_label')}</label>
              <div className="flex gap-3">
                {(['member', 'gym_owner'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-4 rounded-xl font-body text-sm font-medium border transition-colors ${
                      role === r
                        ? 'bg-lime text-black border-lime'
                        : 'bg-charcoal text-cream/60 border-white/10'
                    }`}
                  >
                    {r === 'member' ? t('setup_role_member') : t('setup_role_owner')}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-lime text-black font-body font-bold text-base py-4 rounded-xl"
            >
              {t('next')}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col px-6 pb-8">
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <h2 className="font-heading text-4xl text-cream mb-1">{t('setup_plan_label').toUpperCase()}</h2>
        <p className="text-cream/50 font-body text-sm mb-8">Étape 2 / 2</p>

        <div className="space-y-3 mb-8">
          {(Object.entries(PLANS) as [PlanName, typeof PLANS[PlanName]][]).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setPlan(key)}
              className={`w-full p-4 rounded-xl border transition-all text-left ${
                plan === key ? 'border-lime bg-lime/10' : 'border-white/10 bg-charcoal'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xl" style={{ color: p.color }}>{p.label.toUpperCase()}</span>
                    {key === 'all_city' && (
                      <span className="text-xs bg-lime text-black font-body font-bold px-2 py-0.5 rounded-full">
                        POPULAIRE
                      </span>
                    )}
                  </div>
                  <p className="text-cream/60 font-body text-sm mt-0.5">
                    {key === 'elite'
                      ? t('plan_unlimited')
                      : t('plan_credits', { count: p.credits_per_month })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cream font-body font-bold">{p.price_dt} DT</span>
                  {plan === key && (
                    <div className="w-6 h-6 rounded-full bg-lime flex items-center justify-center">
                      <Check size={14} className="text-black" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep('basic')}
            className="flex-1 py-4 rounded-xl border border-white/20 text-cream font-body font-medium"
          >
            {t('back')}
          </button>
          <button
            onClick={handleFinish}
            disabled={isLoading}
            className="flex-[2] bg-lime text-black font-body font-bold py-4 rounded-xl disabled:opacity-50"
          >
            {isLoading ? t('loading') : t('setup_plan_cta')}
          </button>
        </div>
      </div>
    </div>
  )
}
