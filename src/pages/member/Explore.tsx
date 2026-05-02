import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { MOCK_GYMS } from '@/lib/mockData'
import type { City, SportCategory } from '@/types'
import GymCard from '@/components/gym/GymCard'
import GymFilters from '@/components/gym/GymFilters'

export default function Explore() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [city, setCity] = useState<City | ''>('')
  const [category, setCategory] = useState<SportCategory | ''>('')

  const filtered = useMemo(() => {
    return MOCK_GYMS.filter(gym => {
      const matchesQuery = !query || gym.name.toLowerCase().includes(query.toLowerCase())
      const matchesCity = !city || gym.city === city
      const matchesCat = !category || gym.categories.includes(category)
      return matchesQuery && matchesCity && matchesCat
    })
  }, [query, city, category])

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Fixed top */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 pt-14 pb-4 max-w-lg mx-auto">
        <h1 className="font-heading text-3xl text-cream mb-4">{t('explore_title').toUpperCase()}</h1>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('explore_search_placeholder')}
            className="w-full bg-charcoal text-cream font-body text-sm pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:border-lime focus:outline-none transition-colors placeholder:text-white/30"
          />
        </div>

        <GymFilters
          selectedCity={city}
          selectedCategory={category}
          onCityChange={setCity}
          onCategoryChange={setCategory}
        />
      </div>

      {/* Results */}
      <div className="px-4 pt-4 max-w-lg mx-auto">
        <p className="text-white/40 font-body text-sm mb-4">
          {filtered.length} salle{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
        </p>
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/30 font-body">{t('explore_no_results')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(gym => <GymCard key={gym.id} gym={gym} />)}
          </div>
        )}
      </div>
    </div>
  )
}
