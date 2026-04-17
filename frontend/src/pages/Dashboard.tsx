import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Server, AlertTriangle, AlertOctagon, Activity, RefreshCw } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { StatsCard } from '../components/dashboard/StatsCard'
import { AssetTable } from '../components/dashboard/AssetTable'
import { RiskDistributionChart, AssetsVsVulnsChart } from '../components/dashboard/Charts'
import { AIInsights } from '../components/dashboard/AIInsights'
import { ScanData } from '../data/mockData'
import { cn } from '../lib/utils'
import { runSecurityAudit } from '../services/api'

const portRisk: Record<string, string> = {
  high:   'text-red-400 border border-red-500/20 bg-red-500/5',
  medium: 'text-amber-400 border border-amber-500/20 bg-amber-500/5',
  low:    'text-green-400 border border-green-500/20 bg-green-500/5',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState<ScanData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const domain = sessionStorage.getItem('ss-domain') || 'example.com'
    
    const fetchAudit = async () => {
      try {
        setLoading(true)
        setError(null)
        const auditData = await runSecurityAudit(domain)
        
        // Transform API response to ScanData format
        const scanData: ScanData = {
          domain: auditData.domain,
          scannedAt: new Date(),
          totalAssets: auditData.audit_results.length || 0,
          vulnerabilities: 0,
          highRisk: 0,
          riskScore: 65,
          assets: auditData.audit_results.map((result: any, idx: number) => ({
            id: `${idx}`,
            name: result.subdomain,
            type: 'Server' as const,
            status: 'Online' as const,
            risk: 'Medium' as const,
            ip: result.ip || '0.0.0.0'
          })),
          exposedPorts: auditData.audit_results.flatMap((result: any) => 
            (result.shodan_data?.ports || []).map((port: number, idx: number) => ({
              port,
              service: result.shodan_data?.services?.[idx] || 'Unknown',
              risk: 'medium' as const,
              description: 'Detected by Shodan scan'
            }))
          ),
          riskDistribution: [
            { name: 'High', value: 30, color: '#ef4444' },
            { name: 'Medium', value: 45, color: '#f59e0b' },
            { name: 'Low', value: 25, color: '#10b981' }
          ],
          assetsVsVulns: [
            { category: 'Scanned', assets: auditData.audit_results.length || 0, vulns: 0 }
          ],
          aiInsights: auditData.intelligence ? [
            {
              id: '1',
              title: 'Security Assessment Summary',
              severity: auditData.intelligence.risk_score >= 70 ? 'high' : auditData.intelligence.risk_score >= 40 ? 'medium' : 'low',
              description: auditData.intelligence.security_summary,
              recommendation: auditData.intelligence.actionable_fixes?.[0] || 'Review security configuration'
            },
            ...((auditData.intelligence.actionable_fixes || []).slice(1).map((fix: string, idx: number) => ({
              id: `${idx + 2}`,
              title: `Action Item ${idx + 1}`,
              severity: 'medium' as const,
              description: fix,
              recommendation: 'Implement this security fix'
            })))
          ] : []
        }
        
        setData(scanData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audit data'
        setError(errorMessage)
        console.error('Audit error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAudit()
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Navbar />
        <div className="text-center pt-16">
          {error ? (
            <>
              <p className="text-red-400 text-sm mb-4">⚠️ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-sm">Loading scan results...</p>
            </>
          )}
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

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setData(null)
                  setError(null)
                  setLoading(true)
                  const domain = sessionStorage.getItem('ss-domain') || 'example.com'
                  runSecurityAudit(domain)
                    .then(auditData => {
                      const scanData: ScanData = {
                        domain: auditData.domain,
                        scannedAt: new Date(),
                        totalAssets: auditData.audit_results.length || 0,
                        vulnerabilities: 0,
                        highRisk: 0,
                        riskScore: 65,
                        assets: auditData.audit_results.map((result: any, idx: number) => ({
                          id: `${idx}`,
                          name: result.subdomain,
                          type: 'Server' as const,
                          status: 'Online' as const,
                          risk: 'Medium' as const,
                          ip: result.ip || '0.0.0.0'
                        })),
                        exposedPorts: auditData.audit_results.flatMap((result: any) => 
                          (result.shodan_data?.ports || []).map((port: number, idx: number) => ({
                            port,
                            service: result.shodan_data?.services?.[idx] || 'Unknown',
                            risk: 'medium' as const,
                            description: 'Detected by Shodan scan'
                          }))
                        ),
                        riskDistribution: [
                          { name: 'High', value: 30, color: '#ef4444' },
                          { name: 'Medium', value: 45, color: '#f59e0b' },
                          { name: 'Low', value: 25, color: '#10b981' }
                        ],
                        assetsVsVulns: [
                          { category: 'Scanned', assets: auditData.audit_results.length || 0, vulns: 0 }
                        ],
                        aiInsights: auditData.intelligence ? [
                          {
                            id: '1',
                            title: 'Security Assessment Summary',
                            severity: auditData.intelligence.risk_score >= 70 ? 'high' : auditData.intelligence.risk_score >= 40 ? 'medium' : 'low',
                            description: auditData.intelligence.security_summary,
                            recommendation: auditData.intelligence.actionable_fixes?.[0] || 'Review security configuration'
                          },
                          ...((auditData.intelligence.actionable_fixes || []).slice(1).map((fix: string, idx: number) => ({
                            id: `${idx + 2}`,
                            title: `Action Item ${idx + 1}`,
                            severity: 'medium' as const,
                            description: fix,
                            recommendation: 'Implement this security fix'
                          })))
                        ] : []
                      }
                      setData(scanData)
                    })
                    .catch((err: any) => {
                      setError(err.message || 'Failed to refresh scan')
                    })
                    .finally(() => setLoading(false))
                }}
                className="px-5 py-2 rounded-full border border-white/20 text-sm text-white/70 hover:text-white disabled:opacity-50"
                disabled={loading}
              >
                <RefreshCw className={cn("inline w-4 h-4 mr-1", loading && "animate-spin")} />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/setup')}
                className="px-5 py-2 rounded-full border border-white/20 text-sm text-white/70 hover:text-white"
              >
                New Scan
              </motion.button>
            </div>
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