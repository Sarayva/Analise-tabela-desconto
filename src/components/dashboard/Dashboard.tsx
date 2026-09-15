import { lazy, Suspense, useMemo } from 'react'
import { buildCityCategoryMatrix } from '../../domain/buildCityCategoryMatrix'
import { filterRecords } from '../../domain/filterRecords'
import { summarizeByCategory } from '../../domain/summarizeByCategory'
import { summarizeByCity } from '../../domain/summarizeByCity'
import { summarizeGapDistribution } from '../../domain/summarizeGapDistribution'
import { summarizeOverall } from '../../domain/summarizeOverall'
import type { DiscountRecord } from '../../domain/types'
import { useFilterStore } from '../../state/useFilterStore'
import { APP_SECTIONS, type AppSection } from '../../state/useNavigationStore'
import { CategoryAnalysisTable } from './CategoryAnalysisTable'
import { CityCategoryMatrixSection } from './CityCategoryMatrixSection'
import { CityRankingTable } from './CityRankingTable'
import { DetailedRecordsTable } from './DetailedRecordsTable'
import { ExportButton } from './ExportButton'
import { FilterBar } from './FilterBar'
import { GapSummaryPreview } from './GapSummaryPreview'
import { KpiCards } from './KpiCards'
import { MissingCategoriesSummary } from './MissingCategoriesSummary'
import { NoFilteredResults } from './NoFilteredResults'

// Recharts só é carregado quando o gráfico realmente aparece na tela, não no
// carregamento inicial da página.
const CityGapChart = lazy(() => import('./CityGapChart'))

const RECORD_BASED_SECTIONS: AppSection[] = [
  'visao-geral',
  'ranking-cidades',
  'analise-categoria',
  'tabela-detalhada',
]

interface DashboardProps {
  records: DiscountRecord[]
  activeSection: AppSection
}

/** Dashboard executivo: filtros, visão geral, ranking de cidades, análise por categoria e matriz — mostra uma seção por vez, escolhida pelo menu lateral. */
export function Dashboard({ records, activeSection }: DashboardProps) {
  const city = useFilterStore((state) => state.city)
  const categoryCode = useFilterStore((state) => state.categoryCode)
  const situation = useFilterStore((state) => state.situation)

  const fullMatrix = useMemo(() => buildCityCategoryMatrix(records), [records])

  // Cidade e Categoria escopam a matriz e as categorias ausentes também — filtrar
  // por Situação não faz sentido ali, pois "ausente" (sem registro) e "não bate com
  // a situação escolhida" (registro filtrado) ficariam visualmente indistinguíveis.
  const recordsForMatrix = useMemo(
    () => filterRecords(records, { city, categoryCode, situation: null }),
    [records, city, categoryCode],
  )
  const matrix = useMemo(() => buildCityCategoryMatrix(recordsForMatrix), [recordsForMatrix])

  const recordsForAnalysis = useMemo(
    () => filterRecords(records, { city, categoryCode, situation }),
    [records, city, categoryCode, situation],
  )

  const gapSummary = useMemo(() => summarizeGapDistribution(recordsForAnalysis), [recordsForAnalysis])
  const overall = useMemo(() => summarizeOverall(recordsForAnalysis), [recordsForAnalysis])
  const citySummaries = useMemo(() => summarizeByCity(recordsForAnalysis), [recordsForAnalysis])
  const categorySummaries = useMemo(() => summarizeByCategory(recordsForAnalysis), [recordsForAnalysis])

  const totalCities = new Set(recordsForAnalysis.map((record) => record.city)).size
  const totalCategories = new Set(recordsForAnalysis.map((record) => record.categoryCode)).size
  const unmatchedCount = recordsForAnalysis.filter((record) => record.situation === 'sem_par').length

  const sectionTitle = APP_SECTIONS.find((section) => section.id === activeSection)?.label ?? 'Dashboard'
  const isRecordBasedSection = RECORD_BASED_SECTIONS.includes(activeSection)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{sectionTitle}</h2>
        {recordsForAnalysis.length > 0 && (
          <ExportButton records={recordsForAnalysis} cities={citySummaries} categories={categorySummaries} />
        )}
      </div>

      <FilterBar fullMatrix={fullMatrix} visibleCount={recordsForAnalysis.length} totalCount={records.length} />

      {isRecordBasedSection &&
        (recordsForAnalysis.length === 0 ? (
          <NoFilteredResults />
        ) : (
          <>
            {activeSection === 'visao-geral' && (
              <>
                <KpiCards
                  totalCities={totalCities}
                  totalCategories={totalCategories}
                  totalRecords={recordsForAnalysis.length}
                  averageFidelity={overall.averageFidelity}
                  averageLimit={overall.averageLimit}
                  averageGap={gapSummary.averageGap}
                  inconsistencyCount={gapSummary.bySituation.inconsistencia.count}
                  unmatchedCount={unmatchedCount}
                />
                <GapSummaryPreview summary={gapSummary} />
                <Suspense fallback={<ChartLoadingPlaceholder />}>
                  <CityGapChart cities={citySummaries} />
                </Suspense>
              </>
            )}

            {activeSection === 'ranking-cidades' && <CityRankingTable cities={citySummaries} />}

            {activeSection === 'analise-categoria' && <CategoryAnalysisTable categories={categorySummaries} />}

            {activeSection === 'tabela-detalhada' && <DetailedRecordsTable records={recordsForAnalysis} />}
          </>
        ))}

      {activeSection === 'matriz' && <CityCategoryMatrixSection matrix={matrix} />}

      {activeSection === 'categorias-ausentes' && <MissingCategoriesSummary matrix={matrix} />}
    </div>
  )
}

function ChartLoadingPlaceholder() {
  return (
    <div className="flex h-48 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs text-slate-400">
      Carregando gráfico...
    </div>
  )
}
