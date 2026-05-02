import { useTranslation } from 'react-i18next'
import { CITIES, CATEGORIES, type City, type SportCategory } from '@/types'

interface GymFiltersProps {
  selectedCity: City | ''
  selectedCategory: SportCategory | ''
  onCityChange: (city: City | '') => void
  onCategoryChange: (cat: SportCategory | '') => void
}

export default function GymFilters({ selectedCity, selectedCategory, onCityChange, onCategoryChange }: GymFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <FilterChip
          label={t('explore_all_cities')}
          active={!selectedCity}
          onClick={() => onCityChange('')}
        />
        {CITIES.map(c => (
          <FilterChip key={c} label={c} active={selectedCity === c} onClick={() => onCityChange(c)} />
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <FilterChip
          label={t('explore_all_categories')}
          active={!selectedCategory}
          onClick={() => onCategoryChange('')}
        />
        {CATEGORIES.map(cat => (
          <FilterChip key={cat} label={cat} active={selectedCategory === cat} onClick={() => onCategoryChange(cat)} />
        ))}
      </div>
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-body font-medium border transition-colors ${
        active
          ? 'bg-lime text-black border-lime'
          : 'bg-charcoal text-cream/60 border-white/10'
      }`}
    >
      {label}
    </button>
  )
}
