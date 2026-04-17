import { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-6', className)} {...props}>
      {children}
    </div>
  )
}
