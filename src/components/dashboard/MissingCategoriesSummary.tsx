import { useMemo } from 'react'
import { analyzeMissingCategories } from '../../domain/analyzeMissingCategories'
import type { CityCategoryMatrix } from '../../domain/buildCityCategoryMatrix'
import { formatCount } from './format'

interface MissingCategoriesSummaryProps {
  matrix: CityCategoryMatrix
}

const VISIBLE_LIMIT = 10

export function MissingCategoriesSummary({ matrix }: MissingCategoriesSummaryProps) {
  const analysis = useMemo(() => analyzeMissingCategories(matrix), [matrix])
  const citiesWithMissing = analysis.byCity.filter((city) => city.missingCategories.length > 0)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-800">Categorias ausentes por cidade</h2>
      <p className="text-xs text-slate-500">
        Uma categoria "ausente" não aparece em nenhum dos dois arquivos para aquela cidade. Isso não é
        necessariamente um erro — pode ser uma lacuna a conferir ou uma escolha comercial da loja.
      </p>

      {citiesWithMissing.length === 0 ? (
        <p className="mt-3 text-sm text-emerald-700">✓ Todas as cidades têm todas as categorias registradas.</p>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-slate-700">Cidades com mais categorias ausentes</h3>
            <ul className="mt-2 flex flex-col text-sm">
              {citiesWithMissing.slice(0, VISIBLE_LIMIT).map((city) => (
                <li key={city.city} className="flex items-center justify-between border-b border-slate-100 py-1.5">
                  <span className="text-slate-700">{city.city}</span>
                  <span className="font-medium text-slate-800">{formatCount(city.missingCategories.length)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700">Categorias ausentes em mais cidades</h3>
            <ul className="mt-2 flex flex-col text-sm">
              {analysis.categoriesWithAnyAbsence.slice(0, VISIBLE_LIMIT).map((category) => (
                <li
                  key={category.code}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 py-1.5"
                >
                  <span className="truncate text-slate-700" title={category.description}>
                    {category.description}
                  </span>
                  <span className="shrink-0 font-medium text-slate-800">
                    {formatCount(category.missingInCities.length)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {analysis.exclusiveCategories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-700">Categorias exclusivas de uma única cidade</h3>
          <ul className="mt-2 flex flex-col text-sm">
            {analysis.exclusiveCategories.map((category) => (
              <li key={category.code} className="flex items-center justify-between border-b border-slate-100 py-1.5">
                <span className="truncate text-slate-700" title={category.description}>
                  {category.description}
                </span>
                <span className="shrink-0 font-medium text-slate-800">{category.presentInCities[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
