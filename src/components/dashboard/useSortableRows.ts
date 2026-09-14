import { useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

/** Ordena uma lista de linhas por uma coluna clicável, com nulos sempre por último. */
export function useSortableRows<T, K extends keyof T>(
  rows: T[],
  initialKey: K,
  initialDirection: SortDirection = 'desc',
) {
  const [sortKey, setSortKey] = useState<K>(initialKey)
  const [direction, setDirection] = useState<SortDirection>(initialDirection)

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => compareValues(a[sortKey], b[sortKey], direction))
  }, [rows, sortKey, direction])

  function toggleSort(key: K) {
    if (key === sortKey) {
      setDirection((previous) => (previous === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setDirection('desc')
    }
  }

  return { sorted, sortKey, direction, toggleSort }
}

function compareValues(a: unknown, b: unknown, direction: SortDirection): number {
  const aIsNil = a === null || a === undefined
  const bIsNil = b === null || b === undefined
  if (aIsNil && bIsNil) return 0
  if (aIsNil) return 1
  if (bIsNil) return -1

  const result =
    typeof a === 'number' && typeof b === 'number'
      ? a - b
      : String(a).localeCompare(String(b), 'pt-BR')

  return direction === 'asc' ? result : -result
}
