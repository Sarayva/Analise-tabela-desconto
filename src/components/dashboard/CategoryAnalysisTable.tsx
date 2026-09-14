import { useState } from 'react'
import type { CategorySummary, CityExtreme } from '../../domain/summarizeByCategory'
import { useFilterStore } from '../../state/useFilterStore'
import { formatCount, formatPercentage, formatPoints } from './format'
import { SortableTableHeader } from './SortableTableHeader'
import { useSortableRows } from './useSortableRows'

interface CategoryAnalysisTableProps {
  categories: CategorySummary[]
}

export function CategoryAnalysisTable({ categories }: CategoryAnalysisTableProps) {
  const { sorted, sortKey, direction, toggleSort } = useSortableRows<CategorySummary, keyof CategorySummary>(
    categories,
    'averageGap',
    'desc',
  )
  const [expandedCode, setExpandedCode] = useState<number | null>(null)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-800">Análise por categoria</h2>
      <p className="text-xs text-slate-500">
        {categories.length} categorias com dados nos dois arquivos. Clique em uma categoria para ver a cidade com
        maior/menor desconto e maior/menor GAP.
      </p>

      <div className="mt-3 max-h-[480px] overflow-auto rounded-md border border-slate-100">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="sticky top-0 bg-white">
            <tr>
              <SortableTableHeader
                label="Categoria"
                columnKey="categoryDescription"
                sortKey={sortKey}
                direction={direction}
                onSort={toggleSort}
              />
              <SortableTableHeader
                label="Fidelidade"
                columnKey="averageFidelity"
                sortKey={sortKey}
                direction={direction}
                onSort={toggleSort}
              />
              <SortableTableHeader
                label="Limite"
                columnKey="averageLimit"
                sortKey={sortKey}
                direction={direction}
                onSort={toggleSort}
              />
              <SortableTableHeader
                label="GAP médio"
                columnKey="averageGap"
                sortKey={sortKey}
                direction={direction}
                onSort={toggleSort}
              />
              <SortableTableHeader label="Mín." columnKey="minGap" sortKey={sortKey} direction={direction} onSort={toggleSort} />
              <SortableTableHeader label="Máx." columnKey="maxGap" sortKey={sortKey} direction={direction} onSort={toggleSort} />
              <SortableTableHeader
                label="Mediana"
                columnKey="medianGap"
                sortKey={sortKey}
                direction={direction}
                onSort={toggleSort}
              />
              <SortableTableHeader
                label="Cidades"
                columnKey="cityCount"
                sortKey={sortKey}
                direction={direction}
                onSort={toggleSort}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((category) => (
              <CategoryRow
                key={category.categoryCode}
                category={category}
                expanded={expandedCode === category.categoryCode}
                onToggle={() =>
                  setExpandedCode((current) => (current === category.categoryCode ? null : category.categoryCode))
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CategoryRow({
  category,
  expanded,
  onToggle,
}: {
  category: CategorySummary
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <>
      <tr className="cursor-pointer hover:bg-slate-50" onClick={onToggle}>
        <td className="px-3 py-2 font-medium text-slate-800">{category.categoryDescription}</td>
        <td className="px-3 py-2 text-slate-700">{formatPercentage(category.averageFidelity)}</td>
        <td className="px-3 py-2 text-slate-700">{formatPercentage(category.averageLimit)}</td>
        <td className="px-3 py-2 text-slate-700">{formatPoints(category.averageGap)}</td>
        <td className="px-3 py-2 text-slate-700">{formatPoints(category.minGap)}</td>
        <td className="px-3 py-2 text-slate-700">{formatPoints(category.maxGap)}</td>
        <td className="px-3 py-2 text-slate-700">{formatPoints(category.medianGap)}</td>
        <td className="px-3 py-2 text-slate-700">{formatCount(category.cityCount)}</td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50">
          <td colSpan={8} className="px-3 py-3 text-xs text-slate-600">
            <div className="grid gap-2 sm:grid-cols-4">
              <ExtremeInfo label="Maior desconto Fidelidade" extreme={category.cityWithMaxFidelity} unit="%" />
              <ExtremeInfo label="Menor desconto Fidelidade" extreme={category.cityWithMinFidelity} unit="%" />
              <ExtremeInfo label="Maior GAP" extreme={category.cityWithMaxGap} unit=" p.p." />
              <ExtremeInfo label="Menor GAP" extreme={category.cityWithMinGap} unit=" p.p." />
            </div>
            <FilterByCategoryButton categoryCode={category.categoryCode} />
          </td>
        </tr>
      )}
    </>
  )
}

function FilterByCategoryButton({ categoryCode }: { categoryCode: number }) {
  const setCategoryCode = useFilterStore((state) => state.setCategoryCode)
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        setCategoryCode(categoryCode)
      }}
      className="mt-3 text-blue-600 hover:underline"
    >
      Ver só esta categoria nas demais seções
    </button>
  )
}

function ExtremeInfo({ label, extreme, unit }: { label: string; extreme: CityExtreme | null; unit: string }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-slate-800">{extreme ? `${extreme.city} (${extreme.value.toFixed(1)}${unit})` : '—'}</p>
    </div>
  )
}
