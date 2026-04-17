// import { motion } from 'framer-motion'
// import { ShieldAlert, Bell, Server, CheckCircle, ArrowRight } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'
// import { pageVariants, staggerContainer, staggerItem, fadeUp } from '../lib/motion'
// import { StatCard } from '../components/ui/StatCard'
// import { Card } from '../components/ui/Card'
// import { SeverityBadge, Badge } from '../components/ui/Badge'
// import { ThreatTrendChart } from '../components/charts/ThreatTrendChart'
// import { ThreatDonutChart } from '../components/charts/ThreatDonutChart'
// import { DASHBOARD_STATS, ALERTS, ASSETS } from '../data/mockData'
// import { getRiskColor, getRiskBgColor, getRelativeTime, formatDateShort } from '../lib/utils'

// export function DashboardPage() {
//   const navigate = useNavigate()
//   const recentAlerts = ALERTS.slice(0, 5)
//   const topAssets = [...ASSETS].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6)

//   return (
//     <motion.div
//       variants={pageVariants}
//       initial="initial"
//       animate="animate"
//       exit="exit"
//       className="p-6 max-w-[1600px] mx-auto"
//     >
//       {/* Page header */}
//       <div className="mb-6">
//         <h1 className="text-h1 font-medium text-ss-text-primary">Security Overview</h1>
//         <p className="text-body text-ss-text-secondary mt-1">
//           Real-time threat intelligence · Last updated {new Date().toLocaleTimeString()}
//         </p>
//       </div>

//       {/* KPI Stats */}
//       <motion.div
//         variants={staggerContainer}
//         initial="initial"
//         animate="animate"
//         className="grid grid-cols-4 gap-4 mb-6"
//       >
//         <motion.div variants={staggerItem}>
//           <StatCard
//             title="Critical Threats"
//             value={DASHBOARD_STATS.criticalThreats}
//             delta="+3 today"
//             deltaDirection="up"
//             icon={ShieldAlert}
//             accentColor="red"
//           />
//         </motion.div>
//         <motion.div variants={staggerItem}>
//           <StatCard
//             title="Active Alerts"
//             value={DASHBOARD_STATS.activeAlerts}
//             delta="+12 since yesterday"
//             deltaDirection="up"
//             icon={Bell}
//             accentColor="amber"
//           />
//         </motion.div>
//         <motion.div variants={staggerItem}>
//           <StatCard
//             title="Assets at Risk"
//             value={DASHBOARD_STATS.assetsAtRisk}
//             delta="-5 from baseline"
//             deltaDirection="down"
//             icon={Server}
//             accentColor="blue"
//           />
//         </motion.div>
//         <motion.div variants={staggerItem}>
//           <StatCard
//             title="Incidents Resolved Today"
//             value={DASHBOARD_STATS.resolvedToday}
//             delta="↑ 8 vs. yesterday"
//             deltaDirection="up"
//             icon={CheckCircle}
//             accentColor="green"
//           />
//         </motion.div>
//       </motion.div>

//       {/* Row 2: Charts */}
//       <div className="grid grid-cols-3 gap-4 mb-4">
//         {/* Trend Chart */}
//         <motion.div variants={fadeUp} initial="initial" animate="animate" className="col-span-2">
//           <Card padding="md">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-h4 font-medium text-ss-text-primary">Threat Activity (Last 30 Days)</h2>
//               <Badge variant="neutral" size="sm">30d window</Badge>
//             </div>
//             <ThreatTrendChart data={DASHBOARD_STATS.threatTrend} />
//           </Card>
//         </motion.div>

//         {/* Donut Chart */}
//         <motion.div variants={fadeUp} initial="initial" animate="animate">
//           <Card padding="md" className="h-full">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-h4 font-medium text-ss-text-primary">Threats by Category</h2>
//             </div>
//             <ThreatDonutChart data={DASHBOARD_STATS.threatsByCategory} />
//           </Card>
//         </motion.div>
//       </div>

//       {/* Row 3: Recent Alerts + Top Assets */}
//       <div className="grid grid-cols-2 gap-4">
//         {/* Recent Alerts */}
//         <motion.div variants={fadeUp} initial="initial" animate="animate">
//           <Card padding="none">
//             <div className="flex items-center justify-between px-5 py-4 border-b border-ss-border">
//               <h2 className="text-h4 font-medium text-ss-text-primary">Recent Alerts</h2>
//               <button
//                 onClick={() => navigate('/alerts')}
//                 className="flex items-center gap-1 text-caption text-blue-400 hover:text-blue-300 transition-colors"
//               >
//                 View all <ArrowRight className="w-3 h-3" />
//               </button>
//             </div>
//             <div className="divide-y divide-ss-border-muted">
//               {recentAlerts.map(alert => (
//                 <div
//                   key={alert.id}
//                   onClick={() => navigate(`/alerts/${alert.id}`)}
//                   className="flex items-center gap-3 px-5 py-3 hover:bg-ss-bg-elevated transition-colors cursor-pointer"
//                 >
//                   <SeverityBadge severity={alert.severity} size="sm" showDot={alert.status === 'open'} />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-body text-ss-text-primary truncate">{alert.name}</p>
//                     <p className="text-caption text-ss-text-muted">{formatDateShort(alert.timestamp)}</p>
//                   </div>
//                   <Badge
//                     variant={
//                       alert.status === 'open' ? 'critical'
//                       : alert.status === 'in_progress' ? 'medium'
//                       : alert.status === 'acknowledged' ? 'info'
//                       : 'success'
//                     }
//                     size="sm"
//                   >
//                     {alert.status.replace('_', ' ')}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </motion.div>

//         {/* Top Affected Assets */}
//         <motion.div variants={fadeUp} initial="initial" animate="animate">
//           <Card padding="none">
//             <div className="flex items-center justify-between px-5 py-4 border-b border-ss-border">
//               <h2 className="text-h4 font-medium text-ss-text-primary">Top Affected Assets</h2>
//               <button
//                 onClick={() => navigate('/assets')}
//                 className="flex items-center gap-1 text-caption text-blue-400 hover:text-blue-300 transition-colors"
//               >
//                 View all <ArrowRight className="w-3 h-3" />
//               </button>
//             </div>
//             <div className="divide-y divide-ss-border-muted">
//               {topAssets.map(asset => (
//                 <div
//                   key={asset.id}
//                   onClick={() => navigate(`/assets/${asset.id}`)}
//                   className="flex items-center gap-3 px-5 py-3 hover:bg-ss-bg-elevated transition-colors cursor-pointer"
//                 >
//                   <div className="flex-1 min-w-0">
//                     <p className="text-body text-ss-text-primary truncate font-mono text-mono-sm">{asset.name}</p>
//                     <p className="text-caption text-ss-text-muted font-mono">{asset.ipAddress}</p>
//                   </div>
//                   <div className="flex items-center gap-3 flex-shrink-0">
//                     <div className="w-24">
//                       <div className="flex justify-between mb-1">
//                         <span className={`text-[11px] font-medium ${getRiskColor(asset.riskScore)}`}>
//                           {asset.riskScore}
//                         </span>
//                       </div>
//                       <div className="h-1.5 bg-ss-bg-elevated rounded-full overflow-hidden">
//                         <div
//                           className={`h-full rounded-full ${getRiskBgColor(asset.riskScore)}`}
//                           style={{ width: `${asset.riskScore}%` }}
//                         />
//                       </div>
//                     </div>
//                     <p className="text-caption text-ss-text-muted w-16 text-right">{getRelativeTime(asset.lastSeen)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </motion.div>
//       </div>
//     </motion.div>
//   )
// }
