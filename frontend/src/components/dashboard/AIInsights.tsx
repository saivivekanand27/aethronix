import { motion } from 'framer-motion'
import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AIInsight } from '../../data/mockData'
import { cn } from '../../lib/utils'

const severity = {
  high:   { icon: AlertTriangle, bg: 'bg-red-950/40 border-red-900/50',  icon_c: 'text-red-400',   label: 'High',   label_c: 'text-red-400 bg-red-950 border-red-900' },
  medium: { icon: AlertCircle,   bg: 'bg-amber-950/40 border-amber-900/50', icon_c: 'text-amber-400', label: 'Medium', label_c: 'text-amber-400 bg-amber-950 border-amber-900' },
  low:    { icon: Info,          bg: 'bg-blue-950/40 border-blue-900/50',  icon_c: 'text-blue-400',  label: 'Low',    label_c: 'text-blue-400 bg-blue-950 border-blue-900' },
}

const actionItems = [
  { done: false, text: 'Close unused ports (22, 21, 3306) from public access' },
  { done: false, text: 'Enable and configure firewall on all servers' },
  { done: true,  text: 'HTTPS enabled on port 443' },
  { done: false, text: 'Update all service versions and apply patches' },
  { done: false, text: 'Restrict admin panel to internal IPs only' },
]

export function AIInsights({ insights }: { insights: AIInsight[] }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Insight cards */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2.5">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <h2 className="font-semibold text-white">AI Security Insights</h2>
          <span className="ml-auto text-xs text-gray-600">{insights.length} findings</span>
        </div>
        <div className="divide-y divide-gray-800">
          {insights.map((insight, i) => {
            const cfg = severity[insight.severity]
            const Icon = cfg.icon
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="p-5 hover:bg-gray-800/20 transition-colors"
              >
                <div className={cn('rounded-xl border p-4', cfg.bg)}>
                  <div className="flex items-start gap-3">
                    <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', cfg.icon_c)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <p className="text-sm font-semibold text-white">{insight.title}</p>
                        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', cfg.label_c)}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-2">{insight.description}</p>
                      <p className="text-xs text-gray-600">
                        <span className="text-gray-500 font-medium">Fix: </span>
                        {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Plain language explanation */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-white mb-1">What This Means</h2>
        <p className="text-sm text-gray-500 mb-4">Simple, jargon-free explanation</p>
        <p className="text-sm text-gray-400 leading-relaxed">
          Your infrastructure has{' '}
          <span className="text-white font-medium">several open doors</span> that attackers could
          use to gain unauthorized access. The most critical issue is your database being accessible
          from the internet — this is like leaving your filing cabinet unlocked on a public street.
          Additionally, the development server running publicly means anyone can see work-in-progress
          code and potentially exploit early vulnerabilities.
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-white mb-5">Actionable Checklist</h2>
        <ul className="space-y-3">
          {actionItems.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  item.done ? 'bg-green-600 border-green-600' : 'border-gray-700'
                )}
              >
                {item.done && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={cn('text-sm', item.done ? 'text-gray-600 line-through' : 'text-gray-300')}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate('/fix-guide')}
          className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          View Fix & Recovery Guide
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
