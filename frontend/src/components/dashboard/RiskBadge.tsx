import { cn } from '../../lib/utils'

type Risk = 'High' | 'Medium' | 'Low' | 'high' | 'medium' | 'low'

interface RiskBadgeProps {
  risk: Risk
  size?: 'sm' | 'md'
}

const styles: Record<string, string> = {
  high:   'bg-red-950 text-red-400 border border-red-900',
  medium: 'bg-amber-950 text-amber-400 border border-amber-900',
  low:    'bg-green-950 text-green-400 border border-green-900',
}

const dots: Record<string, string> = {
  high:   'bg-red-400',
  medium: 'bg-amber-400',
  low:    'bg-green-400',
}

export function RiskBadge({ risk, size = 'sm' }: RiskBadgeProps) {
  const key = risk.toLowerCase()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        styles[key],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dots[key])} />
      {risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase()}
    </span>
  )
}
