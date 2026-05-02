import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './fr'
import en from './en'
import ar from './ar'

const savedLang = localStorage.getItem('riadha_lang') ?? 'fr'

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: savedLang,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})

export default i18n

export const setLanguage = (lang: 'fr' | 'en' | 'ar') => {
  i18n.changeLanguage(lang)
  localStorage.setItem('riadha_lang', lang)
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}
