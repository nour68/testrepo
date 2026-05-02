import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { MOCK_GYMS } from '@/lib/mockData'
import { CATEGORIES, type SportCategory } from '@/types'
import { Check, Plus, Minus } from 'lucide-react'
import Badge from '@/components/ui/Badge'

export default function OwnerGymProfile() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const initialGym = MOCK_GYMS.find(g => g.owner_id === user?.id) ?? MOCK_GYMS[0]

  const [name, setName] = useState(initialGym.name)
  const [description, setDescription] = useState(initialGym.description)
  const [address, setAddress] = useState(initialGym.address)
  const [categories, setCategories] = useState<SportCategory[]>(initialGym.categories)
  const [creditCost, setCreditCost] = useState(initialGym.credit_cost)
  const [openTime, setOpenTime] = useState(initialGym.opening_hours.open)
  const [closeTime, setCloseTime] = useState(initialGym.opening_hours.close)
  const [saved, setSaved] = useState(false)

  const toggleCategory = (cat: SportCategory) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-black pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 pt-14 pb-4 max-w-lg mx-auto">
        <h1 className="font-heading text-3xl text-cream">{t('owner_gym_profile').toUpperCase()}</h1>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        {/* Photo preview */}
        <div className="relative h-40 rounded-2xl overflow-hidden">
          {initialGym.photos[0] && (
            <img src={initialGym.photos[0]} alt={name} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <Badge variant="gray">Photo principale</Badge>
          </div>
        </div>

        {/* Name */}
        <Field label="Nom de la salle">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-charcoal text-cream font-body px-4 py-3 rounded-xl border border-white/10 focus:border-lime focus:outline-none"
          />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-charcoal text-cream font-body px-4 py-3 rounded-xl border border-white/10 focus:border-lime focus:outline-none resize-none"
          />
        </Field>

        {/* Address */}
        <Field label="Adresse">
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full bg-charcoal text-cream font-body px-4 py-3 rounded-xl border border-white/10 focus:border-lime focus:outline-none"
          />
        </Field>

        {/* Categories */}
        <Field label="Catégories de sport">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-body border transition-colors ${
                  categories.includes(cat)
                    ? 'bg-lime text-black border-lime'
                    : 'bg-charcoal text-cream/60 border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Field>

        {/* Credit cost */}
        <Field label="Coût par visite (crédits)">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCreditCost(Math.max(1, creditCost - 1))}
              className="w-10 h-10 rounded-full bg-charcoal border border-white/20 flex items-center justify-center"
            >
              <Minus size={16} className="text-cream" />
            </button>
            <div className="flex-1 text-center">
              <span className="font-heading text-4xl text-lime">{creditCost}</span>
              <p className="text-white/40 font-body text-xs">crédits / séance</p>
            </div>
            <button
              onClick={() => setCreditCost(Math.min(10, creditCost + 1))}
              className="w-10 h-10 rounded-full bg-charcoal border border-white/20 flex items-center justify-center"
            >
              <Plus size={16} className="text-cream" />
            </button>
          </div>
        </Field>

        {/* Hours */}
        <Field label="Horaires d'ouverture">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <p className="text-white/50 font-body text-xs mb-1">Ouverture</p>
              <input
                type="time"
                value={openTime}
                onChange={e => setOpenTime(e.target.value)}
                className="w-full bg-charcoal text-cream font-body px-4 py-3 rounded-xl border border-white/10 focus:border-lime focus:outline-none"
              />
            </div>
            <span className="text-white/30 font-body mt-4">–</span>
            <div className="flex-1">
              <p className="text-white/50 font-body text-xs mb-1">Fermeture</p>
              <input
                type="time"
                value={closeTime}
                onChange={e => setCloseTime(e.target.value)}
                className="w-full bg-charcoal text-cream font-body px-4 py-3 rounded-xl border border-white/10 focus:border-lime focus:outline-none"
              />
            </div>
          </div>
        </Field>
      </div>

      {/* Save button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 p-4 max-w-lg mx-auto">
        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-xl font-body font-bold text-base transition-all flex items-center justify-center gap-2 ${
            saved ? 'bg-lime/20 text-lime border border-lime/40' : 'bg-lime text-black'
          }`}
        >
          {saved ? <><Check size={18} /> Enregistré !</> : t('owner_save_profile')}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-charcoal rounded-2xl p-4 border border-white/8">
      <p className="text-white/50 font-body text-xs uppercase tracking-widest mb-3">{label}</p>
      {children}
    </div>
  )
}
