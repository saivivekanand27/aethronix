export interface Alert {
  id: string
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'closed' | 'acknowledged'
  sourceIp: string
  destinationIp: string
  protocol: string
  timestamp: Date
  category: string
  assignedTo?: string
  description: string
  rawLog: string
}

export interface Threat {
  id: string
  name: string
  type: 'apt' | 'malware' | 'cve' | 'ioc' | 'ransomware'
  severity: 'critical' | 'high' | 'medium' | 'low'
  affectedSectors: string[]
  source: string
  publishedAt: Date
  description: string
  iocs: IOC[]
  mitreAttackIds: string[]
  ttps: string[]
}

export interface IOC {
  type: 'ip' | 'domain' | 'hash' | 'url'
  value: string
}

export interface Asset {
  id: string
  name: string
  type: 'server' | 'endpoint' | 'cloud' | 'network'
  ipAddress: string
  hostname: string
  os: string
  riskScore: number
  status: 'healthy' | 'at_risk' | 'compromised' | 'offline'
  lastSeen: Date
  owner: string
  tags: string[]
}

export interface Incident {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'investigating' | 'contained' | 'closed'
  assignedTo: string
  createdAt: Date
  updatedAt: Date
  affectedAssets: string[]
  relatedAlerts: string[]
  description: string
}

export interface DashboardStats {
  criticalThreats: number
  activeAlerts: number
  assetsAtRisk: number
  resolvedToday: number
  threatTrend: ThreatTrendPoint[]
  threatsByCategory: ThreatCategoryPoint[]
}

export interface ThreatTrendPoint {
  date: string
  critical: number
  high: number
  medium: number
}

export interface ThreatCategoryPoint {
  name: string
  value: number
}

export interface Report {
  id: string
  name: string
  type: 'threat_summary' | 'incident_report' | 'compliance' | 'executive_brief' | 'vulnerability_scan'
  generatedAt: Date
  size: string
  status: 'completed' | 'generating' | 'scheduled'
}

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type AlertStatus = 'open' | 'in_progress' | 'closed' | 'acknowledged'
export type IncidentStatus = 'open' | 'investigating' | 'contained' | 'closed'
export type AssetType = 'server' | 'endpoint' | 'cloud' | 'network'
export type AssetStatus = 'healthy' | 'at_risk' | 'compromised' | 'offline'
export type ThreatType = 'apt' | 'malware' | 'cve' | 'ioc' | 'ransomware'

export interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  width?: string
}

export interface NavItem {
  label: string
  path: string
  icon: string
}
