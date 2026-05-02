import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'lime' | 'orange' | 'gray' | 'red'
}

const variants = {
  lime: 'bg-lime/15 text-lime border-lime/30',
  orange: 'bg-orange/15 text-orange border-orange/30',
  gray: 'bg-white/10 text-white/60 border-white/10',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-medium border ${variants[variant]}`}>
      {children}
    </span>
  )
}
