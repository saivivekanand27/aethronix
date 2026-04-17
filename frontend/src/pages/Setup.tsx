import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Globe, Network,
  ArrowLeft, ChevronRight, Loader2
} from 'lucide-react'
import { Input } from '../components/ui/Input'

const SCAN_STEPS = [
  'Resolving DNS records...',
  'Discovering subdomains...',
  'Scanning open ports...',
  'Analyzing vulnerabilities...',
  'Generating AI insights...',
]

export default function Setup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ target: '', subdomains: '', portRange: '1-1024' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.target.trim()) {
      e.target = 'Domain or IP address is required'
    } else {
      const target = form.target.trim()
      // Check if it's a valid domain or IP
      const isDomain = /^[a-zA-Z0-9][a-zA-Z0-9\-_.]+\.[a-zA-Z]{2,}$/.test(target)
      const isIP = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(target)
      
      if (!isDomain && !isIP) {
        e.target = 'Enter a valid domain (e.g. example.com) or IP (e.g. 192.168.1.0/24)'
      }
    }
    return e
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    sessionStorage.setItem('ss-domain', form.target.trim())
    setTimeout(() => navigate('/dashboard'), 2200)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden text-white font-['General_Sans']">

      {/* 🔥 Animated Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative w-full max-w-lg">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        {/* 🧊 Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative rounded-2xl p-[1px] bg-gradient-to-b from-white/20 to-white/5"
        >
          <div className="relative rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-8">

            {/* Glow overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-40" />

            {/* Header */}
            <div className="relative flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-white">
                  Scan Your Infrastructure
                </h1>
                <p className="text-sm text-white/60">
                  Enter target details to begin intelligence fetch
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative">

              <Input
                label="Domain or IP *"
                placeholder="example.com or 192.168.1.0/24"
                prefix={<Globe className="w-4 h-4 text-white/60" />}
                value={form.target}
                onChange={e => {
                  setForm(f => ({ ...f, target: e.target.value }))
                  setErrors(v => ({ ...v, target: '' }))
                }}
                error={errors.target}
                hint="Enter domain, subdomain, or IP/CIDR to scan"
              />

              <Input
                label="Additional Subdomains"
                placeholder="api, admin, mail"
                value={form.subdomains}
                onChange={e => setForm(f => ({ ...f, subdomains: e.target.value }))}
                hint="Optional — auto-discovered if blank"
              />

              <Input
                label="Port Range"
                placeholder="1-1024"
                prefix={<Network className="w-4 h-4 text-white/60" />}
                value={form.portRange}
                onChange={e => setForm(f => ({ ...f, portRange: e.target.value }))}
              />

              {/* CTA */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="relative w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-black bg-white overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? 'Scanning...' : 'Fetch Intelligence'}
                    {!loading && <ChevronRight className="w-4 h-4" />}
                  </span>

                  {/* Shine */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 hover:opacity-100 blur-md transition" />
                </motion.button>
              </div>
            </form>

            {/* Loading Steps */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-3 border-t border-white/10 pt-5"
              >
                {SCAN_STEPS.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.3 }}
                    className="flex items-center gap-2 text-sm text-white/60"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    {step}
                  </motion.div>
                ))}
              </motion.div>
            )}

          </div>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/40 mt-6">
          Only scan infrastructure you own or have permission to test.
        </p>
      </div>
    </div>
  )
}