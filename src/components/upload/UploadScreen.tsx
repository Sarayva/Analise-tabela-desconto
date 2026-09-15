import { useMemo } from 'react'
import { SOURCE_FILE_LABEL } from '../../config/fileFormat'
import { applyStoreOverrides } from '../../domain/applyStoreOverrides'
import { useAnalysisData } from '../../state/useAnalysisData'
import { useStoreDirectoryStore } from '../../state/useStoreDirectoryStore'
import { useStoreOverridesStore } from '../../state/useStoreOverridesStore'
import { useUploadStore } from '../../state/useUploadStore'
import { findStoreAssignmentProblems } from '../../validation/findStoreAssignmentProblems'
import { QualitySummary } from '../quality/QualitySummary'
import { StoreAssignmentAlert } from '../quality/StoreAssignmentAlert'
import { FileDropZone } from './FileDropZone'
import { FilePreviewCard } from './FilePreviewCard'

export function UploadScreen() {
  const fidelidade = useUploadStore((state) => state.fidelidade)
  const limite = useUploadStore((state) => state.limite)
  const loadFile = useUploadStore((state) => state.loadFile)

  const storeDirectory = useStoreDirectoryStore()
  const overrides = useStoreOverridesStore((state) => state.overrides)

  const { qualityReport } = useAnalysisData()

  const combinedAssignments = useMemo(
    () => [...(fidelidade.result?.storeAssignments ?? []), ...(limite.result?.storeAssignments ?? [])],
    [fidelidade.result, limite.result],
  )

  const storeAssignmentProblems = useMemo(() => {
    if (combinedAssignments.length === 0) return []
    const withOverrides = applyStoreOverrides(combinedAssignments, overrides)
    return findStoreAssignmentProblems(withOverrides, storeDirectory.entries)
  }, [combinedAssignments, overrides, storeDirectory.entries])

  const availableTabelas = useMemo(
    () =>
      Array.from(new Set([...(fidelidade.result?.citiesDetected ?? []), ...(limite.result?.citiesDetected ?? [])])).sort(
        (a, b) => a.localeCompare(b, 'pt-BR'),
      ),
    [fidelidade.result, limite.result],
  )

  return (
    <div className="flex w-full flex-col gap-6 text-left">
      <div className="grid gap-6 sm:grid-cols-3">
        <FileDropZone
          label={SOURCE_FILE_LABEL.fidelidade}
          description="Desconto praticado/inicial. Pode selecionar mais de um arquivo (ex.: lojas de fora + Maringá)."
          status={fidelidade.status}
          fileNames={fidelidade.fileNames}
          multiple
          onFilesSelected={(files) => loadFile('fidelidade', files)}
        />
        <FileDropZone
          label={SOURCE_FILE_LABEL.limite}
          description="Desconto máximo permitido. Pode selecionar mais de um arquivo (ex.: lojas de fora + Maringá)."
          status={limite.status}
          fileNames={limite.fileNames}
          multiple
          onFilesSelected={(files) => loadFile('limite', files)}
        />
        <FileDropZone
          label="Lista de lojas"
          description="Arquivo .txt com código, nome e cidade de cada loja — usado para validar se alguma loja está na tabela de desconto errada."
          status={storeDirectory.status}
          fileNames={storeDirectory.fileName ? [storeDirectory.fileName] : []}
          acceptedExtensions={['.txt']}
          onFilesSelected={(files) => storeDirectory.loadFile(files[0])}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FilePreviewCard title={SOURCE_FILE_LABEL.fidelidade} slot={fidelidade} />
        <FilePreviewCard title={SOURCE_FILE_LABEL.limite} slot={limite} />
      </div>

      {storeDirectory.status === 'erro' && storeDirectory.error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Lista de lojas: {storeDirectory.error.message}
        </p>
      )}

      <StoreAssignmentAlert problems={storeAssignmentProblems} availableTabelas={availableTabelas} />

      {qualityReport && <QualitySummary report={qualityReport} />}
    </div>
  )
}
