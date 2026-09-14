import type { DataQualityReport } from '../../validation/buildDataQualityReport'
import { DetailTable } from './DetailTable'
import { QualityCheckItem } from './QualityCheckItem'

interface QualitySummaryProps {
  report: DataQualityReport
}

const OUTLIER_REASON_LABEL: Record<string, string> = {
  negativo: 'negativo',
  acima_de_100: 'acima de 100%',
}

export function QualitySummary({ report }: QualitySummaryProps) {
  const totalSkippedRows = report.skippedRowsInFidelity + report.skippedRowsInLimit
  const totalDuplicates = report.duplicatesInFidelity.length + report.duplicatesInLimit.length

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-800">Dados analisados</h2>

      <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Cidades" value={report.totalCities} />
        <Kpi label="Categorias" value={report.totalCategories} />
        <Kpi label="Combinações Cidade + Categoria" value={report.totalCombinations} />
        <Kpi label="Com Fidelidade e Limite" value={report.matchedCombinations.length} />
      </dl>

      <h3 className="mt-5 text-sm font-semibold text-slate-700">Qualidade dos dados</h3>
      <div className="flex flex-col divide-y divide-slate-100 border-t border-slate-100">
        <QualityCheckItem
          ok={totalSkippedRows === 0}
          okLabel="Nenhuma linha ignorada por campo obrigatório ausente"
          problemLabel="linha(s) ignoradas por campo obrigatório ausente (código, categoria ou percentual)"
          count={totalSkippedRows}
          description="Contabilizado durante a leitura dos arquivos; os dados originais não foram alterados."
        />

        <QualityCheckItem
          ok={totalDuplicates === 0}
          okLabel="Nenhuma combinação Cidade + Categoria repetida dentro do mesmo arquivo"
          problemLabel="combinação(ões) Cidade + Categoria repetida(s) dentro do mesmo arquivo"
          count={totalDuplicates}
        >
          <DetailTable
            items={[...report.duplicatesInFidelity, ...report.duplicatesInLimit]}
            columns={[
              { header: 'Cidade', render: (item) => item.city },
              { header: 'Categoria', render: (item) => item.categoryDescription },
              { header: 'Ocorrências', render: (item) => item.occurrences },
            ]}
          />
        </QualityCheckItem>

        <QualityCheckItem
          ok={report.onlyInFidelity.length === 0}
          okLabel="Nenhuma combinação presente apenas no arquivo Desconto Fidelidade"
          problemLabel="combinação(ões) presente(s) apenas no arquivo Desconto Fidelidade (sem correspondente no Limite)"
          count={report.onlyInFidelity.length}
        >
          <DetailTable
            items={report.onlyInFidelity}
            columns={[
              { header: 'Cidade', render: (item) => item.city },
              { header: 'Categoria', render: (item) => item.categoryDescription },
              { header: 'Fidelidade', render: (item) => `${item.fidelityPercentage}%` },
            ]}
          />
        </QualityCheckItem>

        <QualityCheckItem
          ok={report.onlyInLimit.length === 0}
          okLabel="Nenhuma combinação presente apenas no arquivo Desconto Limite"
          problemLabel="combinação(ões) presente(s) apenas no arquivo Desconto Limite (sem correspondente na Fidelidade)"
          count={report.onlyInLimit.length}
        >
          <DetailTable
            items={report.onlyInLimit}
            columns={[
              { header: 'Cidade', render: (item) => item.city },
              { header: 'Categoria', render: (item) => item.categoryDescription },
              { header: 'Limite', render: (item) => `${item.limitPercentage}%` },
            ]}
          />
        </QualityCheckItem>

        <QualityCheckItem
          ok={report.percentageOutliers.length === 0}
          okLabel="Nenhum percentual fora da faixa esperada (0 a 100%)"
          problemLabel="percentual(is) fora da faixa esperada (negativo ou acima de 100%)"
          count={report.percentageOutliers.length}
        >
          <DetailTable
            items={report.percentageOutliers}
            columns={[
              { header: 'Cidade', render: (item) => item.city },
              { header: 'Categoria', render: (item) => item.categoryDescription },
              { header: 'Percentual', render: (item) => `${item.percentage}%` },
              { header: 'Motivo', render: (item) => OUTLIER_REASON_LABEL[item.reason] },
            ]}
          />
        </QualityCheckItem>

        <QualityCheckItem
          ok={report.cityNameVariants.length === 0}
          okLabel="Nenhuma cidade com grafia divergente entre os dois arquivos"
          problemLabel="possível(is) cidade(s) com grafia diferente entre os dois arquivos"
          count={report.cityNameVariants.length}
          description="Isso não é corrigido automaticamente — verifique se são a mesma cidade escrita de formas diferentes."
        >
          <DetailTable
            items={report.cityNameVariants}
            columns={[
              { header: 'No arquivo Fidelidade', render: (item) => item.cityA },
              { header: 'No arquivo Limite', render: (item) => item.cityB },
            ]}
          />
        </QualityCheckItem>
      </div>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-lg font-semibold text-slate-800">{value}</dd>
    </div>
  )
}
