import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Shield, Zap, Lock } from 'lucide-react'
import { ShinyText } from './ShinyText'
import { Button } from '../ui/Button'

const trust = [
  { icon: Shield, label: 'SOC 2 Certified' },
  { icon: Lock, label: 'End-to-End Encrypted' },
  { icon: Zap, label: 'Real-Time Scanning' },
]

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-700/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-cyan-700/8 rounded-full blur-3xl animate-blob animation-delay-4000" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Tag pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-950/80 border border-blue-800/50 rounded-full text-xs text-blue-400 font-medium mb-8"
        >
          <Zap className="w-3 h-3" />
          AI-Powered Security Intelligence
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
        >
          Protect Your
          <br />
          <ShinyText>Digital Assets.</ShinyText>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed"
        >
          Scan your infrastructure, discover vulnerabilities, and get actionable
          remediation steps — all powered by AI threat intelligence.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Button
            variant="primary"
            size="lg"
            iconRight={ArrowRight}
            onClick={() => navigate('/setup')}
          >
            Get Started Free
          </Button>
          <Button variant="outline" size="lg" icon={Play}>
            View Demo
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600"
        >
          {trust.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
