import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { fadeUp } from '../../lib/motion'

interface StatCardProps {
  title: string
  value: string | number
  delta?: string
  deltaDirection?: 'up' | 'down'
  icon: LucideIcon
  accentColor: 'red' | 'amber' | 'blue' | 'green'
  className?: string
}

const accentMap = {
  red: {
    icon: 'text-red-400 bg-red-900/30 border border-red-800/40',
    delta: 'text-red-400',
    bar: 'bg-red-500',
  },
  amber: {
    icon: 'text-amber-400 bg-amber-900/30 border border-amber-800/40',
    delta: 'text-amber-400',
    bar: 'bg-amber-500',
  },
  blue: {
    icon: 'text-blue-400 bg-blue-900/30 border border-blue-800/40',
    delta: 'text-blue-400',
    bar: 'bg-blue-500',
  },
  green: {
    icon: 'text-green-400 bg-green-900/30 border border-green-800/40',
    delta: 'text-green-400',
    bar: 'bg-green-500',
  },
}

export function StatCard({ title, value, delta, deltaDirection, icon: Icon, accentColor, className }: StatCardProps) {
  const accent = accentMap[accentColor]
  const isUp = deltaDirection === 'up'

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'relative bg-ss-bg-surface border border-ss-border rounded-ss-lg p-5 flex flex-col gap-4 overflow-hidden',
        className
      )}
    >
      {/* Accent top bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-[2px] rounded-t-ss-lg', accent.bar)} />
      <div className="flex items-start justify-between">
        <p className="text-caption text-ss-text-secondary font-medium">{title}</p>
        <div className={cn('p-2 rounded-ss-md', accent.icon)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-h1 font-medium text-ss-text-primary">{value}</p>
        {delta && (
          <div className={cn('flex items-center gap-1 text-caption', accent.delta)}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{delta}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
