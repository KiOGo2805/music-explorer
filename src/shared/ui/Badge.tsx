import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300 ${className}`}>
      {children}
    </span>
  )
}
