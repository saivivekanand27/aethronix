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
  high:   'text-red-400 border border-red-500/20 bg-red-500/5',
  medium: 'text-amber-400 border border-amber-500/20 bg-amber-500/5',
  low:    'text-green-400 border border-green-500/20 bg-green-500/5',
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
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Navbar />
        <div className="text-center pt-16">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading scan results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-['General_Sans'] overflow-hidden">
      <Navbar />

      {/* 🔥 SAME HERO-STYLE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-700/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="pt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-12">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-start"
          >
            <div>
              <p className="text-sm text-white/50 mb-1">Scan results for</p>

              <h1 className="text-4xl font-medium leading-tight">
                <span className="bg-[linear-gradient(144.5deg,_#ffffff,_rgba(255,255,255,0.4))] bg-clip-text text-transparent">
                  {data.domain}
                </span>
              </h1>

              <p className="text-sm text-white/50 mt-2">
                {data.totalAssets} assets · {data.scannedAt.toLocaleString()}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/setup')}
              className="px-5 py-2 rounded-full border border-white/20 text-sm text-white/70 hover:text-white"
            >
              <RefreshCw className="inline w-4 h-4 mr-1" />
              New Scan
            </motion.button>
          </motion.div>

          {/* STATS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Assets" value={data.totalAssets} icon={Server} accentColor="blue" />
            <StatsCard title="Vulnerabilities" value={data.vulnerabilities} icon={AlertTriangle} accentColor="amber" />
            <StatsCard title="High Risk" value={data.highRisk} icon={AlertOctagon} accentColor="red" />
            <StatsCard title="Risk Score" value={`${data.riskScore}/100`} icon={Activity} accentColor="green" />
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-8">

              {/* TABLE */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
                <AssetTable assets={data.assets} />
              </div>

              {/* PORTS */}
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-medium text-white">Exposed Ports</h2>
                  <p className="text-sm text-white/50">{data.exposedPorts.length} ports detected</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {data.exposedPorts.map(p => (
                    <span key={p.port} className={cn(
                      'px-3 py-1 rounded-md text-sm font-mono',
                      portRisk[p.risk]
                    )}>
                      {p.port}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-8">

              <div className="border border-white/10 rounded-xl p-4 bg-black/40">
                <RiskDistributionChart data={data.riskDistribution} />
              </div>

              <div className="border border-white/10 rounded-xl p-4 bg-black/40">
                <AssetsVsVulnsChart data={data.assetsVsVulns} />
              </div>

              {/* SCORE */}
              <div className="space-y-3">
                <h3 className="text-sm text-white/50">Risk Score</h3>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.riskScore}%` }}
                    className={cn(
                      'h-full',
                      data.riskScore >= 70 ? 'bg-red-500' :
                      data.riskScore >= 40 ? 'bg-amber-500' :
                      'bg-green-500'
                    )}
                  />
                </div>

                <p className="text-white/70 text-sm">{data.riskScore}/100</p>
              </div>

            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium">
              <span className="bg-[linear-gradient(144.5deg,_#ffffff,_rgba(255,255,255,0.4))] bg-clip-text text-transparent">
                AI Security Analysis
              </span>
            </h2>

            <div className="border border-white/10 rounded-xl p-6 bg-black/40">
              <AIInsights insights={data.aiInsights} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}