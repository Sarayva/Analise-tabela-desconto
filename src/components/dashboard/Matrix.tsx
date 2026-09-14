export interface MatrixAxisItem {
  key: string
  label: string
}

interface MatrixProps<T> {
  /** Eixo com mais itens — melhor como linha, com scroll vertical. */
  rows: MatrixAxisItem[]
  /** Eixo com menos itens — melhor como coluna, sem precisar de scroll horizontal. */
  columns: MatrixAxisItem[]
  getCell: (rowKey: string, columnKey: string) => T | undefined
  cellColor: (cell: T | undefined) => string
  cellTitle: (row: MatrixAxisItem, column: MatrixAxisItem, cell: T | undefined) => string
  onCellClick?: (row: MatrixAxisItem, column: MatrixAxisItem, cell: T | undefined) => void
  cellSize?: number
  maxHeight?: number
}

/** Grade genérica Linha x Coluna com célula colorida — usada para os heatmaps e a matriz de presença. */
export function Matrix<T>({
  rows,
  columns,
  getCell,
  cellColor,
  cellTitle,
  onCellClick,
  cellSize = 22,
  maxHeight = 480,
}: MatrixProps<T>) {
  return (
    <div className="overflow-auto rounded-md border border-slate-200" style={{ maxHeight }}>
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th className="sticky top-0 left-0 z-20 bg-white px-2 py-1" />
            {columns.map((column) => (
              <th
                key={column.key}
                className="sticky top-0 z-10 bg-white px-1 py-1 text-left font-medium text-slate-600"
                style={{ width: cellSize, minWidth: cellSize }}
                title={column.label}
              >
                <span className="block truncate" style={{ maxWidth: cellSize + 8 }}>
                  {column.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th
                scope="row"
                className="sticky left-0 z-10 min-w-[160px] max-w-[260px] truncate bg-white px-2 py-0.5 text-left font-normal text-slate-700"
                title={row.label}
              >
                {row.label}
              </th>
              {columns.map((column) => {
                const cell = getCell(row.key, column.key)
                return (
                  <td
                    key={column.key}
                    role={onCellClick ? 'button' : undefined}
                    tabIndex={onCellClick ? 0 : undefined}
                    onClick={onCellClick ? () => onCellClick(row, column, cell) : undefined}
                    onKeyDown={
                      onCellClick
                        ? (event) => {
                            if (event.key === 'Enter' || event.key === ' ') onCellClick(row, column, cell)
                          }
                        : undefined
                    }
                    title={cellTitle(row, column, cell)}
                    style={{ width: cellSize, height: cellSize, backgroundColor: cellColor(cell) }}
                    className={`border border-white ${onCellClick ? 'cursor-pointer' : ''}`}
                  />
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
