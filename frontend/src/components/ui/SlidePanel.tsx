import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { slideInRight } from '../../lib/motion'
import { cn } from '../../lib/utils'

interface SlidePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  width?: 'md' | 'lg'
  children: React.ReactNode
}

export function SlidePanel({ isOpen, onClose, title, width = 'md', children }: SlidePanelProps) {
  const widthClass = width === 'lg' ? 'w-[640px]' : 'w-[480px]'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            variants={slideInRight}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'fixed top-0 right-0 h-full bg-ss-bg-surface border-l border-ss-border z-50 flex flex-col shadow-ss-lg',
              widthClass
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-ss-border flex-shrink-0">
              <h2 className="text-h3 font-medium text-ss-text-primary truncate">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-ss-md text-ss-text-muted hover:text-ss-text-primary hover:bg-ss-bg-elevated transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-accent-blue"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
