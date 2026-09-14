import { useId, useRef, useState } from 'react'
import { ACCEPTED_EXTENSIONS } from '../../config/fileFormat'
import type { UploadSlotStatus } from '../../state/useUploadStore'

interface FileDropZoneProps {
  label: string
  description: string
  status: UploadSlotStatus
  fileName: string | null
  onFileSelected: (file: File) => void
}

const STATUS_TEXT: Record<UploadSlotStatus, string> = {
  vazio: 'Nenhum arquivo selecionado',
  lendo: 'Lendo arquivo...',
  pronto: 'Arquivo carregado',
  erro: 'Não foi possível processar o arquivo',
}

export function FileDropZone({ label, description, status, fileName, onFileSelected }: FileDropZoneProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (file) onFileSelected(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDraggingOver(true)
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDraggingOver(false)
          handleFiles(event.dataTransfer.files)
        }}
        className={`flex flex-col items-center gap-1 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDraggingOver
            ? 'border-blue-400 bg-blue-50'
            : status === 'erro'
              ? 'border-red-300 bg-red-50'
              : status === 'pronto'
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <span className="text-sm font-medium text-slate-700">
          Arraste o arquivo aqui ou clique para selecionar
        </span>
        <span className="text-xs text-slate-500">
          Formatos aceitos: {ACCEPTED_EXTENSIONS.join(', ')}
        </span>
      </button>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <p className="text-xs text-slate-500">{description}</p>

      <p
        className={`text-sm ${
          status === 'erro' ? 'text-red-600' : status === 'pronto' ? 'text-emerald-600' : 'text-slate-500'
        }`}
      >
        {STATUS_TEXT[status]}
        {fileName ? ` — ${fileName}` : ''}
      </p>
    </div>
  )
}
