import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Globe, Server, Network, ArrowLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

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
  const [form, setForm] = useState({ domain: '', subdomains: '', ip: '', portRange: '1-1024' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.domain.trim()) {
      e.domain = 'Domain is required'
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9\-_.]+\.[a-zA-Z]{2,}$/.test(form.domain.trim())) {
      e.domain = 'Enter a valid domain (e.g. example.com)'
    }
    return e
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    sessionStorage.setItem('ss-domain', form.domain.trim())
    setTimeout(() => navigate('/dashboard'), 2200)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-700/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Scan Your Infrastructure</h1>
              <p className="text-sm text-gray-500">Enter target details to begin intelligence fetch</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Domain *"
              placeholder="example.com"
              prefix={<Globe className="w-4 h-4" />}
              value={form.domain}
              onChange={e => { setForm(f => ({ ...f, domain: e.target.value })); setErrors(v => ({ ...v, domain: '' })) }}
              error={errors.domain}
              hint="Primary domain to scan"
              autoFocus
            />
            <Input
              label="Subdomains"
              placeholder="api, admin, mail (comma separated)"
              value={form.subdomains}
              onChange={e => setForm(f => ({ ...f, subdomains: e.target.value }))}
              hint="Optional — auto-discovered if blank"
            />
            <Input
              label="IP Address / CIDR"
              placeholder="192.168.1.0/24"
              prefix={<Server className="w-4 h-4" />}
              value={form.ip}
              onChange={e => setForm(f => ({ ...f, ip: e.target.value }))}
              hint="Optional — for internal network scanning"
            />
            <Input
              label="Port Range"
              placeholder="1-1024"
              prefix={<Network className="w-4 h-4" />}
              value={form.portRange}
              onChange={e => setForm(f => ({ ...f, portRange: e.target.value }))}
              hint="Default: 1–1024 (all common ports)"
            />
            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                iconRight={!loading ? ChevronRight : undefined}
                className="w-full"
              >
                {loading ? 'Scanning infrastructure...' : 'Fetch Intelligence'}
              </Button>
            </div>
          </form>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 space-y-2.5 border-t border-gray-800 pt-5"
            >
              {SCAN_STEPS.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.38 }}
                  className="flex items-center gap-2.5 text-sm text-gray-500"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400 flex-shrink-0" />
                  {step}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        <p className="text-center text-xs text-gray-700 mt-5">
          By scanning you agree to our Terms of Service. Only scan infrastructure you own or have permission to test.
        </p>
      </div>
    </div>
  )
}
