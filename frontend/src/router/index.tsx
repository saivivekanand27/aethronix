import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { AlertsPage } from '../pages/AlertsPage'
import { AlertDetailPage } from '../pages/AlertDetailPage'
import { ThreatIntelPage } from '../pages/ThreatIntelPage'
import { IncidentsPage } from '../pages/IncidentsPage'
import { IncidentNewPage } from '../pages/IncidentNewPage'
import { AssetsPage } from '../pages/AssetsPage'
import { AssetDetailPage } from '../pages/AssetDetailPage'
import { ReportsPage } from '../pages/ReportsPage'
import { SettingsPage } from '../pages/SettingsPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/alerts/:id" element={<AlertDetailPage />} />
        <Route path="/threats" element={<ThreatIntelPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/incidents/new" element={<IncidentNewPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/assets/:id" element={<AssetDetailPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
