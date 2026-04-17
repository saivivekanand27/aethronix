import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Terminal, ChevronDown, ChevronUp, CheckCircle, Lock, Server, Wifi, Eye } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { cn } from '../lib/utils'

interface Step {
  id: string
  title: string
  icon: React.ElementType
  severity: 'high' | 'medium' | 'low'
  summary: string
  steps: string[]
  code?: { label: string; content: string }
}

const GUIDE: Step[] = [
  {
    id: '1',
    title: 'Close Exposed Ports',
    icon: Shield,
    severity: 'high',
    summary: 'Restrict access to unnecessary open ports to minimize your attack surface.',
    steps: [
      'List all listening services: sudo netstat -tuln',
      'Disable services you do not need (especially FTP on port 21)',
      'Use firewall rules to restrict port access to known IPs only',
      'Block database ports (3306, 5432, 27017) from the public internet',
    ],
    code: {
      label: 'UFW Firewall Commands',
      content: `# Block FTP (port 21)
sudo ufw deny 21

# Block MySQL from public access
sudo ufw deny 3306

# Block dev server
sudo ufw deny 8080

# Allow SSH only from your office IP
sudo ufw allow from 203.0.113.0/24 to any port 22

# Apply changes
sudo ufw reload`,
    },
  },
  {
    id: '2',
    title: 'Secure SSH Access',
    icon: Lock,
    severity: 'high',
    summary: 'SSH is the most targeted remote access vector. Harden it against brute-force attacks.',
    steps: [
      'Disable password authentication — use SSH key pairs only',
      'Change SSH from default port 22 to a non-standard port',
      'Install fail2ban to block IPs with repeated failed logins',
      'Disable direct root login via SSH',
    ],
    code: {
      label: '/etc/ssh/sshd_config changes',
      content: `# Disable password authentication
PasswordAuthentication no

# Disable root login
PermitRootLogin no

# Use non-standard port
Port 2222

# Limit auth attempts
MaxAuthTries 3
MaxSessions 2

# Restart to apply
sudo systemctl restart sshd`,
    },
  },
  {
    id: '3',
    title: 'Update All Services',
    icon: Server,
    severity: 'medium',
    summary: 'Outdated software frequently contains known vulnerabilities with public exploits.',
    steps: [
      'Run system package updates: sudo apt update && sudo apt upgrade -y',
      'Update your web server (nginx/apache) to the latest stable release',
      'Apply all database security patches',
      'Enable automatic security patch installation for critical updates',
    ],
    code: {
      label: 'Update Commands (Ubuntu/Debian)',
      content: `# Update all packages
sudo apt update && sudo apt upgrade -y

# Enable unattended security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades

# List upgradable packages
apt list --upgradable 2>/dev/null`,
    },
  },
  {
    id: '4',
    title: 'Enable & Configure Firewall',
    icon: Wifi,
    severity: 'high',
    summary: 'A properly configured firewall is the most effective first line of defense.',
    steps: [
      'Enable UFW (Uncomplicated Firewall) if not already running',
      'Set default policy: deny all inbound, allow all outbound',
      'Explicitly allow only required ports (443, 80, SSH port)',
      'Regularly audit all active rules and remove outdated ones',
    ],
    code: {
      label: 'UFW Initial Setup',
      content: `# Enable firewall
sudo ufw enable

# Default policy
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow required traffic
sudo ufw allow 443    # HTTPS
sudo ufw allow 80     # HTTP
sudo ufw allow 2222   # SSH (non-standard port)

# Verify configuration
sudo ufw status verbose`,
    },
  },
  {
    id: '5',
    title: 'Protect Admin Panels',
    icon: Eye,
    severity: 'high',
    summary: 'Admin interfaces are high-value targets. Add multiple authentication layers.',
    steps: [
      'Move admin panels off the default /admin path',
      'Require VPN access for all admin panel connections',
      'Enable multi-factor authentication (MFA) on all admin accounts',
      'Implement IP whitelisting for admin-only endpoints',
      'Add rate limiting on login endpoints to block brute-force',
    ],
    code: {
      label: 'Nginx — Restrict by IP',
      content: `# In your nginx server block
location /admin {
    # Allow only your office/VPN subnet
    allow 203.0.113.0/24;
    deny all;

    # Optional: basic auth as second factor
    auth_basic "Restricted Area";
    auth_basic_user_file /etc/nginx/.htpasswd;

    proxy_pass http://localhost:3000;
}`,
    },
  },
]

const severityStyle: Record<string, string> = {
  high:   'text-red-400 bg-red-950/50 border-red-900/40',
  medium: 'text-amber-400 bg-amber-950/50 border-amber-900/40',
  low:    'text-green-400 bg-green-950/50 border-green-900/40',
}

function GuideCard({ step }: { step: Step }) {
  const [open, setOpen] = useState(false)
  const Icon = step.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 p-6 text-left hover:bg-gray-800/30 transition-colors"
      >
        <div className="w-10 h-10 bg-blue-950 border border-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-semibold text-white">{step.title}</h3>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', severityStyle[step.severity])}>
              {step.severity.charAt(0).toUpperCase() + step.severity.slice(1)} Priority
            </span>
          </div>
          <p className="text-sm text-gray-500">{step.summary}</p>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-gray-800"
        >
          <div className="p-6 space-y-5">
            <ul className="space-y-3">
              {step.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-950 border border-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-blue-400">{i + 1}</span>
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>

            {step.code && (
              <div className="bg-black border border-gray-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900/60">
                  <Terminal className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-xs text-gray-500 font-mono">{step.code.label}</span>
                </div>
                <pre className="p-5 text-xs text-green-400 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                  {step.code.content}
                </pre>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function FixGuide() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 bg-blue-950 border border-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Fix & Recovery Guide</h1>
                <p className="text-gray-500">Step-by-step remediation for all detected issues</p>
              </div>
            </div>

            <div className="p-4 bg-blue-950/30 border border-blue-900/40 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-400 leading-relaxed">
                Follow these steps in order of priority{' '}
                <span className="text-red-400 font-medium">High</span> →{' '}
                <span className="text-amber-400 font-medium">Medium</span> →{' '}
                <span className="text-green-400 font-medium">Low</span>.
                After completing each step, re-scan to verify the fix was applied correctly.
              </p>
            </div>
          </motion.div>

          <div className="space-y-4">
            {GUIDE.map(step => <GuideCard key={step.id} step={step} />)}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-6"
          >
            <p className="text-gray-700 text-sm mb-4">Applied all fixes? Run a fresh scan to verify.</p>
            <button
              onClick={() => navigate('/setup')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
            >
              <Shield className="w-4 h-4" /> Scan Again
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
