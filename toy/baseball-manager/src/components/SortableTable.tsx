import { useMemo, useState, type ReactNode } from 'react'

export type SortValue = string | number | boolean | null | undefined
export type SortDirection = 'asc' | 'desc'

export interface SortConfig<Key extends string> {
  key: Key
  direction: SortDirection
}

type SortAccessors<Row, Key extends string> = Record<Key, (row: Row) => SortValue>

const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

function compareValues(a: SortValue, b: SortValue): number {
  const aMissing = a === null || a === undefined || a === ''
  const bMissing = b === null || b === undefined || b === ''
  if (aMissing && bMissing) return 0
  if (aMissing) return 1
  if (bMissing) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  return collator.compare(String(a), String(b))
}

export function useSortableRows<Row, Key extends string>(
  rows: readonly Row[],
  accessors: SortAccessors<Row, Key>,
  initialSort?: SortConfig<Key>,
) {
  const [sort, setSort] = useState<SortConfig<Key> | null>(initialSort ?? null)

  const sortedRows = useMemo(() => {
    if (!sort) return [...rows]
    const accessor = accessors[sort.key]
    return rows
      .map((row, index) => ({ row, index, value: accessor(row) }))
      .sort((a, b) => {
        const aMissing = a.value === null || a.value === undefined || a.value === ''
        const bMissing = b.value === null || b.value === undefined || b.value === ''
        if (aMissing !== bMissing) return aMissing ? 1 : -1
        const compared = compareValues(a.value, b.value)
        return compared === 0
          ? a.index - b.index
          : sort.direction === 'asc' ? compared : -compared
      })
      .map(({ row }) => row)
  }, [accessors, rows, sort])

  const requestSort = (key: Key) => {
    setSort((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return { sortedRows, sort, requestSort }
}

export function useTableSort<Key extends string>(initialSort?: SortConfig<Key>) {
  const [sort, setSort] = useState<SortConfig<Key> | null>(initialSort ?? null)
  const requestSort = (key: Key) => {
    setSort((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }
  return { sort, requestSort }
}

export function sortRows<Row, Key extends string>(
  rows: readonly Row[],
  accessors: SortAccessors<Row, Key>,
  sort: SortConfig<Key> | null,
): Row[] {
  if (!sort) return [...rows]
  const accessor = accessors[sort.key]
  return rows
    .map((row, index) => ({ row, index, value: accessor(row) }))
    .sort((a, b) => {
      const aMissing = a.value === null || a.value === undefined || a.value === ''
      const bMissing = b.value === null || b.value === undefined || b.value === ''
      if (aMissing !== bMissing) return aMissing ? 1 : -1
      const compared = compareValues(a.value, b.value)
      return compared === 0
        ? a.index - b.index
        : sort.direction === 'asc' ? compared : -compared
    })
    .map(({ row }) => row)
}

interface SortableHeaderProps<Key extends string> {
  column: Key
  children: ReactNode
  sort: SortConfig<Key> | null
  onSort: (key: Key) => void
  className?: string
}

export function SortableHeader<Key extends string>({
  column,
  children,
  sort,
  onSort,
  className,
}: SortableHeaderProps<Key>) {
  const active = sort?.key === column
  const ariaSort = active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'

  return (
    <th className={className} aria-sort={ariaSort}>
      <button type="button" className="bm-sort-header" onClick={() => onSort(column)}>
        <span>{children}</span>
        <span className="bm-sort-indicator" aria-hidden="true">
          {active ? (sort.direction === 'asc' ? '▲' : '▼') : '↕'}
        </span>
      </button>
    </th>
  )
}
