import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '@/hooks/useTheme'
import { formatCurrency, formatNumber } from '@/utils/format'
import styles from './RevenueChart.module.css'

const MAX_BARS = 8

// SVG chart parts take colours as props, so they come from the theme here (mirrors global.css)
const CHART_COLORS = {
  light: { grid: '#e2e5ea', axis: '#8a94a3', label: '#5f6b7a', bar: '#2563eb', cursor: '#f4f5f7' },
  dark: { grid: '#2a303b', axis: '#7b8494', label: '#a0a8b6', bar: '#3b82f6', cursor: '#1d222c' },
}
const shorten = (text) => (text.length > 18 ? `${text.slice(0, 17)}…` : text)

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <strong>{item.name}</strong>
      <span>{formatCurrency(item.revenue)}</span>
      <span className={styles.muted}>
        {formatNumber(item.tickets)} tickets · {formatNumber(item.bookings)} bookings
      </span>
    </div>
  )
}

/** Horizontal bars of revenue per item (movie or theater), top 8. */
export default function RevenueChart({ items }) {
  const { theme } = useTheme()
  if (!items?.length) return <p className={styles.empty}>No confirmed bookings in this period.</p>

  const colors = CHART_COLORS[theme]
  const data = items.slice(0, MAX_BARS).map((item) => ({ ...item, revenue: Number(item.revenue) }))
  return (
    <div className={styles.chart} style={{ height: 48 + data.length * 40 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} stroke={colors.grid} />
          <XAxis type="number" tickFormatter={(value) => formatNumber(value)} fontSize={12} stroke={colors.axis} />
          <YAxis type="category" dataKey="name" width={130} tickFormatter={shorten} fontSize={12} stroke={colors.label} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: colors.cursor }} />
          <Bar dataKey="revenue" fill={colors.bar} radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
