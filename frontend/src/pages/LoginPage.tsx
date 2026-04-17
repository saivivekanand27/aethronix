import { motion } from 'framer-motion'
import { ShieldAlert, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { pageVariants } from '../lib/motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('analyst@securesight.io')
  const [password, setPassword] = useState('••••••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1200)
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-ss-bg-base flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0f1520 0%, #0A0C10 70%)',
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-ss-lg flex items-center justify-center mb-4 shadow-ss-lg">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-h2 font-medium text-ss-text-primary">SecureSight</h1>
          <p className="text-caption text-ss-text-muted mt-1">Enterprise Threat Intelligence Platform</p>
        </div>

        {/* Card */}
        <div className="bg-ss-bg-surface border border-ss-border rounded-ss-xl p-6 shadow-ss-lg">
          <h2 className="text-h3 font-medium text-ss-text-primary mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              prefix={<Mail className="w-4 h-4" />}
              placeholder="analyst@company.com"
              required
              autoComplete="email"
            />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-caption text-ss-text-secondary font-medium">Password</label>
                <button
                  type="button"
                  className="text-caption text-blue-400 hover:text-blue-300 transition-colors focus-visible:outline-none"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-ss-text-muted pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-ss-bg-elevated border border-ss-border rounded-ss-md text-body text-ss-text-primary placeholder:text-ss-text-muted pl-9 pr-10 py-2 transition-colors duration-150 focus:outline-none focus:border-ss-accent-blue focus:ring-1 focus:ring-ss-accent-blue/30"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 text-ss-text-muted hover:text-ss-text-primary transition-colors focus-visible:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2 justify-center"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-ss-border-muted">
            <p className="text-caption text-ss-text-muted text-center">
              Demo credentials pre-filled. Click{' '}
              <span className="text-ss-text-secondary">Sign in</span> to continue.
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-ss-text-muted mt-6">
          © 2026 SecureSight Inc. · SOC 2 Type II Certified
        </p>
      </div>
    </motion.div>
  )
}
