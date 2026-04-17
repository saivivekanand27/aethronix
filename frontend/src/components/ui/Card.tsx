import { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

export function Card({ hoverable = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900 border border-gray-800 rounded-xl transition-all duration-200',
        hoverable && 'hover:border-gray-700 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
