import { formatCount, formatPercentage, formatPoints } from './format'

interface KpiCardsProps {
  totalCities: number
  totalCategories: number
  totalRecords: number
  averageFidelity: number | null
  averageLimit: number | null
  averageGap: number | null
  inconsistencyCount: number
  unmatchedCount: number
}

export function KpiCards({
  totalCities,
  totalCategories,
  totalRecords,
  averageFidelity,
  averageLimit,
  averageGap,
  inconsistencyCount,
  unmatchedCount,
}: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Kpi label="Cidades analisadas" value={formatCount(totalCities)} />
      <Kpi label="Categorias analisadas" value={formatCount(totalCategories)} />
      <Kpi label="Registros analisados" value={formatCount(totalRecords)} />
      <Kpi
        label="Fidelidade média"
        value={formatPercentage(averageFidelity)}
        description="Média do desconto praticado/inicial, entre as combinações presentes nos dois arquivos."
      />
      <Kpi
        label="Limite médio"
        value={formatPercentage(averageLimit)}
        description="Média do desconto máximo permitido, entre as combinações presentes nos dois arquivos."
      />
      <Kpi
        label="GAP médio"
        value={formatPoints(averageGap)}
        description="Diferença média entre o desconto Limite e o desconto Fidelidade."
      />
      <Kpi
        label="Inconsistências"
        value={formatCount(inconsistencyCount)}
        description="Combinações em que o desconto Limite é menor que o desconto Fidelidade praticado."
        highlight={inconsistencyCount > 0}
      />
      <Kpi
        label="Sem correspondência"
        value={formatCount(unmatchedCount)}
        description="Combinações Cidade + Categoria presentes em apenas um dos dois arquivos."
        highlight={unmatchedCount > 0}
      />
    </div>
  )
}

function Kpi({
  label,
  value,
  description,
  highlight,
}: {
  label: string
  value: string
  description?: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${highlight ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}
      title={description}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${highlight ? 'text-amber-700' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}
