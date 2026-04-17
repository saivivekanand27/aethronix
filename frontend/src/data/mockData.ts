export interface Asset {
  id: string
  name: string
  type: 'Server' | 'Endpoint' | 'API' | 'Database'
  status: 'Online' | 'Offline' | 'Warning'
  risk: 'High' | 'Medium' | 'Low'
  ip: string
}

export interface Port {
  port: number
  service: string
  risk: 'high' | 'medium' | 'low'
  description: string
}

export interface AIInsight {
  id: string
  title: string
  severity: 'high' | 'medium' | 'low'
  description: string
  recommendation: string
}

export interface ScanData {
  domain: string
  scannedAt: Date
  totalAssets: number
  vulnerabilities: number
  highRisk: number
  riskScore: number
  assets: Asset[]
  exposedPorts: Port[]
  riskDistribution: { name: string; value: number; color: string }[]
  assetsVsVulns: { category: string; assets: number; vulns: number }[]
  aiInsights: AIInsight[]
}

export function generateScanData(domain: string): ScanData {
  return {
    domain,
    scannedAt: new Date(),
    totalAssets: 24,
    vulnerabilities: 8,
    highRisk: 3,
    riskScore: 67,
    assets: [
      { id: '1', name: domain, type: 'Server', status: 'Online', risk: 'High', ip: '192.168.1.1' },
      { id: '2', name: `api.${domain}`, type: 'API', status: 'Online', risk: 'Medium', ip: '192.168.1.2' },
      { id: '3', name: `db.${domain}`, type: 'Database', status: 'Warning', risk: 'High', ip: '10.0.0.5' },
      { id: '4', name: `cdn.${domain}`, type: 'Server', status: 'Online', risk: 'Low', ip: '104.16.0.1' },
      { id: '5', name: `mail.${domain}`, type: 'Server', status: 'Online', risk: 'Medium', ip: '192.168.1.10' },
      { id: '6', name: `admin.${domain}`, type: 'Endpoint', status: 'Warning', risk: 'High', ip: '192.168.1.20' },
      { id: '7', name: `staging.${domain}`, type: 'Server', status: 'Online', risk: 'Low', ip: '10.0.1.5' },
      { id: '8', name: `vpn.${domain}`, type: 'Endpoint', status: 'Online', risk: 'Medium', ip: '192.168.2.1' },
    ],
    exposedPorts: [
      { port: 22, service: 'SSH', risk: 'high', description: 'Remote access — restrict to specific IPs' },
      { port: 80, service: 'HTTP', risk: 'medium', description: 'Unencrypted web traffic' },
      { port: 443, service: 'HTTPS', risk: 'low', description: 'Encrypted web traffic — OK' },
      { port: 3306, service: 'MySQL', risk: 'high', description: 'Database exposed to internet' },
      { port: 8080, service: 'Dev Server', risk: 'high', description: 'Dev server publicly accessible' },
      { port: 21, service: 'FTP', risk: 'high', description: 'Insecure file transfer — disable immediately' },
      { port: 25, service: 'SMTP', risk: 'medium', description: 'Email server port' },
    ],
    riskDistribution: [
      { name: 'High Risk', value: 37, color: '#ef4444' },
      { name: 'Medium Risk', value: 38, color: '#f59e0b' },
      { name: 'Low Risk', value: 25, color: '#22c55e' },
    ],
    assetsVsVulns: [
      { category: 'Servers', assets: 4, vulns: 3 },
      { category: 'APIs', assets: 3, vulns: 2 },
      { category: 'Databases', assets: 2, vulns: 2 },
      { category: 'Endpoints', assets: 6, vulns: 1 },
      { category: 'Other', assets: 9, vulns: 0 },
    ],
    aiInsights: [
      {
        id: '1',
        title: 'SSH Port 22 Exposed',
        severity: 'high',
        description: 'Port 22 is publicly accessible, allowing brute-force attacks on your SSH service.',
        recommendation: 'Restrict SSH to specific IP addresses or move to a non-standard port with key-only auth.',
      },
      {
        id: '2',
        title: 'Database Port Publicly Accessible',
        severity: 'high',
        description: 'MySQL port 3306 is open to the internet, creating a direct attack path to your data.',
        recommendation: 'Immediately block port 3306 externally. Database should only be accessible internally.',
      },
      {
        id: '3',
        title: 'Development Server Running in Production',
        severity: 'high',
        description: 'Port 8080 hosts a dev server accessible from the public internet.',
        recommendation: 'Remove the dev server or restrict access via firewall to internal IPs only.',
      },
      {
        id: '4',
        title: 'Outdated TLS Configuration',
        severity: 'medium',
        description: 'TLS 1.0 and 1.1 are still enabled, which have known vulnerabilities.',
        recommendation: 'Upgrade to TLS 1.3 only and disable legacy protocol versions.',
      },
      {
        id: '5',
        title: 'HTTP Serving Unencrypted Content',
        severity: 'medium',
        description: 'Port 80 responds with unencrypted content that can be intercepted.',
        recommendation: 'Redirect all HTTP to HTTPS and implement HSTS headers.',
      },
    ],
  }
}
