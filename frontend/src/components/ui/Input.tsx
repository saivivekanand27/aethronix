import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  hint?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">{label}</label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3.5 text-gray-500 pointer-events-none flex items-center">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder:text-gray-600',
              'px-4 py-3 transition-colors duration-150',
              'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20',
              prefix && 'pl-10',
              suffix && 'pr-10',
              error && 'border-red-700 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3.5 text-gray-500 pointer-events-none flex items-center">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export const SearchInput = Input

