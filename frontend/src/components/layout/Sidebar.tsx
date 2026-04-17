import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Bell, Shield, Flame, Server, BarChart2,
  Settings, ChevronLeft, ChevronRight, ShieldAlert, User
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface NavItemDef {
  label: string
  path: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItemDef[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Threat Intel', path: '/threats', icon: Shield },
  { label: 'Incidents', path: '/incidents', icon: Flame },
  { label: 'Assets', path: '/assets', icon: Server },
  { label: 'Reports', path: '/reports', icon: BarChart2 },
]

const STORAGE_KEY = 'ss-sidebar-collapsed'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed))
  }, [collapsed])

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col bg-ss-bg-surface border-r border-ss-border h-screen flex-shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-ss-border min-h-[64px]">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-ss-md flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-h4 font-medium text-ss-text-primary whitespace-nowrap"
          >
            SecureSight
          </motion.span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="flex flex-col gap-1 px-2">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const isActive =
              path === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(path)
            return (
              <li key={path}>
                <NavLink
                  to={path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-ss-md text-body font-medium transition-colors duration-100 relative outline-none',
                    'focus-visible:ring-2 focus-visible:ring-ss-accent-blue',
                    isActive
                      ? 'text-blue-400 bg-blue-900/20'
                      : 'text-ss-text-secondary hover:text-ss-text-primary hover:bg-ss-bg-elevated'
                  )}
                  title={collapsed ? label : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r" />
                  )}
                  <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'text-blue-400')} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>

        {/* Divider */}
        <div className="my-3 mx-4 border-t border-ss-border-muted" />

        <ul className="flex flex-col gap-1 px-2">
          <li>
            <NavLink
              to="/settings"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-ss-md text-body font-medium transition-colors duration-100 relative outline-none',
                'focus-visible:ring-2 focus-visible:ring-ss-accent-blue',
                location.pathname.startsWith('/settings')
                  ? 'text-blue-400 bg-blue-900/20'
                  : 'text-ss-text-secondary hover:text-ss-text-primary hover:bg-ss-bg-elevated'
              )}
              title={collapsed ? 'Settings' : undefined}
            >
              {location.pathname.startsWith('/settings') && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r" />
              )}
              <Settings className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="whitespace-nowrap">
                  Settings
                </motion.span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* User info at bottom */}
      <div className="border-t border-ss-border p-3 flex items-center gap-3 min-h-[64px]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="min-w-0">
            <p className="text-caption font-medium text-ss-text-primary truncate">Alex Rivera</p>
            <p className="text-[11px] text-ss-text-muted truncate">Security Analyst</p>
          </motion.div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-[72px] w-6 h-6 bg-ss-bg-surface border border-ss-border rounded-full flex items-center justify-center text-ss-text-muted hover:text-ss-text-primary hover:bg-ss-bg-elevated transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-accent-blue"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  )
}
