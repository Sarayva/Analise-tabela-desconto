import { useMemo, useState } from 'react'
import type { CityCategoryMatrix } from '../../domain/buildCityCategoryMatrix'
import { matrixKey } from '../../domain/buildCityCategoryMatrix'
import { percentile } from '../../domain/statistics'
import type { DiscountRecord, GapSituation } from '../../domain/types'
import { ABSENT_CELL_COLOR, PRESENT_CELL_COLOR, divergingColor, sequentialColor } from './colorScale'
import { formatPercentage, formatPoints } from './format'
import { Matrix, type MatrixAxisItem } from './Matrix'

type MatrixMode = 'fidelidade' | 'limite' | 'gap' | 'presenca'

const MODE_LABEL: Record<MatrixMode, string> = {
  fidelidade: 'Desconto Fidelidade',
  limite: 'Desconto Limite',
  gap: 'GAP de desconto',
  presenca: 'Presença da categoria',
}

const SITUATION_LABEL: Record<GapSituation, string> = {
  inconsistencia: 'Inconsistência',
  sem_espaco_adicional: 'Sem espaço adicional',
  regular: 'Regular',
}

interface CellSelection {
  city: string
  categoryDescription: string
  record: DiscountRecord | null
}

interface CityCategoryMatrixSectionProps {
  matrix: CityCategoryMatrix
}

export function CityCategoryMatrixSection({ matrix }: CityCategoryMatrixSectionProps) {
  const [mode, setMode] = useState<MatrixMode>('gap')
  const [selection, setSelection] = useState<CellSelection | null>(null)

  const bounds = useMemo(() => {
    let fidelityMin = 0
    let fidelityMax = 0
    let limitMin = 0
    let limitMax = 0
    const gapMagnitudes: number[] = []
    for (const record of matrix.cellByKey.values()) {
      if (record.fidelityPercentage !== null) {
        fidelityMin = Math.min(fidelityMin, record.fidelityPercentage)
        fidelityMax = Math.max(fidelityMax, record.fidelityPercentage)
      }
      if (record.limitPercentage !== null) {
        limitMin = Math.min(limitMin, record.limitPercentage)
        limitMax = Math.max(limitMax, record.limitPercentage)
      }
      if (record.gap !== null) gapMagnitudes.push(Math.abs(record.gap))
    }
    // Usa o percentil 95 em vez do máximo absoluto: um único outlier não deve
    // esmagar o contraste de cor do resto da matriz — ele só fica com a cor mais saturada.
    const maxAbsGap = percentile(gapMagnitudes, 0.95) ?? 0
    return { fidelityMin, fidelityMax, limitMin, limitMax, maxAbsGap }
  }, [matrix])

  const rows: MatrixAxisItem[] = matrix.categories.map((category) => ({
    key: String(category.code),
    label: category.description,
  }))
  const columns: MatrixAxisItem[] = matrix.cities.map((city) => ({ key: city, label: city }))

  function getCell(rowKey: string, columnKey: string): DiscountRecord | undefined {
    return matrix.cellByKey.get(matrixKey(columnKey, Number(rowKey)))
  }

  function cellColor(cell: DiscountRecord | undefined): string {
    if (mode === 'presenca') return cell ? PRESENT_CELL_COLOR : ABSENT_CELL_COLOR
    if (mode === 'fidelidade') return sequentialColor(cell?.fidelityPercentage ?? null, bounds.fidelityMin, bounds.fidelityMax)
    if (mode === 'limite') return sequentialColor(cell?.limitPercentage ?? null, bounds.limitMin, bounds.limitMax)
    return divergingColor(cell?.gap ?? null, bounds.maxAbsGap)
  }

  function cellTitle(row: MatrixAxisItem, column: MatrixAxisItem, cell: DiscountRecord | undefined): string {
    const prefix = `${column.label} — ${row.label}`
    if (!cell) return `${prefix}: categoria ausente`
    if (mode === 'fidelidade') return `${prefix}: Fidelidade ${formatPercentage(cell.fidelityPercentage)}`
    if (mode === 'limite') return `${prefix}: Limite ${formatPercentage(cell.limitPercentage)}`
    if (mode === 'presenca') return `${prefix}: categoria presente`
    return `${prefix}: GAP ${formatPoints(cell.gap)}`
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-800">Matriz Cidade × Categoria</h2>
      <p className="text-xs text-slate-500">
        {matrix.categories.length} categorias × {matrix.cities.length} cidades. Passe o mouse sobre uma célula para
        ver o valor; clique para o detalhe completo. Os filtros de Cidade e Categoria se aplicam aqui; o filtro de
        Situação não, pois misturaria "ausente" com "fora da situação escolhida".
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(MODE_LABEL) as MatrixMode[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              mode === option ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {MODE_LABEL[option]}
          </button>
        ))}
      </div>

      <MatrixLegend mode={mode} bounds={bounds} />

      <div className="mt-3">
        <Matrix
          rows={rows}
          columns={columns}
          getCell={getCell}
          cellColor={cellColor}
          cellTitle={cellTitle}
          onCellClick={(row, column, cell) =>
            setSelection({ city: column.label, categoryDescription: row.label, record: cell ?? null })
          }
        />
      </div>

      {selection && <CellDetail selection={selection} onClose={() => setSelection(null)} />}
    </div>
  )
}

function MatrixLegend({
  mode,
  bounds,
}: {
  mode: MatrixMode
  bounds: { fidelityMin: number; fidelityMax: number; limitMin: number; limitMax: number; maxAbsGap: number }
}) {
  if (mode === 'presenca') {
    return (
      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
        <LegendSwatch color={PRESENT_CELL_COLOR} label="Presente" />
        <LegendSwatch color={ABSENT_CELL_COLOR} label="Ausente" />
      </div>
    )
  }

  if (mode === 'gap') {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
        <span>-{bounds.maxAbsGap.toFixed(0)} p.p.</span>
        <GradientBar stops={['#e34948', '#f0efec', '#2a78d6']} />
        <span>+{bounds.maxAbsGap.toFixed(0)} p.p. ou mais</span>
      </div>
    )
  }

  const min = mode === 'fidelidade' ? bounds.fidelityMin : bounds.limitMin
  const max = mode === 'fidelidade' ? bounds.fidelityMax : bounds.limitMax
  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
      <span>{min.toFixed(0)}%</span>
      <GradientBar stops={['#cde2fb', '#0d366b']} />
      <span>{max.toFixed(0)}%</span>
    </div>
  )
}

function GradientBar({ stops }: { stops: string[] }) {
  return <div className="h-3 w-32 rounded" style={{ background: `linear-gradient(to right, ${stops.join(', ')})` }} />
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function CellDetail({ selection, onClose }: { selection: CellSelection; onClose: () => void }) {
  const { city, categoryDescription, record } = selection

  return (
    <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-slate-800">{categoryDescription}</p>
          <p className="text-xs text-slate-500">{city}</p>
        </div>
        <button type="button" onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600">
          Fechar
        </button>
      </div>

      {record ? (
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DetailItem label="Fidelidade" value={formatPercentage(record.fidelityPercentage)} />
          <DetailItem label="Limite" value={formatPercentage(record.limitPercentage)} />
          <DetailItem label="GAP" value={formatPoints(record.gap)} />
          <DetailItem
            label="Situação"
            value={record.situation === 'sem_par' ? 'Sem par' : SITUATION_LABEL[record.situation]}
          />
        </dl>
      ) : (
        <p className="mt-3 text-slate-600">
          Categoria ausente — não há registro desta categoria para {city} em nenhum dos dois arquivos.
        </p>
      )}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  )
}
