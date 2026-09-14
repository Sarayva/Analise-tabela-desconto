import type { ReactNode } from 'react'

interface QualityCheckItemProps {
  ok: boolean
  /** Frase usada quando há ocorrências — ex.: "combinação(ões) presente(s) apenas no arquivo X". A contagem é adicionada na frente automaticamente. */
  problemLabel: string
  /** Frase usada quando não há nenhuma ocorrência — ex.: "Nenhuma combinação presente apenas em um arquivo". */
  okLabel: string
  count: number
  description?: string
  children?: ReactNode
}

/** Uma linha do checklist de qualidade: ✓ quando não há ocorrências, ⚠ com contagem e detalhe expansível caso haja. */
export function QualityCheckItem({ ok, problemLabel, okLabel, count, description, children }: QualityCheckItemProps) {
  return (
    <div className="py-3">
      <div className="flex items-start gap-2">
        <span className={ok ? 'text-emerald-600' : 'text-amber-600'} aria-hidden="true">
          {ok ? '✓' : '⚠'}
        </span>
        <div className="flex-1">
          <p className="text-sm text-slate-700">{ok ? okLabel : `${count} ${problemLabel}`}</p>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      </div>

      {!ok && children && (
        <details className="mt-2 ml-6">
          <summary className="cursor-pointer text-xs text-blue-600">Ver detalhes</summary>
          <div className="mt-2">{children}</div>
        </details>
      )}
    </div>
  )
}
