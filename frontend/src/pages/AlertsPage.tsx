import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, CheckSquare, X } from 'lucide-react'
import { pageVariants, staggerContainer } from '../lib/motion'
import { Card } from '../components/ui/Card'
import { Badge, SeverityBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { DataTable, Column } from '../components/ui/DataTable'
import { ALERTS } from '../data/mockData'
import { Alert } from '../types'
import { formatDateShort } from '../lib/utils'

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low'] as const
const STATUSES = ['All', 'Open', 'In Progress', 'Closed', 'Acknowledged'] as const
const PAGE_SIZE = 25

export function AlertsPage() {
  const navigate = useNavigate()
  const [severityFilter, setSeverityFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [loading] = useState(false)

  const filtered = useMemo(() => {
    return ALERTS.filter(a => {
      const sev = severityFilter === 'All' || a.severity === severityFilter.toLowerCase()
      const st =
        statusFilter === 'All' ||
        a.status === statusFilter.toLowerCase().replace(' ', '_')
      return sev && st
    })
  }, [severityFilter, statusFilter])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const handleSelect = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  const handleSelectAll = () => {
    const ids = paginated.map(a => a.id)
    const allSelected = ids.every(id => selected.includes(id))
    if (allSelected) {
      setSelected(s => s.filter(id => !ids.includes(id)))
    } else {
      setSelected(s => [...new Set([...s, ...ids])])
    }
  }

  const columns: Column<Alert>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: 'w-28',
      render: (a) => <span className="font-mono text-mono-sm text-ss-text-muted">{a.id}</span>,
    },
    {
      key: 'severity',
      label: 'Severity',
      sortable: true,
      width: 'w-24',
      render: (a) => <SeverityBadge severity={a.severity} size="sm" showDot={a.status === 'open'} />,
    },
    {
      key: 'name',
      label: 'Alert Name',
      sortable: true,
      render: (a) => <span className="text-ss-text-primary">{a.name}</span>,
    },
    {
      key: 'sourceIp',
      label: 'Source IP',
      sortable: false,
      render: (a) => <span className="font-mono text-mono-sm text-ss-text-secondary">{a.sourceIp}</span>,
    },
    {
      key: 'destinationIp',
      label: 'Destination',
      sortable: false,
      render: (a) => <span className="font-mono text-mono-sm text-ss-text-secondary">{a.destinationIp}</span>,
    },
    {
      key: 'timestamp',
      label: 'Time',
      sortable: true,
      render: (a) => <span className="text-caption text-ss-text-muted">{formatDateShort(a.timestamp)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: 'w-32',
      render: (a) => (
        <Badge
          variant={
            a.status === 'open' ? 'critical'
            : a.status === 'in_progress' ? 'medium'
            : a.status === 'acknowledged' ? 'info'
            : 'success'
          }
          size="sm"
        >
          {a.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 'w-20',
      render: (a) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); navigate(`/alerts/${a.id}`) }}
        >
          View
        </Button>
      ),
    },
  ]

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h1 font-medium text-ss-text-primary">Alerts</h1>
          <p className="text-body text-ss-text-secondary mt-1">{filtered.length} alerts matching filters</p>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm" className="mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-ss-text-muted" />
            <span className="text-caption text-ss-text-secondary">Severity:</span>
            <div className="flex gap-1">
              {SEVERITIES.map(s => (
                <button
                  key={s}
                  onClick={() => { setSeverityFilter(s); setPage(1) }}
                  className={`px-2.5 py-1 text-caption rounded-ss-sm transition-colors ${
                    severityFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'text-ss-text-secondary hover:text-ss-text-primary hover:bg-ss-bg-elevated'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="w-px h-5 bg-ss-border" />
          <div className="flex items-center gap-2">
            <span className="text-caption text-ss-text-secondary">Status:</span>
            <div className="flex gap-1">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1) }}
                  className={`px-2.5 py-1 text-caption rounded-ss-sm transition-colors ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'text-ss-text-secondary hover:text-ss-text-primary hover:bg-ss-bg-elevated'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-3 px-4 py-2.5 bg-blue-900/20 border border-blue-800/40 rounded-ss-md"
        >
          <CheckSquare className="w-4 h-4 text-blue-400" />
          <span className="text-caption text-blue-400">{selected.length} selected</span>
          <div className="flex gap-2 ml-2">
            <Button variant="secondary" size="sm">Acknowledge</Button>
            <Button variant="secondary" size="sm">Close</Button>
            <Button variant="secondary" size="sm">Assign</Button>
          </div>
          <button
            onClick={() => setSelected([])}
            className="ml-auto text-ss-text-muted hover:text-ss-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Table */}
      <Card padding="none">
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <DataTable<Alert>
            columns={columns}
            data={paginated}
            onRowClick={(row) => navigate(`/alerts/${row.id}`)}
            loading={loading}
            emptyMessage="No alerts match the current filters"
            selectedIds={selected}
            onRowSelect={handleSelect}
            onSelectAll={handleSelectAll}
          />
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-ss-border">
            <p className="text-caption text-ss-text-muted">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-caption rounded-ss-sm transition-colors ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'text-ss-text-muted hover:text-ss-text-primary hover:bg-ss-bg-elevated'
                  }`}
                >
                  {p}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
