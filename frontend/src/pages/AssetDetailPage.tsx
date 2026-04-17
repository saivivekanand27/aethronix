import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Server, Monitor, Cloud, Network, Tag, User } from 'lucide-react'
import { pageVariants, fadeUp, staggerContainer, staggerItem } from '../lib/motion'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ASSETS, ALERTS } from '../data/mockData'
import { getRiskColor, getRiskBgColor, formatDate, getRelativeTime } from '../lib/utils'
import { AssetType } from '../types'

const typeIcon: Record<AssetType, React.ElementType> = {
  server: Server,
  endpoint: Monitor,
  cloud: Cloud,
  network: Network,
}

const statusVariant: Record<string, 'success' | 'medium' | 'critical' | 'neutral'> = {
  healthy: 'success',
  at_risk: 'medium',
  compromised: 'critical',
  offline: 'neutral',
}

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const asset = ASSETS.find(a => a.id === id) ?? ASSETS[0]
  const Icon = typeIcon[asset.type]
  const relatedAlerts = ALERTS.filter(a => a.destinationIp === asset.ipAddress || a.sourceIp === asset.ipAddress).slice(0, 5)

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-[1400px] mx-auto"
    >
      <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/assets')} className="mb-5">
        Back to Assets
      </Button>

      {/* Hero */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6">
        <Card padding="md">
          <div className="flex items-start gap-5">
            <div className="p-3 bg-ss-bg-elevated border border-ss-border rounded-ss-lg flex-shrink-0">
              <Icon className="w-8 h-8 text-ss-text-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <Badge variant="neutral" size="sm">{asset.type}</Badge>
                <Badge variant={statusVariant[asset.status] ?? 'neutral'} size="sm" showDot={asset.status === 'at_risk' || asset.status === 'compromised'}>
                  {asset.status.replace('_', ' ')}
                </Badge>
              </div>
              <h1 className="text-h1 font-medium text-ss-text-primary font-mono">{asset.name}</h1>
              <div className="flex items-center gap-4 mt-1 text-caption text-ss-text-muted font-mono">
                <span>{asset.ipAddress}</span>
                <span>{asset.hostname}</span>
                <span>{asset.os}</span>
              </div>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className={`text-h1 font-medium ${getRiskColor(asset.riskScore)}`}>{asset.riskScore}</div>
              <p className="text-caption text-ss-text-muted">Risk Score</p>
              <div className="w-20 h-2 bg-ss-bg-base rounded-full overflow-hidden mt-1">
                <div className={`h-full rounded-full ${getRiskBgColor(asset.riskScore)}`} style={{ width: `${asset.riskScore}%` }} />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        {/* Details */}
        <div className="col-span-2 flex flex-col gap-4">
          <Card padding="md">
            <h2 className="text-h4 font-medium text-ss-text-primary mb-4">Asset Details</h2>
            <dl className="grid grid-cols-3 gap-x-6 gap-y-4">
              {[
                { label: 'Asset ID', value: asset.id },
                { label: 'Owner', value: asset.owner, icon: User },
                { label: 'Last Seen', value: getRelativeTime(asset.lastSeen) },
                { label: 'Full Timestamp', value: formatDate(asset.lastSeen) },
                { label: 'Operating System', value: asset.os },
                { label: 'Hostname', value: asset.hostname },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-[11px] text-ss-text-muted mb-0.5">{label}</dt>
                  <dd className="text-caption text-ss-text-secondary font-mono">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {/* Related alerts */}
          <Card padding="none">
            <div className="px-5 py-3 border-b border-ss-border">
              <h2 className="text-h4 font-medium text-ss-text-primary">Related Alerts</h2>
            </div>
            {relatedAlerts.length === 0 ? (
              <div className="py-12 text-center text-ss-text-muted text-caption">No related alerts found</div>
            ) : (
              <motion.div variants={staggerContainer} initial="initial" animate="animate">
                {relatedAlerts.map(alert => (
                  <motion.div
                    key={alert.id}
                    variants={staggerItem}
                    onClick={() => navigate(`/alerts/${alert.id}`)}
                    className="flex items-center gap-3 px-5 py-3 border-b border-ss-border-muted hover:bg-ss-bg-elevated transition-colors cursor-pointer last:border-0"
                  >
                    <span className="font-mono text-mono-sm text-ss-text-muted">{alert.id}</span>
                    <span className="text-body text-ss-text-primary flex-1">{alert.name}</span>
                    <span className="text-caption text-ss-text-muted">{getRelativeTime(alert.timestamp)}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Card>
        </div>

        {/* Tags + meta */}
        <div className="flex flex-col gap-4">
          <Card padding="md">
            <h2 className="text-h4 font-medium text-ss-text-primary mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-ss-text-muted" /> Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {asset.tags.map(tag => (
                <span key={tag} className="text-caption px-2 py-1 bg-ss-bg-elevated border border-ss-border rounded-ss-sm text-ss-text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
          <Card padding="md">
            <h2 className="text-h4 font-medium text-ss-text-primary mb-3">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="w-full justify-center">Run Vulnerability Scan</Button>
              <Button variant="secondary" size="sm" className="w-full justify-center">Isolate from Network</Button>
              <Button variant="danger" size="sm" className="w-full justify-center">Flag as Compromised</Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
