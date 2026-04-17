import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Plug, Key, Users, CreditCard, Copy, Trash2, Plus, Check, MessageSquare, Search, Phone, Zap } from 'lucide-react'
import { pageVariants, staggerContainer, staggerItem, fadeUp } from '../lib/motion'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'

type Tab = 'profile' | 'notifications' | 'integrations' | 'api-keys' | 'team' | 'billing'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

const INTEGRATIONS = [
  { id: 'slack', name: 'Slack', desc: 'Send alerts and incident notifications to Slack channels', icon: MessageSquare, color: 'text-purple-400 bg-purple-900/30 border-purple-800/40', connected: true },
  { id: 'splunk', name: 'Splunk', desc: 'Forward security events to Splunk SIEM for correlation', icon: Search, color: 'text-amber-400 bg-amber-900/30 border-amber-800/40', connected: false },
  { id: 'pagerduty', name: 'PagerDuty', desc: 'Escalate critical incidents to on-call teams via PagerDuty', icon: Phone, color: 'text-green-400 bg-green-900/30 border-green-800/40', connected: true },
  { id: 'crowdstrike', name: 'CrowdStrike', desc: 'Pull endpoint telemetry from CrowdStrike Falcon platform', icon: Zap, color: 'text-red-400 bg-red-900/30 border-red-800/40', connected: false },
]

const MOCK_KEYS = [
  { id: 'KEY-001', name: 'Production API Key', created: '2024-01-15', lastUsed: '2 hours ago', prefix: 'ss_live_a7f2' },
  { id: 'KEY-002', name: 'CI/CD Pipeline', created: '2024-02-28', lastUsed: '1 day ago', prefix: 'ss_live_c3d9' },
  { id: 'KEY-003', name: 'Monitoring Webhook', created: '2024-03-10', lastUsed: '5 minutes ago', prefix: 'ss_live_e1b4' },
]

const TEAM_MEMBERS = [
  { name: 'Alex Rivera', email: 'alex@securesight.io', role: 'Security Analyst', status: 'active' },
  { name: 'Sarah Chen', email: 'sarah@securesight.io', role: 'SOC Manager', status: 'active' },
  { name: 'Mike Ross', email: 'mike@securesight.io', role: 'Threat Hunter', status: 'active' },
  { name: 'Priya Sharma', email: 'priya@securesight.io', role: 'Security Analyst', status: 'pending' },
]

function ProfileTab() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const handleSave = () => {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }, 900)
  }
  return (
    <div className="flex flex-col gap-5">
      <Card padding="md">
        <h3 className="text-h4 font-medium text-ss-text-primary mb-4">Avatar</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <Button variant="secondary" size="sm">Change Avatar</Button>
            <p className="text-caption text-ss-text-muted mt-1.5">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </Card>
      <Card padding="md">
        <h3 className="text-h4 font-medium text-ss-text-primary mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name" defaultValue="Alex Rivera" />
          <Input label="Email Address" type="email" defaultValue="alex@securesight.io" />
          <Input label="Role / Title" defaultValue="Security Analyst" />
          <Input label="Department" defaultValue="Security Operations" />
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ss-border-muted">
          <Button variant="primary" size="md" loading={saving} onClick={handleSave}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          {saved && <span className="text-caption text-green-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Saved</span>}
        </div>
      </Card>
    </div>
  )
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    criticalAlerts: true,
    highAlerts: true,
    mediumAlerts: false,
    weeklyDigest: true,
    incidentUpdates: true,
    teamMentions: true,
  })
  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))
  const NotifRow = ({ label, desc, k }: { label: string; desc: string; k: keyof typeof prefs }) => (
    <div className="flex items-center justify-between py-3 border-b border-ss-border-muted last:border-0">
      <div>
        <p className="text-body text-ss-text-primary">{label}</p>
        <p className="text-caption text-ss-text-muted">{desc}</p>
      </div>
      <button
        onClick={() => toggle(k)}
        className={`relative w-10 h-5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ss-accent-blue ${prefs[k] ? 'bg-blue-600' : 'bg-ss-bg-elevated border border-ss-border'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[k] ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
  return (
    <Card padding="md">
      <h3 className="text-h4 font-medium text-ss-text-primary mb-4">Notification Preferences</h3>
      <NotifRow label="Critical Alerts" desc="Immediate notification for critical severity events" k="criticalAlerts" />
      <NotifRow label="High Alerts" desc="Notifications for high severity events" k="highAlerts" />
      <NotifRow label="Medium Alerts" desc="Notifications for medium severity events" k="mediumAlerts" />
      <NotifRow label="Weekly Digest" desc="Summary of security events every Monday at 9 AM" k="weeklyDigest" />
      <NotifRow label="Incident Updates" desc="Status changes on incidents you are assigned to" k="incidentUpdates" />
      <NotifRow label="Team Mentions" desc="When a teammate mentions you in a note" k="teamMentions" />
    </Card>
  )
}

function IntegrationsTab() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.connected]))
  )
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-4">
      {INTEGRATIONS.map(intg => (
        <motion.div key={intg.id} variants={staggerItem}>
          <Card padding="md" className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 border rounded-ss-md flex items-center justify-center ${intg.color}`}>
                  <intg.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-h4 font-medium text-ss-text-primary">{intg.name}</p>
                  <Badge variant={connected[intg.id] ? 'success' : 'neutral'} size="sm">
                    {connected[intg.id] ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => setConnected(c => ({ ...c, [intg.id]: !c[intg.id] }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${connected[intg.id] ? 'bg-blue-600' : 'bg-ss-bg-elevated border border-ss-border'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${connected[intg.id] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <p className="text-caption text-ss-text-muted">{intg.desc}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

function ApiKeysTab() {
  const [copied, setCopied] = useState<string | null>(null)
  const handleCopy = (prefix: string) => {
    setCopied(prefix)
    setTimeout(() => setCopied(null), 1500)
  }
  return (
    <div className="flex flex-col gap-4">
      <Card padding="none">
        <div className="px-5 py-4 border-b border-ss-border">
          <h3 className="text-h4 font-medium text-ss-text-primary">Active API Keys</h3>
        </div>
        {MOCK_KEYS.map(key => (
          <div key={key.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-ss-border-muted hover:bg-ss-bg-elevated transition-colors last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-body text-ss-text-primary">{key.name}</p>
              <div className="flex items-center gap-3 text-caption text-ss-text-muted mt-0.5">
                <span className="font-mono">{key.prefix}••••••••</span>
                <span>Created {key.created}</span>
                <span>Used {key.lastUsed}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={copied === key.prefix ? Check : Copy}
              onClick={() => handleCopy(key.prefix)}
            >
              {copied === key.prefix ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="danger" size="sm" icon={Trash2}>Revoke</Button>
          </div>
        ))}
      </Card>
      <Card padding="md">
        <h3 className="text-h4 font-medium text-ss-text-primary mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Generate New Key
        </h3>
        <div className="flex gap-3">
          <Input placeholder="Key name (e.g. Staging Webhook)" className="flex-1" />
          <Button variant="primary" size="md">Generate Key</Button>
        </div>
      </Card>
    </div>
  )
}

function TeamTab() {
  return (
    <div className="flex flex-col gap-4">
      <Card padding="none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ss-border">
          <h3 className="text-h4 font-medium text-ss-text-primary">Team Members</h3>
          <Button variant="primary" size="sm" icon={Plus}>Invite Member</Button>
        </div>
        {TEAM_MEMBERS.map(member => (
          <div key={member.email} className="flex items-center gap-4 px-5 py-3.5 border-b border-ss-border-muted hover:bg-ss-bg-elevated transition-colors last:border-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-caption text-white font-medium">{member.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body text-ss-text-primary">{member.name}</p>
              <p className="text-caption text-ss-text-muted">{member.email}</p>
            </div>
            <Badge variant="neutral" size="sm">{member.role}</Badge>
            <Badge variant={member.status === 'active' ? 'success' : 'medium'} size="sm">{member.status}</Badge>
          </div>
        ))}
      </Card>
    </div>
  )
}

const TAB_CONTENT: Record<Tab, React.ReactNode> = {
  profile: <ProfileTab />,
  notifications: <NotificationsTab />,
  integrations: <IntegrationsTab />,
  'api-keys': <ApiKeysTab />,
  team: <TeamTab />,
  billing: (
    <Card padding="md">
      <h3 className="text-h4 font-medium text-ss-text-primary mb-2">Enterprise Plan</h3>
      <p className="text-body text-ss-text-secondary mb-4">Your organization is on the Enterprise plan with unlimited seats and API access.</p>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Plan', value: 'Enterprise' },
          { label: 'Billing Cycle', value: 'Annual' },
          { label: 'Next Invoice', value: 'Jan 15, 2025' },
        ].map(({ label, value }) => (
          <div key={label} className="p-3 bg-ss-bg-elevated border border-ss-border rounded-ss-md">
            <p className="text-caption text-ss-text-muted">{label}</p>
            <p className="text-body font-medium text-ss-text-primary mt-0.5">{value}</p>
          </div>
        ))}
      </div>
      <Button variant="secondary" size="md">Manage Billing</Button>
    </Card>
  ),
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 max-w-[1100px] mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-h1 font-medium text-ss-text-primary">Settings</h1>
        <p className="text-body text-ss-text-secondary mt-1">Manage your account, team, and integrations</p>
      </div>

      <div className="flex gap-6">
        {/* Tab nav */}
        <nav className="flex flex-col gap-1 w-44 flex-shrink-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-ss-md text-body font-medium transition-colors text-left',
                activeTab === id
                  ? 'bg-blue-900/20 text-blue-400'
                  : 'text-ss-text-secondary hover:text-ss-text-primary hover:bg-ss-bg-elevated'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="flex-1 min-w-0"
        >
          {TAB_CONTENT[activeTab]}
        </motion.div>
      </div>
    </motion.div>
  )
}
