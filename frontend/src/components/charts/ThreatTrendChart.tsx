import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { ThreatTrendPoint } from '../../types'

interface ThreatTrendChartProps {
  data: ThreatTrendPoint[]
}

export function ThreatTrendChart({ data }: ThreatTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#232730" />
        <XAxis
          dataKey="date"
          tickFormatter={(v: string) => {
            const d = new Date(v)
            return `${d.getMonth() + 1}/${d.getDate()}`
          }}
          tick={{ fill: '#8B90A0', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8B90A0', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#1A1D24',
            border: '1px solid #232730',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#F1F3F5',
          }}
          labelStyle={{ color: '#8B90A0', marginBottom: 4 }}
          itemStyle={{ padding: '2px 0' }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#8B90A0', paddingTop: '8px' }}
        />
        <Line
          type="monotone"
          dataKey="critical"
          stroke="#EF4444"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#EF4444' }}
          name="Critical"
        />
        <Line
          type="monotone"
          dataKey="high"
          stroke="#F59E0B"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#F59E0B' }}
          name="High"
        />
        <Line
          type="monotone"
          dataKey="medium"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#3B82F6' }}
          name="Medium"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
