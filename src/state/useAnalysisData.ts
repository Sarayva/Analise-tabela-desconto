import { useMemo } from 'react'
import { buildDiscountRecords } from '../domain/buildDiscountRecords'
import { buildDataQualityReport, type DataQualityReport } from '../validation/buildDataQualityReport'
import { useUploadStore } from './useUploadStore'
import type { DiscountRecord } from '../domain/types'

export interface AnalysisData {
  bothReady: boolean
  qualityReport: DataQualityReport | null
  records: DiscountRecord[] | null
}

/** Deriva o relatório de qualidade e os registros processados a partir do estado de upload — usado por qualquer tela que precise dos dados já cruzados. */
export function useAnalysisData(): AnalysisData {
  const fidelidade = useUploadStore((state) => state.fidelidade)
  const limite = useUploadStore((state) => state.limite)

  const bothReady = fidelidade.status === 'pronto' && limite.status === 'pronto'

  const qualityReport = useMemo(() => {
    if (!bothReady || !fidelidade.result || !limite.result) return null
    return buildDataQualityReport(fidelidade.result, limite.result)
  }, [bothReady, fidelidade.result, limite.result])

  const records = useMemo(() => {
    if (!qualityReport) return null
    return buildDiscountRecords(qualityReport.allPairs)
  }, [qualityReport])

  return { bothReady, qualityReport, records }
}
