import { forwardRef, ButtonHTMLAttributes } from 'react'
import { LucideIcon, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: LucideIcon
  iconRight?: LucideIcon
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, icon: Icon, iconRight: IconRight, className, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white',
      secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
      ghost: 'text-gray-400 hover:text-white hover:bg-gray-900',
      danger: 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800',
      outline: 'border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white hover:bg-white/5',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : Icon ? (
          <Icon className="w-4 h-4" />
        ) : null}
        {children}
        {!loading && IconRight && <IconRight className="w-4 h-4" />}
      </button>
    )
  }
)

Button.displayName = 'Button'
