import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Server, Monitor, Cloud, Network, LayoutGrid, List } from 'lucide-react'
import { pageVariants, staggerContainer, staggerItem } from '../lib/motion'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { DataTable, Column } from '../components/ui/DataTable'
import { SearchInput } from '../components/ui/Input'
import { ASSETS } from '../data/mockData'
import { Asset, AssetType } from '../types'
import { getRiskColor, getRiskBgColor, getRelativeTime } from '../lib/utils'

const TYPE_FILTERS = ['All', 'Server', 'Endpoint', 'Cloud', 'Network'] as const

const statusVariant: Record<string, 'success' | 'medium' | 'critical' | 'neutral'> = {
  healthy: 'success',
  at_risk: 'medium',
  compromised: 'critical',
  offline: 'neutral',
}

const typeIcon: Record<AssetType, React.ElementType> = {
  server: Server,
  endpoint: Monitor,
  cloud: Cloud,
  network: Network,
}

export function AssetsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const filtered = useMemo(() => {
    return ASSETS.filter(a => {
      const matchSearch =
        search === '' ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.ipAddress.includes(search) ||
        a.hostname.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'All' || a.type === typeFilter.toLowerCase()
      const matchRisk =
        riskFilter === 'All' ||
        (riskFilter === 'High' && a.riskScore >= 70) ||
        (riskFilter === 'Medium' && a.riskScore >= 30 && a.riskScore < 70) ||
        (riskFilter === 'Low' && a.riskScore < 30)
      return matchSearch && matchType && matchRisk
    })
  }, [search, typeFilter, riskFilter])

  const columns: Column<Asset>[] = [
    {
      key: 'name',
      label: 'Asset Name',
      sortable: true,
      render: (a) => {
        const Icon = typeIcon[a.type]
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-ss-text-muted flex-shrink-0" />
            <span className="font-mono text-mono-sm text-ss-text-primary">{a.name}</span>
          </div>
        )
      },
    },
    {
      key: 'ipAddress',
      label: 'IP / Hostname',
      sortable: false,
      render: (a) => (
        <div>
          <p className="font-mono text-mono-sm text-ss-text-secondary">{a.ipAddress}</p>
          <p className="text-[11px] text-ss-text-muted">{a.hostname}</p>
        </div>
      ),
    },
    {
      key: 'os',
      label: 'OS',
      sortable: true,
      render: (a) => <span className="text-caption text-ss-text-secondary">{a.os}</span>,
    },
    {
      key: 'riskScore',
      label: 'Risk Score',
      sortable: true,
      width: 'w-36',
      render: (a) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-ss-bg-base rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${getRiskBgColor(a.riskScore)}`} style={{ width: `${a.riskScore}%` }} />
          </div>
          <span className={`text-caption font-medium w-7 text-right ${getRiskColor(a.riskScore)}`}>{a.riskScore}</span>
        </div>
      ),
    },
    {
      key: 'lastSeen',
      label: 'Last Seen',
      sortable: true,
      render: (a) => <span className="text-caption text-ss-text-muted">{getRelativeTime(a.lastSeen)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (a) => (
        <Badge variant={statusVariant[a.status] ?? 'neutral'} size="sm">
          {a.status.replace('_', ' ')}
        </Badge>
      ),
    },
  ]

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h1 font-medium text-ss-text-primary">Assets</h1>
          <p className="text-body text-ss-text-secondary mt-1">{filtered.length} assets</p>
        </div>
        <div className="flex gap-1 p-1 bg-ss-bg-surface border border-ss-border rounded-ss-md">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-ss-sm transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-ss-text-muted hover:text-ss-text-primary'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-ss-sm transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-ss-text-muted hover:text-ss-text-primary'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm" className="mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <div className="flex gap-1">
            {TYPE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-2.5 py-1 text-caption rounded-ss-sm transition-colors ${
                  typeFilter === f ? 'bg-blue-600 text-white' : 'text-ss-text-secondary hover:text-ss-text-primary hover:bg-ss-bg-elevated'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {['All', 'High', 'Medium', 'Low'].map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 text-caption rounded-ss-sm transition-colors ${
                  riskFilter === r ? 'bg-blue-600 text-white' : 'text-ss-text-secondary hover:text-ss-text-primary hover:bg-ss-bg-elevated'
                }`}
              >
                {r} Risk
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table / Grid */}
      {viewMode === 'table' ? (
        <Card padding="none">
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <DataTable<Asset>
              columns={columns}
              data={filtered}
              onRowClick={row => navigate(`/assets/${row.id}`)}
              emptyMessage="No assets match the current filters"
            />
          </motion.div>
        </Card>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-3 gap-4"
        >
          {filtered.map(asset => {
            const Icon = typeIcon[asset.type]
            return (
              <motion.div key={asset.id} variants={staggerItem}>
                <Card
                  hoverable
                  padding="md"
                  className="cursor-pointer"
                  onClick={() => navigate(`/assets/${asset.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-ss-bg-elevated border border-ss-border rounded-ss-md">
                      <Icon className="w-4 h-4 text-ss-text-muted" />
                    </div>
                    <Badge variant={statusVariant[asset.status] ?? 'neutral'} size="sm">
                      {asset.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="font-mono text-mono-sm text-ss-text-primary font-medium mb-1 truncate">{asset.name}</p>
                  <p className="text-caption text-ss-text-muted font-mono mb-3">{asset.ipAddress}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-ss-bg-base rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getRiskBgColor(asset.riskScore)}`} style={{ width: `${asset.riskScore}%` }} />
                    </div>
                    <span className={`text-caption font-medium ${getRiskColor(asset.riskScore)}`}>{asset.riskScore}</span>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
