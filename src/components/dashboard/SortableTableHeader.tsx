interface SortableTableHeaderProps<K extends string> {
  label: string
  columnKey: K
  sortKey: K
  direction: 'asc' | 'desc'
  onSort: (key: K) => void
}

export function SortableTableHeader<K extends string>({
  label,
  columnKey,
  sortKey,
  direction,
  onSort,
}: SortableTableHeaderProps<K>) {
  const active = columnKey === sortKey
  return (
    <th className="px-3 py-2 text-xs font-medium text-slate-600">
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className="flex items-center gap-1 whitespace-nowrap hover:text-slate-900"
      >
        {label}
        {active && <span aria-hidden="true">{direction === 'asc' ? '▲' : '▼'}</span>}
      </button>
    </th>
  )
}
