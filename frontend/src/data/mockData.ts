import type { Alert, Asset as AppAsset, Threat, Incident } from '../types'

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

export const ALERTS: Alert[] = [
  {
    id: 'AL-001',
    name: 'SSH brute force attempt',
    severity: 'high',
    status: 'open',
    sourceIp: '192.168.1.24',
    destinationIp: '10.0.0.5',
    protocol: 'TCP',
    timestamp: new Date(),
    category: 'Network',
    assignedTo: 'Tier 1 Operator',
    description: 'Multiple failed SSH login attempts were detected from the same source IP address.',
    rawLog: '{"event":"ssh_failed_login","count":12}',
  },
  {
    id: 'AL-002',
    name: 'Unusual web traffic spike',
    severity: 'medium',
    status: 'in_progress',
    sourceIp: '203.0.113.12',
    destinationIp: '10.0.0.10',
    protocol: 'HTTP',
    timestamp: new Date(Date.now() - 3600 * 1000),
    category: 'Application',
    description: 'A sudden increase in web requests was seen against the public application endpoint.',
    rawLog: '{"event":"traffic_spike","volume":8500}',
  },
]

export const INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    title: 'Unauthorized access detected',
    severity: 'high',
    status: 'investigating',
    assignedTo: 'SOC Team',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    affectedAssets: ['web-server-1', 'db-server-1'],
    relatedAlerts: ['AL-001'],
    description: 'Unusual access patterns were observed on the public web server and database.',
  },
  {
    id: 'INC-002',
    title: 'Phishing campaign response',
    severity: 'medium',
    status: 'open',
    assignedTo: 'Incident Response',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
    affectedAssets: ['mail-server-1'],
    relatedAlerts: ['AL-002'],
    description: 'A targeted phishing campaign has been detected affecting outbound email services.',
  },
]

export const ASSETS: AppAsset[] = [
  {
    id: 'asset-1',
    name: 'web-server-1',
    type: 'server',
    ipAddress: '10.0.0.10',
    hostname: 'web1.example.com',
    os: 'Ubuntu 22.04',
    riskScore: 67,
    status: 'at_risk',
    lastSeen: new Date(),
    owner: 'Ops Team',
    tags: ['production', 'web'],
  },
  {
    id: 'asset-2',
    name: 'db-server-1',
    type: 'cloud',
    ipAddress: '10.0.0.20',
    hostname: 'db1.example.com',
    os: 'Ubuntu 20.04',
    riskScore: 82,
    status: 'compromised',
    lastSeen: new Date(Date.now() - 2 * 3600 * 1000),
    owner: 'Database Team',
    tags: ['database', 'production'],
  },
]

export const THREATS: Threat[] = [
  {
    id: 'T-001',
    name: 'Silver Sparrow Malware Campaign',
    type: 'malware',
    severity: 'high',
    affectedSectors: ['Financial', 'Energy'],
    source: 'OSINT Feed',
    publishedAt: new Date(Date.now() - 5 * 3600 * 1000),
    description: 'A stealthy malware campaign targeting outdated server infrastructure.',
    iocs: [
      { type: 'ip', value: '198.51.100.21' },
      { type: 'hash', value: '3f1d2e4a8b6c7d9e0f1a2b3c4d5e6f7a' },
    ],
    mitreAttackIds: ['T1059', 'T1071'],
    ttps: ['Credential Access', 'Command and Control'],
  },
  {
    id: 'T-002',
    name: 'FIN7 Phishing Campaign',
    type: 'apt',
    severity: 'critical',
    affectedSectors: ['Retail', 'Hospitality'],
    source: 'ThreatIntel Provider',
    publishedAt: new Date(Date.now() - 24 * 3600 * 1000),
    description: 'Sophisticated phishing activity aimed at payment processing environments.',
    iocs: [
      { type: 'url', value: 'http://malicious.example.com/invoice' },
      { type: 'domain', value: 'malicious.example.com' },
    ],
    mitreAttackIds: ['T1566', 'T1071'],
    ttps: ['Phishing', 'Data Exfiltration'],
  },
]

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
