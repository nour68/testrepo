import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface HeaderProps {
  title: string
  showBack?: boolean
  right?: React.ReactNode
}

export default function Header({ title, showBack, right }: HeaderProps) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 py-4 flex items-center justify-between max-w-lg mx-auto w-full">
      {showBack ? (
        <button onClick={() => navigate(-1)} className="text-cream/70 flex items-center gap-1 -ml-1">
          <ChevronLeft size={22} />
        </button>
      ) : (
        <span className="w-8" />
      )}
      <h1 className="font-heading text-2xl text-cream tracking-widest">{title.toUpperCase()}</h1>
      <div className="w-8 flex justify-end">{right}</div>
    </header>
  )
}
