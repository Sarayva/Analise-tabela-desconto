import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CitySummary } from '../../domain/summarizeByCity'

const BAR_COLOR = '#2a78d6'
const GRIDLINE_COLOR = '#e1e0d9'
const AXIS_COLOR = '#898781'
const PRIMARY_INK = '#0b0b0b'

interface CityGapChartProps {
  cities: CitySummary[]
}

/** Responde: qual cidade tem mais espaço de negociação (maior GAP médio) e qual tem menos. */
export function CityGapChart({ cities }: CityGapChartProps) {
  const data = cities
    .filter((city): city is CitySummary & { averageGap: number } => city.averageGap !== null)
    .map((city) => ({ city: city.city, averageGap: city.averageGap }))
    .sort((a, b) => b.averageGap - a.averageGap)

  if (data.length === 0) return null

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-800">GAP médio por cidade</h2>
      <p className="text-xs text-slate-500">
        Quanto maior a barra, mais espaço a cidade tem entre o desconto praticado e o desconto máximo permitido.
      </p>

      <div className="mt-4" style={{ height: Math.max(200, data.length * 32) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 0 }}>
            <CartesianGrid horizontal={false} stroke={GRIDLINE_COLOR} />
            <XAxis
              type="number"
              tick={{ fill: AXIS_COLOR, fontSize: 12 }}
              axisLine={{ stroke: GRIDLINE_COLOR }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="city"
              tick={{ fill: PRIMARY_INK, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              cursor={{ fill: 'rgba(42, 120, 214, 0.06)' }}
              formatter={(value) => [`${Number(value).toFixed(1)} p.p.`, 'GAP médio']}
              contentStyle={{ borderRadius: 8, borderColor: GRIDLINE_COLOR, fontSize: 12 }}
            />
            <Bar dataKey="averageGap" fill={BAR_COLOR} radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Exportação default para permitir `React.lazy` (Recharts só é carregado quando o gráfico é exibido).
export default CityGapChart
