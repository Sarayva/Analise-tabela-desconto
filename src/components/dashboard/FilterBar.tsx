import type { CityCategoryMatrix } from '../../domain/buildCityCategoryMatrix'
import type { SituationFilterValue } from '../../domain/filterRecords'
import { useFilterStore } from '../../state/useFilterStore'
import { formatCount } from './format'

const SITUATION_OPTIONS: { value: SituationFilterValue; label: string }[] = [
  { value: 'inconsistencia', label: 'Inconsistência' },
  { value: 'sem_espaco_adicional', label: 'Sem espaço adicional' },
  { value: 'regular', label: 'Regular' },
  { value: 'sem_par', label: 'Sem par (só em um arquivo)' },
]

interface FilterBarProps {
  /** Cidades e categorias disponíveis — sempre a partir dos dados completos, para as opções não encolherem ao filtrar. */
  fullMatrix: CityCategoryMatrix
  visibleCount: number
  totalCount: number
}

export function FilterBar({ fullMatrix, visibleCount, totalCount }: FilterBarProps) {
  const city = useFilterStore((state) => state.city)
  const categoryCode = useFilterStore((state) => state.categoryCode)
  const situation = useFilterStore((state) => state.situation)
  const setCity = useFilterStore((state) => state.setCity)
  const setCategoryCode = useFilterStore((state) => state.setCategoryCode)
  const setSituation = useFilterStore((state) => state.setSituation)
  const reset = useFilterStore((state) => state.reset)

  const hasActiveFilter = city !== null || categoryCode !== null || situation !== null
  const selectedCategoryDescription = fullMatrix.categories.find((c) => c.code === categoryCode)?.description ?? null

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <Breadcrumb
        city={city}
        categoryDescription={selectedCategoryDescription}
        onGoToOverview={reset}
        onGoToCity={() => setCategoryCode(null)}
      />

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <FilterSelect
          label="Cidade"
          value={city ?? ''}
          onChange={(value) => setCity(value === '' ? null : value)}
          options={[{ value: '', label: 'Todas' }, ...fullMatrix.cities.map((c) => ({ value: c, label: c }))]}
        />
        <FilterSelect
          label="Categoria"
          value={categoryCode !== null ? String(categoryCode) : ''}
          onChange={(value) => setCategoryCode(value === '' ? null : Number(value))}
          options={[
            { value: '', label: 'Todas' },
            ...fullMatrix.categories.map((c) => ({ value: String(c.code), label: c.description })),
          ]}
        />
        <FilterSelect
          label="Situação"
          value={situation ?? ''}
          onChange={(value) => setSituation(value === '' ? null : (value as SituationFilterValue))}
          options={[{ value: '', label: 'Todas' }, ...SITUATION_OPTIONS]}
        />

        {hasActiveFilter && (
          <button type="button" onClick={reset} className="pb-1.5 text-xs text-blue-600 hover:underline">
            Limpar filtros
          </button>
        )}

        <span className="ml-auto pb-1.5 text-xs text-slate-500">
          Mostrando {formatCount(visibleCount)} de {formatCount(totalCount)} registros
        </span>
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-[10rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function Breadcrumb({
  city,
  categoryDescription,
  onGoToOverview,
  onGoToCity,
}: {
  city: string | null
  categoryDescription: string | null
  onGoToOverview: () => void
  onGoToCity: () => void
}) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm" aria-label="Navegação de detalhamento">
      <button
        type="button"
        onClick={onGoToOverview}
        className={!city ? 'font-medium text-slate-800' : 'text-blue-600 hover:underline'}
      >
        Visão geral
      </button>
      {city && (
        <>
          <span className="text-slate-400">→</span>
          <button
            type="button"
            onClick={onGoToCity}
            className={!categoryDescription ? 'font-medium text-slate-800' : 'text-blue-600 hover:underline'}
          >
            {city}
          </button>
        </>
      )}
      {categoryDescription && (
        <>
          <span className="text-slate-400">→</span>
          <span className="font-medium text-slate-800">{categoryDescription}</span>
        </>
      )}
    </nav>
  )
}
