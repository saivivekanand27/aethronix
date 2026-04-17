import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Activity, Lock, Globe, Eye } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { HeroSection } from '../components/hero/HeroSection'

const FEATURES = [
  { icon: Shield, title: 'Threat Detection', desc: 'AI-powered scanning identifies vulnerabilities across your entire external attack surface.' },
  { icon: Zap, title: 'Real-Time Intelligence', desc: 'Continuous monitoring with instant alerts when new threats are detected in your environment.' },
  { icon: Activity, title: 'Risk Scoring', desc: 'Prioritize remediation with intelligent risk scoring based on exploitability and impact.' },
  { icon: Lock, title: 'Compliance Ready', desc: 'SOC 2, ISO 27001, and GDPR compliance reporting and evidence collection built in.' },
  { icon: Globe, title: 'Attack Surface Mapping', desc: 'Map all public-facing assets, discover shadow IT, and track changes over time.' },
  { icon: Eye, title: 'Dark Web Monitoring', desc: 'Monitor breach databases for leaked credentials and sensitive data from your organization.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen text-white font-['General_Sans'] overflow-hidden">
      
      <Navbar />
      <HeroSection />

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-32 relative overflow-hidden">

        {/* Animated Glow Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Heading */}
          <div className="text-center mb-20">
            
            <h2 className="text-4xl md:text-5xl font-medium mb-6">
              <span className="bg-[linear-gradient(120deg,_#ffffff,_#a5b4fc,_#ffffff)] bg-clip-text text-transparent">
                Everything you need to stay secure
              </span>
            </h2>

            <p className="text-white/60 max-w-xl mx-auto text-lg">
              SecureSight combines AI threat intelligence with automated scanning
              for complete visibility.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/20 to-white/5"
                >
                  <div className="relative rounded-2xl bg-black/60 backdrop-blur-xl p-6 border border-white/10 group-hover:border-white/20 transition">

                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent" />

                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-white/10">
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <h3 className="text-lg font-medium mb-2 text-white">
                        {f.title}
                      </h3>

                      <p className="text-sm text-white/60 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-32 relative overflow-hidden">

        {/* Glow Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-3xl rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-medium mb-6">
              <span className="bg-[linear-gradient(120deg,_#ffffff,_#93c5fd,_#ffffff)] bg-clip-text text-transparent">
                Start protecting your assets today
              </span>
            </h2>

            <p className="text-white/60 mb-10 text-lg">
              No credit card required. Scan your first domain in seconds.
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/setup')}
              className="relative inline-flex items-center gap-2 px-10 py-4 rounded-full text-sm font-medium text-black bg-white overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </span>

              {/* Shine */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 hover:opacity-100 blur-md transition" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 relative">

        <div className="absolute top-0 left-0 w-full h-px bg-white/10" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/10 border border-white/20 rounded-md flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-white">SecureSight</span>
          </div>

          <p className="text-sm text-white/40">
            © 2026 SecureSight Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}