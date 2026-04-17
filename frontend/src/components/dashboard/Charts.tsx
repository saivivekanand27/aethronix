import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { ScanData } from '../../data/mockData'

const tooltipStyle = {
  contentStyle: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '10px',
    fontSize: '12px',
    color: '#fff',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  labelStyle: { color: '#6b7280', marginBottom: 4 },
}

export function RiskDistributionChart({ data }: { data: ScanData['riskDistribution'] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="font-semibold text-white">Risk Distribution</h2>
        <p className="text-sm text-gray-500 mt-0.5">Breakdown by severity level</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={78}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              {...tooltipStyle}
              formatter={(v: number) => [`${v}%`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2.5 mt-1">
          {data.map(item => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-sm text-gray-400">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AssetsVsVulnsChart({ data }: { data: ScanData['assetsVsVulns'] }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="font-semibold text-white">Assets vs Vulnerabilities</h2>
        <p className="text-sm text-gray-500 mt-0.5">Breakdown by category</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="category" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#6b7280', paddingTop: '12px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="assets" name="Assets" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="vulns" name="Vulnerabilities" fill="#ef4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
