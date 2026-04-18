import { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ hoverable = false, className, children, padding = 'md', ...props }: CardProps) {
  const paddingClass =
    padding === 'none' ? '' :
    padding === 'sm' ? 'p-3' :
    padding === 'md' ? 'p-4' :
    'p-6'

  return (
    <div
      className={cn(
        'bg-gray-900 border border-gray-800 rounded-xl transition-all duration-200',
        hoverable && 'hover:border-gray-700 hover:-translate-y-0.5 cursor-pointer',
        paddingClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
