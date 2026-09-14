import { useMemo } from 'react'
import { SOURCE_FILE_LABEL } from '../../config/fileFormat'
import { buildDiscountRecords } from '../../domain/buildDiscountRecords'
import { useUploadStore } from '../../state/useUploadStore'
import { buildDataQualityReport } from '../../validation/buildDataQualityReport'
import { Dashboard } from '../dashboard/Dashboard'
import { QualitySummary } from '../quality/QualitySummary'
import { FileDropZone } from './FileDropZone'
import { FilePreviewCard } from './FilePreviewCard'

export function UploadScreen() {
  const fidelidade = useUploadStore((state) => state.fidelidade)
  const limite = useUploadStore((state) => state.limite)
  const loadFile = useUploadStore((state) => state.loadFile)

  const bothReady = fidelidade.status === 'pronto' && limite.status === 'pronto'

  const qualityReport = useMemo(() => {
    if (!bothReady || !fidelidade.result || !limite.result) return null
    return buildDataQualityReport(fidelidade.result, limite.result)
  }, [bothReady, fidelidade.result, limite.result])

  const records = useMemo(() => {
    if (!qualityReport) return null
    return buildDiscountRecords(qualityReport.allPairs)
  }, [qualityReport])

  return (
    <div className="flex w-full max-w-5xl flex-col gap-6 text-left">
      <div className="grid gap-6 sm:grid-cols-2">
        <FileDropZone
          label={SOURCE_FILE_LABEL.fidelidade}
          description="Desconto praticado/inicial concedido ao cliente."
          status={fidelidade.status}
          fileName={fidelidade.fileName}
          onFileSelected={(file) => loadFile('fidelidade', file)}
        />
        <FileDropZone
          label={SOURCE_FILE_LABEL.limite}
          description="Desconto máximo que a loja pode conceder."
          status={limite.status}
          fileName={limite.fileName}
          onFileSelected={(file) => loadFile('limite', file)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FilePreviewCard title={SOURCE_FILE_LABEL.fidelidade} slot={fidelidade} />
        <FilePreviewCard title={SOURCE_FILE_LABEL.limite} slot={limite} />
      </div>

      {qualityReport && <QualitySummary report={qualityReport} />}
      {records && <Dashboard records={records} />}
    </div>
  )
}
