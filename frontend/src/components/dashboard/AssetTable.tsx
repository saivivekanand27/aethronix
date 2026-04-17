import { motion } from 'framer-motion'
import { Server, Globe, Database, Monitor } from 'lucide-react'
import { Asset } from '../../data/mockData'
import { RiskBadge } from './RiskBadge'
import { cn } from '../../lib/utils'

const typeIcon: Record<string, React.ElementType> = {
  Server: Server,
  API: Globe,
  Database: Database,
  Endpoint: Monitor,
}

const statusStyle: Record<string, string> = {
  Online:  'text-green-400',
  Warning: 'text-amber-400',
  Offline: 'text-red-400',
}

const statusDot: Record<string, string> = {
  Online:  'bg-green-400',
  Warning: 'bg-amber-400',
  Offline: 'bg-red-400',
}

export function AssetTable({ assets }: { assets: Asset[] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="font-semibold text-white">Assets</h2>
        <p className="text-sm text-gray-500 mt-0.5">{assets.length} discovered assets</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {['Asset', 'Type', 'Status', 'Risk'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => {
              const Icon = typeIcon[asset.type] ?? Server
              return (
                <motion.tr
                  key={asset.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors last:border-0"
                >
                  <td className="px-6 py-3.5">
                    <p className="text-sm font-medium text-white font-mono">{asset.name}</p>
                    <p className="text-xs text-gray-600 font-mono mt-0.5">{asset.ip}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-sm text-gray-400">{asset.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className={cn('flex items-center gap-1.5 text-sm font-medium', statusStyle[asset.status])}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', statusDot[asset.status])} />
                      {asset.status}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <RiskBadge risk={asset.risk} />
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
