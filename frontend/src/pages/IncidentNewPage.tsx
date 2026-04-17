import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Flame } from 'lucide-react'
import { pageVariants, fadeUp } from '../lib/motion'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ASSETS } from '../data/mockData'

export function IncidentNewPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    severity: 'high' as 'critical' | 'high' | 'medium' | 'low',
    assignedTo: '',
    description: '',
    affectedAssets: [] as string[],
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { navigate('/incidents') }, 1000)
  }

  const toggleAsset = (id: string) => {
    setForm(f => ({
      ...f,
      affectedAssets: f.affectedAssets.includes(id)
        ? f.affectedAssets.filter(a => a !== id)
        : [...f.affectedAssets, id],
    }))
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-2xl mx-auto"
    >
      <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/incidents')} className="mb-5">
        Back to Incidents
      </Button>

      <motion.div variants={fadeUp} initial="initial" animate="animate">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-900/40 border border-red-800/50 rounded-ss-md flex items-center justify-center">
            <Flame className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-h2 font-medium text-ss-text-primary">Create New Incident</h1>
            <p className="text-body text-ss-text-secondary">Document and track a security incident</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Card padding="md">
            <h2 className="text-h4 font-medium text-ss-text-primary mb-4">Incident Details</h2>
            <div className="flex flex-col gap-4">
              <Input
                label="Incident Title"
                placeholder="e.g. Suspected Ransomware on PROD-DB-01"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-caption text-ss-text-secondary font-medium">Severity</label>
                <div className="flex gap-2">
                  {(['critical', 'high', 'medium', 'low'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, severity: s }))}
                      className={`flex-1 py-2 text-caption font-medium rounded-ss-md border transition-colors capitalize ${
                        form.severity === s
                          ? s === 'critical' ? 'bg-red-900/30 border-red-700 text-red-400'
                          : s === 'high' ? 'bg-orange-900/30 border-orange-700 text-orange-400'
                          : s === 'medium' ? 'bg-amber-900/30 border-amber-700 text-amber-400'
                          : 'bg-blue-900/30 border-blue-700 text-blue-400'
                          : 'border-ss-border text-ss-text-muted hover:border-ss-border hover:text-ss-text-secondary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Assigned Analyst"
                placeholder="e.g. Sarah Chen"
                value={form.assignedTo}
                onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-caption text-ss-text-secondary font-medium">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe what happened, what systems are affected, and the initial impact assessment..."
                  className="w-full bg-ss-bg-elevated border border-ss-border rounded-ss-md text-body text-ss-text-primary placeholder:text-ss-text-muted px-3 py-2 transition-colors focus:outline-none focus:border-ss-accent-blue focus:ring-1 focus:ring-ss-accent-blue/30 resize-none"
                />
              </div>
            </div>
          </Card>

          <Card padding="md">
            <h2 className="text-h4 font-medium text-ss-text-primary mb-1">Affected Assets</h2>
            <p className="text-caption text-ss-text-muted mb-3">Select all assets involved in this incident</p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {ASSETS.slice(0, 16).map(asset => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => toggleAsset(asset.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-ss-md border text-left transition-colors ${
                    form.affectedAssets.includes(asset.id)
                      ? 'border-blue-600 bg-blue-900/20 text-ss-text-primary'
                      : 'border-ss-border text-ss-text-secondary hover:border-ss-border hover:bg-ss-bg-elevated'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${form.affectedAssets.includes(asset.id) ? 'bg-blue-400' : 'bg-ss-border'}`} />
                  <div className="min-w-0">
                    <p className="text-caption font-mono truncate">{asset.name}</p>
                    <p className="text-[11px] text-ss-text-muted font-mono truncate">{asset.ipAddress}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="md" onClick={() => navigate('/incidents')}>Cancel</Button>
            <Button variant="primary" size="md" type="submit" loading={loading}>
              {loading ? 'Creating...' : 'Create Incident'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
