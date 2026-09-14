const MAX_VISIBLE_ROWS = 10

interface DetailTableProps<T> {
  items: T[]
  columns: { header: string; render: (item: T) => string | number }[]
}

/** Tabela compacta de exemplos para um item de qualidade, truncada para não sobrecarregar a tela. */
export function DetailTable<T>({ items, columns }: DetailTableProps<T>) {
  const visible = items.slice(0, MAX_VISIBLE_ROWS)
  const hiddenCount = items.length - visible.length

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className="px-3 py-1.5 font-medium text-slate-600">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {visible.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.header} className="px-3 py-1.5 text-slate-700">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {hiddenCount > 0 && (
        <p className="border-t border-slate-200 px-3 py-1.5 text-xs text-slate-500">
          e mais {hiddenCount} {hiddenCount === 1 ? 'ocorrência' : 'ocorrências'}.
        </p>
      )}
    </div>
  )
}
