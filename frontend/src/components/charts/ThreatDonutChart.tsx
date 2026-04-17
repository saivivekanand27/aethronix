import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { ThreatCategoryPoint } from '../../types'

interface ThreatDonutChartProps {
  data: ThreatCategoryPoint[]
}

const COLORS = ['#EF4444', '#F59E0B', '#A78BFA', '#3B82F6', '#22C55E']

export function ThreatDonutChart({ data }: ThreatDonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#1A1D24',
            border: '1px solid #232730',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#F1F3F5',
          }}
          formatter={(value: number) => [`${value}%`, '']}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', color: '#8B90A0', paddingTop: '8px' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
