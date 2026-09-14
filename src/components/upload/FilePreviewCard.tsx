import type { UploadSlot } from '../../state/useUploadStore'

interface FilePreviewCardProps {
  title: string
  slot: UploadSlot
}

export function FilePreviewCard({ title, slot }: FilePreviewCardProps) {
  if (slot.status === 'vazio') return null

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>

      {slot.status === 'lendo' && (
        <p className="mt-2 text-sm text-slate-500">Lendo e identificando as colunas do arquivo...</p>
      )}

      {slot.status === 'erro' && slot.error && (
        <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <p className="font-medium">Erro de estrutura no arquivo</p>
          <p className="mt-1">{slot.error.message}</p>
        </div>
      )}

      {slot.status === 'pronto' && slot.result && (
        <div className="mt-3 flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryItem label="Cidades detectadas" value={slot.result.citiesDetected.length} />
            <SummaryItem label="Registros válidos" value={slot.result.rowCount} />
            <SummaryItem label="Linhas ignoradas" value={slot.result.skippedRowCount} warn={slot.result.skippedRowCount > 0} />
            <SummaryItem
              label="Cidade identificada por"
              value={slot.result.cityStrategy.mode === 'por_aba' ? 'nome da aba' : 'coluna'}
              small
            />
          </dl>

          <div className="text-xs text-slate-500">
            <p className="font-medium text-slate-600">Colunas identificadas:</p>
            <p>
              Código = "{slot.result.columnMapping.categoryCode}" · Categoria = "
              {slot.result.columnMapping.categoryDescription}" · Percentual = "
              {slot.result.columnMapping.percentage}"
              {slot.result.columnMapping.fidelityMaxPercentage
                ? ` · Referência (não usada no cálculo) = "${slot.result.columnMapping.fidelityMaxPercentage}"`
                : ''}
            </p>
          </div>

          {slot.result.skippedRowCount > 0 && (
            <p className="text-xs text-amber-700">
              {slot.result.skippedRowCount} linha(s) foram ignoradas por terem código, categoria ou
              percentual ausente. Os dados originais não foram alterados — essas linhas apenas não
              entram na análise.
            </p>
          )}

          <PreviewTable headers={slot.result.previewHeaders} rows={slot.result.previewRows} />
        </div>
      )}
    </div>
  )
}

function SummaryItem({
  label,
  value,
  warn,
  small,
}: {
  label: string
  value: string | number
  warn?: boolean
  small?: boolean
}) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd
        className={`${small ? 'text-sm font-medium' : 'text-lg font-semibold'} ${warn ? 'text-amber-600' : 'text-slate-800'}`}
      >
        {value}
      </dd>
    </div>
  )
}

function PreviewTable({ headers, rows }: { headers: string[]; rows: Record<string, unknown>[] }) {
  if (rows.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-medium text-slate-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header} className="px-3 py-2 text-slate-700">
                  {String(row[header] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
