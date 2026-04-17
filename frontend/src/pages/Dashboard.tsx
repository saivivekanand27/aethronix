import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Server, AlertTriangle, AlertOctagon, Activity, RefreshCw } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { StatsCard } from '../components/dashboard/StatsCard'
import { AssetTable } from '../components/dashboard/AssetTable'
import { RiskDistributionChart, AssetsVsVulnsChart } from '../components/dashboard/Charts'
import { AIInsights } from '../components/dashboard/AIInsights'
import { generateScanData, ScanData } from '../data/mockData'
import { cn } from '../lib/utils'

const portRisk: Record<string, string> = {
  high:   'bg-red-950 text-red-400 border border-red-900',
  medium: 'bg-amber-950 text-amber-400 border border-amber-900',
  low:    'bg-green-950 text-green-400 border border-green-900',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState<ScanData | null>(null)

  useEffect(() => {
    const domain = sessionStorage.getItem('ss-domain') || 'example.com'
    const timer = setTimeout(() => setData(generateScanData(domain)), 400)
    return () => clearTimeout(timer)
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-16">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading scan results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <p className="text-sm text-gray-600 mb-1">Scan results for</p>
              <h1 className="text-3xl font-bold text-white">{data.domain}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Scanned {data.scannedAt.toLocaleString()} · {data.totalAssets} assets discovered
              </p>
            </div>
            <button
              onClick={() => navigate('/setup')}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> New Scan
            </button>
          </motion.div>

          {/* Stats grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Assets"      value={data.totalAssets}  icon={Server}       accentColor="blue"  delta="+3 new"            deltaDirection="up" />
            <StatsCard title="Vulnerabilities"   value={data.vulnerabilities} icon={AlertTriangle} accentColor="amber" subtitle="Across all assets" />
            <StatsCard title="High Risk Issues"  value={data.highRisk}     icon={AlertOctagon} accentColor="red"   delta="Needs attention"   deltaDirection="up" />
            <StatsCard
              title="Risk Score"
              value={`${data.riskScore}/100`}
              icon={Activity}
              accentColor={data.riskScore >= 70 ? 'red' : data.riskScore >= 40 ? 'amber' : 'green'}
              subtitle={data.riskScore >= 70 ? 'Critical risk' : data.riskScore >= 40 ? 'Moderate risk' : 'Low risk'}
            />
          </div>

          {/* Main 3-col grid */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left — 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <AssetTable assets={data.assets} />
              </motion.div>

              {/* Exposed Ports */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="font-semibold text-white">Exposed Ports</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{data.exposedPorts.length} open ports detected</p>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Port badges */}
                    <div className="flex flex-wrap gap-2">
                      {data.exposedPorts.map(p => (
                        <span
                          key={p.port}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-medium',
                            portRisk[p.risk]
                          )}
                        >
                          <span className="font-bold">{p.port}</span>
                          <span className="opacity-50">({p.service})</span>
                        </span>
                      ))}
                    </div>

                    {/* Ports summary card */}
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                      <h3 className="font-semibold text-white mb-2">Ports Summary</h3>
                      <p className="text-sm text-gray-400 leading-relaxed mb-5">
                        These ports are open and accessible from the internet. Open ports allow
                        external systems to communicate with your server. If not properly secured,
                        they can be used as entry points for attackers.
                      </p>
                      <div className="space-y-2.5">
                        {data.exposedPorts.slice(0, 5).map(p => (
                          <div key={p.port} className="flex items-start gap-3 text-sm">
                            <span className={cn(
                              'font-mono font-bold w-16 flex-shrink-0 mt-0.5',
                              p.risk === 'high' ? 'text-red-400' : p.risk === 'medium' ? 'text-amber-400' : 'text-green-400'
                            )}>
                              :{p.port}
                            </span>
                            <span className="text-gray-500 w-20 flex-shrink-0">{p.service}</span>
                            <span className="text-gray-600 text-xs leading-relaxed">{p.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — charts */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <RiskDistributionChart data={data.riskDistribution} />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <AssetsVsVulnsChart data={data.assetsVsVulns} />
              </motion.div>

              {/* Risk scorecard */}
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-4">Overall Risk Score</h3>
                  <div className="relative h-2.5 bg-gray-800 rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.riskScore}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                      className={cn(
                        'absolute top-0 left-0 h-full rounded-full',
                        data.riskScore >= 70 ? 'bg-red-500' : data.riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm text-gray-500">Score</span>
                    <span className={cn(
                      'text-2xl font-bold',
                      data.riskScore >= 70 ? 'text-red-400' : data.riskScore >= 40 ? 'text-amber-400' : 'text-green-400'
                    )}>
                      {data.riskScore}<span className="text-sm text-gray-600">/100</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Critical', count: data.highRisk, color: 'text-red-400' },
                      { label: 'Medium',   count: data.vulnerabilities - data.highRisk, color: 'text-amber-400' },
                      { label: 'Secure',   count: data.totalAssets - data.vulnerabilities, color: 'text-green-400' },
                    ].map(item => (
                      <div key={item.label} className="bg-gray-800 rounded-lg p-3">
                        <p className={cn('text-xl font-bold', item.color)}>{item.count}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* AI Insights — full width */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white">AI Security Analysis</h2>
              <p className="text-sm text-gray-500 mt-0.5">Automated threat assessment and guided remediation</p>
            </div>
            <AIInsights insights={data.aiInsights} />
          </motion.div>

        </div>
      </div>
    </div>
  )
}
