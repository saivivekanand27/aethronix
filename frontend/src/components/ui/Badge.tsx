import { cn } from '../../lib/utils'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const styles: Record<Variant, string> = {
  default: 'bg-gray-800 text-gray-300 border border-gray-700',
  success: 'bg-green-950 text-green-400 border border-green-900',
  warning: 'bg-amber-950 text-amber-400 border border-amber-900',
  danger:  'bg-red-950  text-red-400  border border-red-900',
  info:    'bg-blue-950 text-blue-400  border border-blue-900',
  purple:  'bg-purple-950 text-purple-400 border border-purple-900',
}

const dots: Record<Variant, string> = {
  default: 'bg-gray-400',
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-blue-400',
  purple:  'bg-purple-400',
}

export function Badge({ variant = 'default', children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        styles[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dots[variant])} />}
      {children}
    </span>
  )
}
