import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Calendar, Users, Loader2 } from 'lucide-react'
import { pageVariants, fadeUp, staggerContainer, staggerItem } from '../lib/motion'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Report } from '../types'
import { formatDateOnly } from '../lib/utils'

const MOCK_REPORTS: Report[] = [
  { id: 'RPT-001', name: 'Weekly Threat Summary — Apr 07–13', type: 'threat_summary', generatedAt: new Date('2024-04-13'), size: '2.4 MB', status: 'completed' },
  { id: 'RPT-002', name: 'Incident Report: Ransomware on PROD-DB-01', type: 'incident_report', generatedAt: new Date('2024-04-11'), size: '1.1 MB', status: 'completed' },
  { id: 'RPT-003', name: 'Q1 2024 Executive Security Brief', type: 'executive_brief', generatedAt: new Date('2024-04-01'), size: '3.7 MB', status: 'completed' },
  { id: 'RPT-004', name: 'SOC 2 Compliance Audit — March 2024', type: 'compliance', generatedAt: new Date('2024-03-28'), size: '5.2 MB', status: 'completed' },
  { id: 'RPT-005', name: 'Vulnerability Scan — Production Network', type: 'vulnerability_scan', generatedAt: new Date('2024-03-22'), size: '890 KB', status: 'completed' },
  { id: 'RPT-006', name: 'Weekly Threat Summary — Apr 14–20', type: 'threat_summary', generatedAt: new Date(), size: '—', status: 'generating' },
]

const typeLabel: Record<string, string> = {
  threat_summary: 'Threat Summary',
  incident_report: 'Incident Report',
  executive_brief: 'Executive Brief',
  compliance: 'Compliance',
  vulnerability_scan: 'Vulnerability Scan',
}

const typeVariant: Record<string, 'info' | 'critical' | 'medium' | 'success' | 'neutral'> = {
  threat_summary: 'medium',
  incident_report: 'critical',
  executive_brief: 'info',
  compliance: 'success',
  vulnerability_scan: 'neutral',
}

export function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [scheduleForm, setScheduleForm] = useState({
    type: 'threat_summary',
    recipients: '',
    frequency: 'weekly',
  })
  const [scheduling, setScheduling] = useState(false)
  const [scheduled, setScheduled] = useState(false)

  const handleDownload = (id: string) => {
    setDownloading(id)
    setTimeout(() => setDownloading(null), 1800)
  }

  const handleSchedule = () => {
    setScheduling(true)
    setTimeout(() => { setScheduling(false); setScheduled(true); setTimeout(() => setScheduled(false), 3000) }, 1200)
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-[1200px] mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-h1 font-medium text-ss-text-primary">Reports</h1>
        <p className="text-body text-ss-text-secondary mt-1">Generate, schedule, and download security reports</p>
      </div>

      {/* Generated reports */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6">
        <Card padding="none">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ss-border">
            <h2 className="text-h3 font-medium text-ss-text-primary flex items-center gap-2">
              <FileText className="w-5 h-5 text-ss-text-muted" /> Generated Reports
            </h2>
            <Badge variant="neutral" size="sm">{MOCK_REPORTS.length} reports</Badge>
          </div>
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            {MOCK_REPORTS.map(report => (
              <motion.div
                key={report.id}
                variants={staggerItem}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-ss-border-muted hover:bg-ss-bg-elevated transition-colors last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-body text-ss-text-primary truncate">{report.name}</p>
                    {report.status === 'generating' && (
                      <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-caption text-ss-text-muted">
                    <span>{formatDateOnly(report.generatedAt)}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <Badge variant={typeVariant[report.type] ?? 'neutral'} size="sm">
                  {typeLabel[report.type] ?? report.type}
                </Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={downloading === report.id ? undefined : Download}
                  loading={downloading === report.id}
                  disabled={report.status === 'generating'}
                  onClick={() => handleDownload(report.id)}
                >
                  {downloading === report.id ? 'Downloading...' : 'Download PDF'}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>

      {/* Schedule report */}
      <motion.div variants={fadeUp} initial="initial" animate="animate">
        <Card padding="md">
          <h2 className="text-h3 font-medium text-ss-text-primary mb-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ss-text-muted" /> Schedule Report
          </h2>
          <p className="text-caption text-ss-text-muted mb-5">Configure automated report delivery to your team</p>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-caption text-ss-text-secondary font-medium">Report Type</label>
              <select
                value={scheduleForm.type}
                onChange={e => setScheduleForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-ss-bg-elevated border border-ss-border rounded-ss-md text-body text-ss-text-primary px-3 py-2 focus:outline-none focus:border-ss-accent-blue"
              >
                {Object.entries(typeLabel).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-caption text-ss-text-secondary font-medium">Delivery Frequency</label>
              <select
                value={scheduleForm.frequency}
                onChange={e => setScheduleForm(f => ({ ...f, frequency: e.target.value }))}
                className="w-full bg-ss-bg-elevated border border-ss-border rounded-ss-md text-body text-ss-text-primary px-3 py-2 focus:outline-none focus:border-ss-accent-blue"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <div className="col-span-2">
              <Input
                label="Recipients"
                placeholder="security-team@company.com, ciso@company.com"
                prefix={<Users className="w-4 h-4" />}
                value={scheduleForm.recipients}
                onChange={e => setScheduleForm(f => ({ ...f, recipients: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-ss-border-muted">
            <Button
              variant="primary"
              size="md"
              loading={scheduling}
              onClick={handleSchedule}
            >
              {scheduling ? 'Scheduling...' : 'Schedule Report'}
            </Button>
            {scheduled && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-caption text-green-400"
              >
                ✓ Report scheduled successfully
              </motion.span>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
