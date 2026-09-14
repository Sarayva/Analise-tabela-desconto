import type { GapSituation } from '../../domain/types'
import type { GapDistributionSummary } from '../../domain/summarizeGapDistribution'

const SITUATIONS: GapSituation[] = ['inconsistencia', 'sem_espaco_adicional', 'regular']

const SITUATION_LABEL: Record<GapSituation, string> = {
  inconsistencia: 'Inconsistência',
  sem_espaco_adicional: 'Sem espaço adicional',
  regular: 'Regular',
}

const SITUATION_DESCRIPTION: Record<GapSituation, string> = {
  inconsistencia: 'O desconto Limite é menor que o desconto Fidelidade praticado.',
  sem_espaco_adicional: 'O desconto Limite é igual ao desconto Fidelidade — não há espaço para negociar mais.',
  regular: 'O desconto Limite é maior que o desconto Fidelidade — há espaço de negociação.',
}

const SITUATION_COLOR: Record<GapSituation, string> = {
  inconsistencia: 'border-red-200 bg-red-50 text-red-700',
  sem_espaco_adicional: 'border-amber-200 bg-amber-50 text-amber-700',
  regular: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

interface GapSummaryPreviewProps {
  summary: GapDistributionSummary
}

/** Distribuição das combinações por situação (Inconsistência / Sem espaço adicional / Regular) e estatísticas do GAP. */
export function GapSummaryPreview({ summary }: GapSummaryPreviewProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-800">
        GAP de desconto{' '}
        <span
          className="cursor-help text-xs font-normal text-slate-400"
          title="Diferença entre o desconto Limite e o desconto Fidelidade (Limite - Fidelidade)."
        >
          (o que é isso?)
        </span>
      </h2>
      <p className="text-xs text-slate-500">
        Calculado para as {summary.totalWithGap} combinações Cidade + Categoria presentes nos dois arquivos.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {SITUATIONS.map((situation) => (
          <div
            key={situation}
            className={`rounded-md border p-3 ${SITUATION_COLOR[situation]}`}
            title={SITUATION_DESCRIPTION[situation]}
          >
            <p className="text-xs font-medium">{SITUATION_LABEL[situation]}</p>
            <p className="text-xl font-semibold">{summary.bySituation[situation].count}</p>
            <p className="text-xs">{summary.bySituation[situation].percentage.toFixed(1)}%</p>
          </div>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat label="Maior GAP" value={summary.maxGap} />
        <Stat label="Menor GAP" value={summary.minGap} />
        <Stat label="GAP médio" value={summary.averageGap} />
        <Stat label="Mediana do GAP" value={summary.medianGap} />
      </dl>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-800">{value === null ? '—' : `${value.toFixed(1)} p.p.`}</dd>
    </div>
  )
}
