import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const show = () => setVisible(true)
    const hide = () => setVisible(false)
    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)
    return () => {
      el.removeEventListener('mouseenter', show)
      el.removeEventListener('mouseleave', hide)
    }
  }, [])

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      {children}
      {visible && (
        <div
          className={cn(
            'absolute z-50 px-2.5 py-1.5 text-caption text-ss-text-primary bg-ss-bg-elevated border border-ss-border rounded-ss-md shadow-ss-lg whitespace-nowrap pointer-events-none',
            positions[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
