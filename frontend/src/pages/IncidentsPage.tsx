import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Clock, User, Server } from 'lucide-react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import { pageVariants, staggerContainer, staggerItem } from '../lib/motion'
import { Card } from '../components/ui/Card'
import { Badge, SeverityBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { INCIDENTS } from '../data/mockData'
import { Incident, IncidentStatus } from '../types'
import { getRelativeTime } from '../lib/utils'

const COLUMNS: { id: IncidentStatus; label: string; color: string }[] = [
  { id: 'open', label: 'Open', color: 'text-red-400' },
  { id: 'investigating', label: 'Investigating', color: 'text-amber-400' },
  { id: 'contained', label: 'Contained', color: 'text-blue-400' },
  { id: 'closed', label: 'Closed', color: 'text-green-400' },
]

function KanbanCard({ incident, isDragging = false }: { incident: Incident; isDragging?: boolean }) {
  return (
    <div className={`bg-ss-bg-elevated border border-ss-border rounded-ss-md p-3 flex flex-col gap-2.5 ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[11px] text-ss-text-muted">{incident.id}</span>
        <SeverityBadge severity={incident.severity} size="sm" />
      </div>
      <p className="text-caption font-medium text-ss-text-primary leading-snug">{incident.title}</p>
      <div className="flex items-center gap-3 text-[11px] text-ss-text-muted">
        <span className="flex items-center gap-1"><User className="w-3 h-3" />{incident.assignedTo.split(' ')[0]}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{getRelativeTime(incident.createdAt)}</span>
        <span className="flex items-center gap-1"><Server className="w-3 h-3" />{incident.affectedAssets.length}</span>
      </div>
    </div>
  )
}

function DraggableCard({ incident }: { incident: Incident }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: incident.id,
  })
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing touch-none">
      <KanbanCard incident={incident} isDragging={isDragging} />
    </div>
  )
}

function DroppableColumn({ col, incidents }: { col: typeof COLUMNS[0]; incidents: Incident[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-2 min-h-[200px] p-2 rounded-ss-md transition-colors ${isOver ? 'bg-blue-900/10' : ''}`}
    >
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-2">
        {incidents.map(incident => (
          <motion.div key={incident.id} variants={staggerItem}>
            <DraggableCard incident={incident} />
          </motion.div>
        ))}
        {incidents.length === 0 && (
          <p className="text-caption text-ss-text-muted text-center py-8">No incidents</p>
        )}
      </motion.div>
    </div>
  )
}

export function IncidentsPage() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState<Incident[]>(INCIDENTS)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const grouped = COLUMNS.reduce<Record<IncidentStatus, Incident[]>>((acc, col) => {
    acc[col.id] = incidents.filter(i => i.status === col.id)
    return acc
  }, { open: [], investigating: [], contained: [], closed: [] })

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over) return
    const newStatus = over.id as IncidentStatus
    setIncidents(prev =>
      prev.map(inc => inc.id === String(active.id) ? { ...inc, status: newStatus, updatedAt: new Date() } : inc)
    )
  }

  const activeIncident = incidents.find(i => i.id === activeId)

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h1 font-medium text-ss-text-primary">Incidents</h1>
          <p className="text-body text-ss-text-secondary mt-1">{incidents.length} total incidents</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={() => navigate('/incidents/new')}>
          New Incident
        </Button>
      </div>

      {/* Kanban board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex flex-col">
              {/* Column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`text-h4 font-medium ${col.color}`}>{col.label}</span>
                  <span className="text-caption text-ss-text-muted bg-ss-bg-elevated border border-ss-border px-1.5 py-0.5 rounded-full">
                    {grouped[col.id].length}
                  </span>
                </div>
              </div>
              <Card padding="sm" className="flex-1 min-h-[400px]">
                <DroppableColumn col={col} incidents={grouped[col.id]} />
              </Card>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeIncident ? <KanbanCard incident={activeIncident} /> : null}
        </DragOverlay>
      </DndContext>
    </motion.div>
  )
}
