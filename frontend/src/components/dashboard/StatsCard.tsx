import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  delta?: string
  deltaDirection?: 'up' | 'down'
  icon: LucideIcon
  accentColor?: 'blue' | 'red' | 'amber' | 'green'
}

const colors = {
  blue:  { icon: 'bg-blue-950 text-blue-400 border-blue-900',  bar: 'bg-blue-500',  trend: 'text-blue-400' },
  red:   { icon: 'bg-red-950  text-red-400  border-red-900',   bar: 'bg-red-500',   trend: 'text-red-400' },
  amber: { icon: 'bg-amber-950 text-amber-400 border-amber-900', bar: 'bg-amber-500', trend: 'text-amber-400' },
  green: { icon: 'bg-green-950 text-green-400 border-green-900', bar: 'bg-green-500', trend: 'text-green-400' },
}

export function StatsCard({ title, value, subtitle, delta, deltaDirection, icon: Icon, accentColor = 'blue' }: StatsCardProps) {
  const c = colors[accentColor]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-[2px]', c.bar)} />

      <div className="flex items-start justify-between mb-5">
        <div className={cn('p-2.5 rounded-xl border', c.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {delta && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', c.trend)}>
            {deltaDirection === 'up'
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />}
            {delta}
          </div>
        )}
      </div>

      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
      {subtitle && <p className="text-xs text-gray-700 mt-0.5">{subtitle}</p>}
    </motion.div>
  )
}
