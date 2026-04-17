import { useState } from 'react'
import { ChevronsUpDown, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { staggerItem } from '../../lib/motion'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  width?: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T extends object> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
  selectedIds?: string[]
  onRowSelect?: (id: string) => void
  onSelectAll?: () => void
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-ss-border-muted">
      <td className="px-4 py-3">
        <div className="skeleton h-4 w-4 rounded" />
      </td>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className={cn('skeleton h-4 rounded', i === 0 ? 'w-32' : 'w-24')} />
        </td>
      ))}
    </tr>
  )
}

function getField(row: object, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

export function DataTable<T extends object>({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = 'No data found',
  className,
  selectedIds = [],
  onRowSelect,
  onSelectAll,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const av = getField(a, sortKey)
    const bv = getField(b, sortKey)
    if (av == null || bv == null) return 0
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  const allSelected =
    data.length > 0 &&
    data.every(d => selectedIds.includes(String(getField(d, 'id'))))

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-ss-border">
            {onRowSelect && (
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-ss-border bg-ss-bg-elevated accent-ss-accent-blue cursor-pointer"
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-caption font-medium text-ss-text-secondary whitespace-nowrap',
                  col.width && col.width,
                  col.sortable && 'cursor-pointer hover:text-ss-text-primary select-none'
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="text-ss-text-muted">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onRowSelect ? 1 : 0)}
                className="px-4 py-16 text-center"
              >
                <div className="flex flex-col items-center gap-3 text-ss-text-muted">
                  <AlertCircle className="w-8 h-8" />
                  <p className="text-body">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            sorted.map((row, idx) => {
              const id = String(getField(row, 'id') ?? idx)
              const isSelected = selectedIds.includes(id)
              return (
                <motion.tr
                  key={id}
                  variants={staggerItem}
                  className={cn(
                    'border-b border-ss-border-muted transition-colors duration-100',
                    onRowClick && 'cursor-pointer hover:bg-ss-bg-elevated',
                    isSelected && 'bg-blue-900/10'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {onRowSelect && (
                    <td
                      className="px-4 py-3"
                      onClick={e => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onRowSelect(id)}
                        className="w-4 h-4 rounded border-ss-border bg-ss-bg-elevated accent-ss-accent-blue cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-body text-ss-text-primary">
                      {col.render
                        ? col.render(row)
                        : String(getField(row, col.key) ?? '')}
                    </td>
                  ))}
                </motion.tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
