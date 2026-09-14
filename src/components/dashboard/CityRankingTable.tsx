import type { CitySummary } from '../../domain/summarizeByCity'
import { useFilterStore } from '../../state/useFilterStore'
import { formatCount, formatPercentage, formatPoints } from './format'
import { SortableTableHeader } from './SortableTableHeader'
import { useSortableRows } from './useSortableRows'

interface CityRankingTableProps {
  cities: CitySummary[]
}

export function CityRankingTable({ cities }: CityRankingTableProps) {
  const setCity = useFilterStore((state) => state.setCity)
  const { sorted, sortKey, direction, toggleSort } = useSortableRows<CitySummary, keyof CitySummary>(
    cities,
    'averageGap',
    'desc',
  )

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-800">Ranking de cidades</h2>
      <p className="text-xs text-slate-500">
        Clique em uma coluna para ordenar, ou no nome de uma cidade para ver só ela nas demais seções.
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead>
            <tr>
              <SortableTableHeader label="Cidade" columnKey="city" sortKey={sortKey} direction={direction} onSort={toggleSort} />
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
              <SortableTableHeader label="GAP" columnKey="averageGap" sortKey={sortKey} direction={direction} onSort={toggleSort} />
              <SortableTableHeader
                label="Categorias"
                columnKey="categoryCount"
                sortKey={sortKey}
                direction={direction}
                onSort={toggleSort}
              />
              <SortableTableHeader
                label="Registros"
                columnKey="recordCount"
                sortKey={sortKey}
                direction={direction}
                onSort={toggleSort}
              />
              <SortableTableHeader
                label="Inconsistências"
                columnKey="inconsistencyCount"
                sortKey={sortKey}
                direction={direction}
                onSort={toggleSort}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((city) => (
              <tr key={city.city}>
                <td className="px-3 py-2 font-medium">
                  <button
                    type="button"
                    onClick={() => setCity(city.city)}
                    className="text-slate-800 hover:text-blue-600 hover:underline"
                  >
                    {city.city}
                  </button>
                </td>
                <td className="px-3 py-2 text-slate-700">{formatPercentage(city.averageFidelity)}</td>
                <td className="px-3 py-2 text-slate-700">{formatPercentage(city.averageLimit)}</td>
                <td className="px-3 py-2 text-slate-700">{formatPoints(city.averageGap)}</td>
                <td className="px-3 py-2 text-slate-700">{formatCount(city.categoryCount)}</td>
                <td className="px-3 py-2 text-slate-700">{formatCount(city.recordCount)}</td>
                <td
                  className={`px-3 py-2 ${city.inconsistencyCount > 0 ? 'font-medium text-red-600' : 'text-slate-700'}`}
                >
                  {formatCount(city.inconsistencyCount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
