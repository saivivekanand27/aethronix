import { useLocation } from 'react-router-dom'
import { Bell, ChevronDown, User } from 'lucide-react'
import { useState } from 'react'
import { SearchInput } from '../ui/Input'
import { cn } from '../../lib/utils'

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/alerts': 'Alerts',
  '/threats': 'Threat Intelligence',
  '/incidents': 'Incidents',
  '/assets': 'Assets',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

function getBreadcrumb(pathname: string): string[] {
  const crumbs: string[] = ['SecureSight']
  const base = '/' + pathname.split('/')[1]
  if (breadcrumbMap[base]) crumbs.push(breadcrumbMap[base])
  if (pathname.split('/').length > 2) {
    const id = pathname.split('/')[2]
    if (id === 'new') crumbs.push('New')
    else crumbs.push(`#${id}`)
  }
  return crumbs
}

export function Header() {
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const breadcrumbs = getBreadcrumb(location.pathname)

  return (
    <header className="h-16 flex items-center px-6 bg-ss-bg-surface border-b border-ss-border gap-4 flex-shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-caption text-ss-text-muted flex-shrink-0">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span>/</span>}
            <span className={cn(i === breadcrumbs.length - 1 ? 'text-ss-text-primary' : 'text-ss-text-muted')}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-auto">
        <SearchInput />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notifications */}
        <button className="relative p-2 rounded-ss-md text-ss-text-secondary hover:text-ss-text-primary hover:bg-ss-bg-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-accent-blue">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(v => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-ss-md hover:bg-ss-bg-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-accent-blue"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-caption font-medium text-ss-text-primary leading-none">Alex Rivera</p>
              <p className="text-[11px] text-ss-text-muted">Analyst</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-ss-text-muted" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-ss-bg-elevated border border-ss-border rounded-ss-md shadow-ss-lg z-30 py-1">
                <a href="/settings" className="block px-3 py-2 text-body text-ss-text-secondary hover:text-ss-text-primary hover:bg-ss-bg-surface transition-colors">
                  Profile Settings
                </a>
                <div className="my-1 border-t border-ss-border-muted" />
                <button className="w-full text-left px-3 py-2 text-body text-red-400 hover:bg-ss-bg-surface transition-colors">
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
