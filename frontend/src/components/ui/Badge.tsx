import { cn } from '../../lib/utils'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'high' | 'medium' | 'critical' | 'neutral'

interface BadgeProps {
  variant?: Variant
  size?: 'sm' | 'md'
  showDot?: boolean
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const styles: Record<Variant, string> = {
  default: 'bg-gray-800 text-gray-300 border border-gray-700',
  success: 'bg-green-950 text-green-400 border border-green-900',
  warning: 'bg-amber-950 text-amber-400 border border-amber-900',
  danger:  'bg-red-950 text-red-400 border border-red-900',
  info:    'bg-blue-950 text-blue-400 border border-blue-900',
  purple:  'bg-purple-950 text-purple-400 border border-purple-900',
  high:    'bg-red-950 text-red-400 border border-red-900',
  medium:  'bg-amber-950 text-amber-400 border border-amber-900',
  critical:'bg-red-950 text-red-400 border border-red-900',
  neutral: 'bg-gray-900 text-gray-300 border border-gray-700',
}

const dots: Record<Variant, string> = {
  default: 'bg-gray-400',
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-blue-400',
  purple:  'bg-purple-400',
  high:    'bg-red-400',
  medium:  'bg-amber-400',
  critical:'bg-red-400',
  neutral: 'bg-gray-400',
}

const sizeClasses: Record<'sm' | 'md', string> = {
  sm: 'text-[10px] px-2 py-1',
  md: 'text-xs px-2.5 py-1',
}

export function Badge({
  variant = 'default',
  size = 'md',
  showDot = false,
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizeClasses[size],
        styles[variant],
        className
      )}
    >
      {(showDot || dot) && <span className={cn('w-1.5 h-1.5 rounded-full', dots[variant])} />}
      {children}
    </span>
  )
}

export function SeverityBadge({
  severity,
  size = 'sm',
  showDot = false,
}: {
  severity: 'critical' | 'high' | 'medium' | 'low'
  size?: 'sm' | 'md'
  showDot?: boolean
}) {
  const variant =
    severity === 'critical' ? 'critical' :
    severity === 'high' ? 'danger' :
    severity === 'medium' ? 'medium' :
    'info'

  const label = severity.charAt(0).toUpperCase() + severity.slice(1)

  return (
    <Badge variant={variant} size={size} showDot={showDot}>
      {label}
    </Badge>
  )
}
