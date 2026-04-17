import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Globe, Shield, Terminal, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { pageVariants, fadeUp, staggerContainer, staggerItem } from '../lib/motion'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SeverityBadge, Badge } from '../components/ui/Badge'
import { ALERTS } from '../data/mockData'
import { formatDate } from '../lib/utils'

const TIMELINE = [
  { time: '14:32:01', event: 'Alert triggered by SIEM rule #4421', type: 'trigger' },
  { time: '14:32:05', event: 'Automatic enrichment completed — IP reputation: MALICIOUS', type: 'enrich' },
  { time: '14:32:10', event: 'Alert assigned to Tier-1 queue', type: 'assign' },
  { time: '14:35:44', event: 'Analyst Alex Rivera acknowledged alert', type: 'ack' },
  { time: '14:41:02', event: 'Correlated with INC-4003 — Lateral Movement Campaign', type: 'correlate' },
]

const WHOIS = {
  org: 'AS14061 DigitalOcean, LLC',
  country: 'United States',
  region: 'New York',
  isp: 'DigitalOcean',
  abuse: 'abuse@digitalocean.com',
  reputation: 'MALICIOUS',
  firstSeen: '2024-11-12',
  lastSeen: '2024-04-17',
}

export function AlertDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const alert = ALERTS.find(a => a.id === id) ?? ALERTS[0]

  const parsedLog = (() => {
    try { return JSON.parse(alert.rawLog) } catch { return {} }
  })()

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-[1400px] mx-auto"
    >
      {/* Back */}
      <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/alerts')} className="mb-5">
        Back to Alerts
      </Button>

      {/* Hero */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <SeverityBadge severity={alert.severity} showDot={alert.status === 'open'} />
              <Badge
                variant={
                  alert.status === 'open' ? 'critical'
                  : alert.status === 'in_progress' ? 'medium'
                  : alert.status === 'acknowledged' ? 'info'
                  : 'success'
                }
              >
                {alert.status.replace('_', ' ')}
              </Badge>
              <Badge variant="neutral">{alert.category}</Badge>
            </div>
            <h1 className="text-h1 font-medium text-ss-text-primary">{alert.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-caption text-ss-text-muted">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(alert.timestamp)}</span>
              <span className="font-mono">{alert.id}</span>
              <span>{alert.protocol}</span>
            </div>
            <p className="text-body text-[#8B90A0] mt-3">{alert.description}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="secondary" size="sm" icon={CheckCircle}>Acknowledge</Button>
            <Button variant="secondary" size="sm" icon={AlertTriangle}>Escalate to Incident</Button>
            <Button variant="danger" size="sm" icon={XCircle}>Close Alert</Button>
          </div>
        </div>
      </motion.div>

      {/* Two-column body */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Timeline */}
        <Card padding="md">
          <h2 className="text-h4 font-medium text-ss-text-primary mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-ss-text-muted" /> Event Timeline
          </h2>
          <motion.ol variants={staggerContainer} initial="initial" animate="animate" className="relative border-l border-ss-border ml-2">
            {TIMELINE.map((item, i) => (
              <motion.li key={i} variants={staggerItem} className="mb-5 ml-4 last:mb-0">
                <span className="absolute -left-1.5 w-3 h-3 bg-ss-bg-surface border-2 border-blue-500 rounded-full" />
                <p className="text-caption font-mono text-blue-400">{item.time}</p>
                <p className="text-body text-ss-text-secondary mt-0.5">{item.event}</p>
              </motion.li>
            ))}
          </motion.ol>
        </Card>

        {/* Context panel */}
        <div className="flex flex-col gap-4">
          {/* WHOIS */}
          <Card padding="md">
            <h2 className="text-h4 font-medium text-ss-text-primary mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-ss-text-muted" /> Source IP Intelligence
            </h2>
            <div className="flex items-center gap-3 mb-3 p-2 bg-ss-bg-base rounded-ss-md border border-ss-border">
              <span className="font-mono text-mono-sm text-ss-text-primary">{alert.sourceIp}</span>
              <Badge variant={WHOIS.reputation === 'MALICIOUS' ? 'critical' : 'success'} size="sm">
                {WHOIS.reputation}
              </Badge>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(WHOIS).filter(([k]) => k !== 'reputation').map(([key, val]) => (
                <div key={key}>
                  <dt className="text-[11px] text-ss-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                  <dd className="text-caption text-ss-text-secondary truncate">{val}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {/* CVEs */}
          <Card padding="md">
            <h2 className="text-h4 font-medium text-ss-text-primary mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-ss-text-muted" /> Related CVEs & MITRE ATT&CK
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {['CVE-2024-3094', 'CVE-2024-21762', 'CVE-2023-44487'].map(cve => (
                <span key={cve} className="font-mono text-mono-sm px-2 py-1 bg-ss-bg-base border border-ss-border rounded-ss-sm text-purple-400">
                  {cve}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {['T1566 – Phishing', 'T1059 – Command Execution', 'T1071 – App Layer Protocol'].map(ttp => (
                <Badge key={ttp} variant="info" size="sm">{ttp}</Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Raw Log */}
      <Card padding="none">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-ss-border">
          <Terminal className="w-4 h-4 text-ss-text-muted" />
          <h2 className="text-h4 font-medium text-ss-text-primary">Raw Log</h2>
          <Badge variant="neutral" size="sm">JSON</Badge>
        </div>
        <div className="overflow-x-auto">
          <pre className="p-5 font-mono text-mono-sm text-ss-text-secondary leading-relaxed max-h-64 overflow-y-auto">
            <code>{JSON.stringify(parsedLog, null, 2)}</code>
          </pre>
        </div>
      </Card>
    </motion.div>
  )
}
