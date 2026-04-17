import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Shield, ExternalLink } from 'lucide-react'
import { pageVariants, staggerContainer, staggerItem, cardHover } from '../lib/motion'
import { Card } from '../components/ui/Card'
import { Badge, SeverityBadge } from '../components/ui/Badge'
import { SlidePanel } from '../components/ui/SlidePanel'
import { THREATS } from '../data/mockData'
import { Threat } from '../types'
import { formatDateOnly } from '../lib/utils'

const FILTER_PILLS = ['All', 'APT Groups', 'Malware', 'CVEs', 'IOCs', 'Ransomware'] as const
type FilterPill = typeof FILTER_PILLS[number]

const pillToType: Record<FilterPill, string | null> = {
  'All': null,
  'APT Groups': 'apt',
  'Malware': 'malware',
  'CVEs': 'cve',
  'IOCs': 'ioc',
  'Ransomware': 'ransomware',
}

const typeLabel: Record<string, string> = {
  apt: 'APT Group',
  malware: 'Malware',
  cve: 'CVE',
  ioc: 'IOC',
  ransomware: 'Ransomware',
}

const typeBadge: Record<string, 'critical' | 'high' | 'medium' | 'info' | 'neutral'> = {
  apt: 'critical',
  malware: 'high',
  cve: 'medium',
  ioc: 'info',
  ransomware: 'critical',
}

export function ThreatIntelPage() {
  const [activeFilter, setActiveFilter] = useState<FilterPill>('All')
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null)

  const filtered = THREATS.filter(t => {
    const type = pillToType[activeFilter]
    return type === null || t.type === type
  })

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-h1 font-medium text-ss-text-primary">Threat Intelligence Feed</h1>
          <p className="text-body text-ss-text-secondary mt-1 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Last updated {new Date().toLocaleTimeString()} · {filtered.length} threats
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTER_PILLS.map(pill => (
          <button
            key={pill}
            onClick={() => setActiveFilter(pill)}
            className={`px-3.5 py-1.5 text-caption rounded-full border transition-colors ${
              activeFilter === pill
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-ss-bg-surface border-ss-border text-ss-text-secondary hover:border-blue-500/40 hover:text-ss-text-primary'
            }`}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-3 gap-4"
      >
        {filtered.map(threat => (
          <motion.div
            key={threat.id}
            variants={staggerItem}
            {...cardHover}
            onClick={() => setSelectedThreat(threat)}
            className="cursor-pointer"
          >
            <Card hoverable padding="md" className="h-full flex flex-col gap-3">
              {/* Type + severity */}
              <div className="flex items-center justify-between">
                <Badge variant={typeBadge[threat.type] ?? 'neutral'} size="sm">
                  {typeLabel[threat.type] ?? threat.type}
                </Badge>
                <SeverityBadge severity={threat.severity} size="sm" />
              </div>

              {/* Name */}
              <h3 className="text-h4 font-medium text-ss-text-primary leading-snug">{threat.name}</h3>

              {/* Description */}
              <p className="text-caption text-ss-text-secondary line-clamp-2 flex-1">
                {threat.description}
              </p>

              {/* Sectors */}
              <div className="flex flex-wrap gap-1.5">
                {threat.affectedSectors.map(s => (
                  <span key={s} className="text-[11px] px-1.5 py-0.5 bg-ss-bg-elevated border border-ss-border rounded-ss-sm text-ss-text-muted">
                    {s}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-ss-border-muted">
                <span className="text-[11px] text-ss-text-muted">{threat.source}</span>
                <span className="text-[11px] text-ss-text-muted">{formatDateOnly(threat.publishedAt)}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Slide panel */}
      <SlidePanel
        isOpen={selectedThreat !== null}
        onClose={() => setSelectedThreat(null)}
        title={selectedThreat?.name ?? ''}
        width="lg"
      >
        {selectedThreat && (
          <div className="flex flex-col gap-5">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={typeBadge[selectedThreat.type] ?? 'neutral'}>
                {typeLabel[selectedThreat.type]}
              </Badge>
              <SeverityBadge severity={selectedThreat.severity} />
              <span className="text-caption text-ss-text-muted ml-auto">
                Published {formatDateOnly(selectedThreat.publishedAt)} · {selectedThreat.source}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-h4 font-medium text-ss-text-primary mb-2">Description</h3>
              <p className="text-body text-ss-text-secondary leading-relaxed">{selectedThreat.description}</p>
            </div>

            {/* TTPs */}
            <div>
              <h3 className="text-h4 font-medium text-ss-text-primary mb-2">Tactics, Techniques & Procedures</h3>
              <ul className="flex flex-col gap-1.5">
                {selectedThreat.ttps.map(ttp => (
                  <li key={ttp} className="flex items-start gap-2 text-body text-ss-text-secondary">
                    <Shield className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                    {ttp}
                  </li>
                ))}
              </ul>
            </div>

            {/* MITRE */}
            <div>
              <h3 className="text-h4 font-medium text-ss-text-primary mb-2">MITRE ATT&CK IDs</h3>
              <div className="flex flex-wrap gap-2">
                {selectedThreat.mitreAttackIds.map(id => (
                  <a
                    key={id}
                    href={`https://attack.mitre.org/techniques/${id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-mono text-mono-sm px-2 py-1 bg-ss-bg-base border border-purple-800/50 text-purple-400 rounded-ss-sm hover:border-purple-500 transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    {id} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>

            {/* IOCs */}
            <div>
              <h3 className="text-h4 font-medium text-ss-text-primary mb-2">Indicators of Compromise</h3>
              <div className="bg-ss-bg-base border border-ss-border rounded-ss-md overflow-hidden">
                {selectedThreat.iocs.map((ioc, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 border-b border-ss-border-muted last:border-0">
                    <Badge variant={ioc.type === 'ip' ? 'critical' : ioc.type === 'hash' ? 'info' : 'medium'} size="sm">
                      {ioc.type.toUpperCase()}
                    </Badge>
                    <span className="font-mono text-mono-sm text-ss-text-secondary break-all">{ioc.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Affected sectors */}
            <div>
              <h3 className="text-h4 font-medium text-ss-text-primary mb-2">Affected Sectors</h3>
              <div className="flex flex-wrap gap-2">
                {selectedThreat.affectedSectors.map(s => (
                  <Badge key={s} variant="neutral">{s}</Badge>
                ))}
              </div>
            </div>

            {/* Recommended actions */}
            <div className="p-4 bg-amber-900/10 border border-amber-800/30 rounded-ss-md">
              <h3 className="text-h4 font-medium text-amber-400 mb-2">Recommended Actions</h3>
              <ul className="flex flex-col gap-1.5 text-body text-ss-text-secondary">
                <li>• Block all listed IPs and domains at the perimeter firewall</li>
                <li>• Hunt for associated file hashes across all endpoints</li>
                <li>• Review outbound DNS queries for matching IOC domains</li>
                <li>• Enable enhanced logging on affected systems for 72 hours</li>
              </ul>
            </div>
          </div>
        )}
      </SlidePanel>
    </motion.div>
  )
}
