import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Shield, Zap, Lock, ChevronDown } from 'lucide-react'
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
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-black text-white font-['General_Sans']">

      {/* Background Video */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* ================= NAVBAR ================= */}
      <div className="relative z-10 flex items-center justify-between px-[120px] py-[20px]">
        
        <div className="flex items-center gap-[40px]">
          <div className="text-white text-[18px] font-medium">
            SecureSight
          </div>

          <div className="hidden md:flex items-center gap-[30px]">
            {['Home', 'Features', 'Pricing', 'Docs', 'Contact'].map((item) => (
              <div key={item} className="flex items-center gap-[14px] text-[14px] font-medium cursor-pointer">
                {item}
                <ChevronDown className="w-[14px] h-[14px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm text-white/80">Sign In</button>

          {/* Join Waitlist */}
          <div className="relative rounded-full border-[0.6px] border-white/80 p-[1px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[10px] bg-gradient-to-r from-white/80 to-transparent blur-md opacity-60" />
            <button className="relative rounded-full bg-black px-[20px] py-[8px] text-[14px] font-medium">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* ================= HERO CONTENT (FIXED CENTERING) ================= */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-8">

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-medium leading-[1.2] max-w-[700px]"
          >
            <span className="bg-[linear-gradient(144.5deg,_#ffffff_28%,_rgba(0,0,0,0)_115%)] bg-clip-text text-transparent">
              Protect Your Digital Assets.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[680px] text-[15px] text-white/70"
          >
            Scan your infrastructure, discover vulnerabilities, and get actionable
            remediation steps — all powered by AI threat intelligence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary */}
            <div className="relative rounded-full border-[0.6px] border-white/80 p-[1px]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[10px] bg-gradient-to-r from-white/80 to-transparent blur-md opacity-60" />
              
              <button
                onClick={() => navigate('/setup')}
                className="relative rounded-full bg-white text-black px-[29px] py-[11px] text-[14px] font-medium flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Secondary */}
           
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/50 pt-4"
          >
            {trust.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}