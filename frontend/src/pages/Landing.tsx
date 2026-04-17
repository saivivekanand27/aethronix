import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Activity, Lock, Globe, Eye } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { HeroSection } from '../components/hero/HeroSection'

const FEATURES = [
  { icon: Shield,   title: 'Threat Detection',       desc: 'AI-powered scanning identifies vulnerabilities across your entire external attack surface.' },
  { icon: Zap,      title: 'Real-Time Intelligence',  desc: 'Continuous monitoring with instant alerts when new threats are detected in your environment.' },
  { icon: Activity, title: 'Risk Scoring',            desc: 'Prioritize remediation with intelligent risk scoring based on exploitability and impact.' },
  { icon: Lock,     title: 'Compliance Ready',        desc: 'SOC 2, ISO 27001, and GDPR compliance reporting and evidence collection built in.' },
  { icon: Globe,    title: 'Attack Surface Mapping',  desc: 'Map all public-facing assets, discover shadow IT, and track changes over time.' },
  { icon: Eye,      title: 'Dark Web Monitoring',     desc: 'Monitor breach databases for leaked credentials and sensitive data from your organization.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Features */}
      <section id="features" className="border-t border-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm text-blue-400 font-medium mb-3">Features</p>
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need to stay secure</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              SecureSight combines AI threat intelligence with automated scanning for complete visibility.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-950 border border-blue-900 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="border-t border-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Start protecting your assets today</h2>
            <p className="text-gray-500 mb-8 text-lg">No credit card required. Scan your first domain in seconds.</p>
            <button
              onClick={() => navigate('/setup')}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-base"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">SecureSight</span>
          </div>
          <p className="text-sm text-gray-700">© 2026 SecureSight Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
