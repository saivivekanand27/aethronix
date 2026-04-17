import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Shield, Terminal, ChevronDown, ChevronUp,
  Lock, Server, Wifi, Eye, Copy
} from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { cn } from '../lib/utils'

/* ---------------- TYPES ---------------- */

interface Step {
  id: string
  title: string
  icon: React.ElementType
  severity: 'high' | 'medium' | 'low'
  summary: string
  steps: string[]
  code?: { label: string; content: string }
}

/* ---------------- DATA ---------------- */

const GUIDE: Step[] = [
  {
    id: '1',
    title: 'Close Exposed Ports',
    icon: Shield,
    severity: 'high',
    summary: 'Restrict unnecessary open ports.',
    steps: [
      'List services: sudo netstat -tuln',
      'Disable unused services',
      'Restrict access via firewall',
      'Block DB ports from internet',
    ],
    code: {
      label: 'Firewall Commands',
      content: `sudo ufw deny 21
sudo ufw deny 3306
sudo ufw deny 8080
sudo ufw reload`,
    },
  },
  {
    id: '2',
    title: 'Secure SSH Access',
    icon: Lock,
    severity: 'high',
    summary: 'Harden SSH against attacks.',
    steps: [
      'Disable password login',
      'Use SSH keys',
      'Change default port',
      'Disable root login',
    ],
  },
  {
    id: '3',
    title: 'Update Services',
    icon: Server,
    severity: 'medium',
    summary: 'Patch vulnerabilities.',
    steps: [
      'Run updates',
      'Upgrade server',
      'Patch DB',
    ],
  },
  {
    id: '4',
    title: 'Enable Firewall',
    icon: Wifi,
    severity: 'high',
    summary: 'First line of defense.',
    steps: [
      'Enable firewall',
      'Deny incoming',
      'Allow only required ports',
    ],
  },
  {
    id: '5',
    title: 'Protect Admin Panels',
    icon: Eye,
    severity: 'high',
    summary: 'Secure admin access.',
    steps: [
      'Move /admin path',
      'Enable MFA',
      'Use VPN',
      'Restrict by IP',
    ],
  },
]

/* ---------------- STYLES ---------------- */

const severityDot = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-green-400',
}

const cardGlow =
  'from-blue-500/20 via-purple-500/10 to-cyan-500/20'

/* ---------------- CARD ---------------- */

function GuideCard({
  step,
  index,
  active,
  setActive,
}: {
  step: Step
  index: number
  active: number | null
  setActive: (i: number | null) => void
}) {
  const open = active === index
  const Icon = step.icon

  const copyCode = () => {
    if (step.code) {
      navigator.clipboard.writeText(step.code.content)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        'rounded-2xl p-[1px] bg-gradient-to-r',
        cardGlow
      )}
    >
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition">

        {/* HEADER */}
        <button
          onClick={() => setActive(open ? null : index)}
          className="w-full flex items-center gap-4 p-6 text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/80" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg text-white">
                {step.title}
              </h3>

              <span className="flex items-center gap-2 text-xs font-medium">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    severityDot[step.severity]
                  )}
                />
                <span
                  className={cn(
                    step.severity === 'high' && 'text-red-400',
                    step.severity === 'medium' &&
                      'text-amber-400',
                    step.severity === 'low' &&
                      'text-green-400'
                  )}
                >
                  {step.severity.toUpperCase()}
                </span>
              </span>
            </div>

            <p className="text-sm text-white/50 mt-1">
              {step.summary}
            </p>
          </div>

          {open ? (
            <ChevronUp className="text-white/40" />
          ) : (
            <ChevronDown className="text-white/40" />
          )}
        </button>

        {/* BODY */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-6 space-y-6">

                {/* Steps */}
                <ul className="space-y-3">
                  {step.steps.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 text-sm text-white/70"
                    >
                      <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">
                        {i + 1}
                      </div>
                      {s}
                    </motion.li>
                  ))}
                </ul>

                {/* Code */}
                {step.code && (
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-black/80">

                    <div className="flex justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                      <span className="text-xs text-white/50 font-mono">
                        {step.code.label}
                      </span>

                      <button
                        onClick={copyCode}
                        className="text-xs flex items-center gap-1 text-white/50 hover:text-white"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>

                    <pre className="p-4 text-green-400 text-xs font-mono overflow-x-auto">
                      {step.code.content}
                    </pre>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

/* ---------------- MAIN ---------------- */

export default function FixGuide() {
  const navigate = useNavigate()
  const [active, setActive] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-black text-white font-['General_Sans']">

      <Navbar />

      {/* Background glow (match hero) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-blue-600/10 blur-3xl rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-[350px] h-[350px] bg-purple-600/10 blur-3xl rounded-full" />
      </div>

      <div className="pt-20 relative z-10 max-w-5xl mx-auto px-6 space-y-10">

        {/* Header */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div>
          <h1 className="text-3xl font-medium bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
            Fix & Recovery Guide
          </h1>
          <p className="text-white/50 text-sm mt-2">
            Step-by-step remediation for vulnerabilities
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {GUIDE.map((step, i) => (
            <GuideCard
              key={step.id}
              step={step}
              index={i}
              active={active}
              setActive={setActive}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-10">
          <button
            onClick={() => navigate('/setup')}
            className="px-8 py-3 rounded-full bg-white text-black hover:scale-105 transition"
          >
            Scan Again
          </button>
        </div>

      </div>
    </div>
  )
}