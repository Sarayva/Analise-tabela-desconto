import { useState } from 'react'
import type { CategorySummary } from '../../domain/summarizeByCategory'
import type { CitySummary } from '../../domain/summarizeByCity'
import type { DiscountRecord } from '../../domain/types'
import { exportDashboardToExcel } from '../../export/exportDashboardToExcel'

interface ExportButtonProps {
  records: DiscountRecord[]
  cities: CitySummary[]
  categories: CategorySummary[]
}

export function ExportButton({ records, cities, categories }: ExportButtonProps) {
  const [status, setStatus] = useState<'ocioso' | 'exportando' | 'erro'>('ocioso')

  async function handleClick() {
    setStatus('exportando')
    try {
      await exportDashboardToExcel({ records, cities, categories })
      setStatus('ocioso')
    } catch {
      setStatus('erro')
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'exportando'}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        title="Baixa um Excel com o recorte atual: dados filtrados, ranking de cidades, ranking de categorias e inconsistências, cada um em sua própria aba."
      >
        {status === 'exportando' ? 'Gerando arquivo...' : 'Exportar para Excel'}
      </button>
      {status === 'erro' && (
        <p className="text-xs text-red-600">Não foi possível gerar o arquivo. Tente novamente.</p>
      )}
    </div>
  )
}
