import { useState } from 'react'
import { Plus, CheckSquare, Clock, AlertCircle, ChevronRight, Calendar } from 'lucide-react'
import { mockTareas, mockAbogados, mockCausas, tareaConRelaciones } from '@/lib/mockData'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { TareaEstado, TareaPrioridad } from '@/types/database'
import MobileHeader from '@/components/layout/MobileHeader'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Sheet from '@/components/ui/Sheet'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'

const columnas: { estado: TareaEstado; label: string; color: string; bg: string; icon: typeof Clock }[] = [
  { estado: 'pendiente',  label: 'Pendiente',   color: 'text-slate-500 dark:text-slate-400',   bg: 'bg-slate-100 dark:bg-slate-800',   icon: Clock        },
  { estado: 'en_proceso', label: 'En proceso',  color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-100 dark:bg-amber-900/30', icon: AlertCircle  },
  { estado: 'finalizado', label: 'Finalizado',  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckSquare },
]

const prioridadColor: Record<TareaPrioridad, string> = {
  alta:  'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40',
  media: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40',
  baja:  'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
}

const avatarColors = [
  'from-primary-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
]

function initials(name: string) {
  return name.split(' ').filter(w => /^[A-ZÁÉÍÓÚÑ]/i.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function NuevaTareaForm({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const [form, setForm] = useState({
    titulo:            '',
    descripcion:       '',
    estado:            'pendiente' as TareaEstado,
    prioridad:         'media' as TareaPrioridad,
    asignado_a:        '',
    causa_id:          '',
    fecha_vencimiento: '',
  })
  function set(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  return (
    <form onSubmit={e => { e.preventDefault(); toast.success('Tarea creada', 'La tarea fue asignada correctamente.'); onClose() }} className="space-y-4">
      <Input
        label="Título *"
        required
        value={form.titulo}
        onChange={e => set('titulo', e.target.value)}
        placeholder="Preparar escrito de demanda..."
      />
      <Textarea
        label="Descripción"
        rows={2}
        value={form.descripcion}
        onChange={e => set('descripcion', e.target.value)}
        placeholder="Detalles de la tarea..."
      />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Estado" value={form.estado} onChange={e => set('estado', e.target.value)}>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="finalizado">Finalizado</option>
        </Select>
        <Select label="Prioridad" value={form.prioridad} onChange={e => set('prioridad', e.target.value)}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </Select>
        <Select label="Asignar a" value={form.asignado_a} onChange={e => set('asignado_a', e.target.value)}>
          <option value="">Sin asignar</option>
          {mockAbogados.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
        </Select>
        <Input
          label="Fecha límite"
          type="date"
          value={form.fecha_vencimiento}
          onChange={e => set('fecha_vencimiento', e.target.value)}
        />
      </div>
      <Select label="Causa vinculada" value={form.causa_id} onChange={e => set('causa_id', e.target.value)}>
        <option value="">Sin causa</option>
        {mockCausas.filter(c => c.estado === 'activa').map(c =>
          <option key={c.id} value={c.id}>{c.numero_expediente} — {c.caratula.slice(0, 50)}</option>
        )}
      </Select>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Crear tarea</Button>
      </div>
    </form>
  )
}

function TareaCard({ tarea }: { tarea: ReturnType<typeof tareaConRelaciones> }) {
  const abIdx = mockAbogados.findIndex(a => a.id === tarea.asignado_a)
  const diasRestantes = tarea.fecha_vencimiento
    ? Math.ceil((new Date(tarea.fecha_vencimiento).getTime() - Date.now()) / 86400000)
    : null

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug flex-1">{tarea.titulo}</p>
        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0', prioridadColor[tarea.prioridad])}>
          {tarea.prioridad}
        </span>
      </div>

      {tarea.descripcion && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{tarea.descripcion}</p>
      )}

      {tarea.causa && (
        <div className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-mono font-medium">
          <ChevronRight className="w-3 h-3" />
          {tarea.causa.numero_expediente}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {tarea.asignado ? (
            <div className="flex items-center gap-1.5">
              <div className={cn(
                'w-5 h-5 rounded-full bg-gradient-to-br text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0',
                avatarColors[abIdx % avatarColors.length]
              )}>
                {initials(tarea.asignado.full_name)}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                {tarea.asignado.full_name.split(' ').slice(-1)[0]}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-300 dark:text-slate-600">Sin asignar</span>
          )}
        </div>

        {diasRestantes !== null && (
          <div className={cn('flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md',
            diasRestantes < 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
            diasRestantes <= 2 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
            'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          )}>
            <Calendar className="w-2.5 h-2.5" />
            {diasRestantes < 0 ? 'Vencida' : diasRestantes === 0 ? 'Hoy' : `${diasRestantes}d`}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TareasPage() {
  const isMobile = useIsMobile()
  const [showForm, setShowForm] = useState(false)
  const [filtroAsignado, setFiltroAsignado] = useState('')

  const todas = mockTareas.map(tareaConRelaciones)
  const filtradas = filtroAsignado ? todas.filter(t => t.asignado_a === filtroAsignado) : todas

  const porEstado = (estado: TareaEstado) => filtradas.filter(t => t.estado === estado)

  if (isMobile) {
    return (
      <div>
        <MobileHeader
          title="Tareas"
          action={
            <button onClick={() => setShowForm(true)} className="touch-target w-[44px] h-[44px] flex items-center justify-center text-primary-600">
              <Plus className="w-6 h-6" />
            </button>
          }
        />

        {/* Filtro por persona */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-thin">
          <button onClick={() => setFiltroAsignado('')}
            className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-ios-caption1 font-semibold border transition-all',
              !filtroAsignado ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            )}>
            Todas
          </button>
          {mockAbogados.map(a => (
            <button key={a.id} onClick={() => setFiltroAsignado(filtroAsignado === a.id ? '' : a.id)}
              className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-ios-caption1 font-semibold border transition-all',
                filtroAsignado === a.id ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              )}>
              {a.full_name.split(' ').slice(-1)[0]}
            </button>
          ))}
        </div>

        <div className="px-4 space-y-5 pb-4">
          {columnas.map(({ estado, label, color, bg, icon: Icon }) => {
            const items = porEstado(estado)
            return (
              <section key={estado}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className={cn('inline-flex items-center gap-1.5 text-ios-caption1 font-semibold uppercase tracking-wider', color)}>
                    <Icon className="w-3.5 h-3.5" />{label}
                  </span>
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', bg, color)}>{items.length}</span>
                </div>
                {items.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 py-6 text-center">
                    <p className="text-xs text-slate-300 dark:text-slate-600">Sin tareas</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map(t => <TareaCard key={t.id} tarea={t} />)}
                  </div>
                )}
              </section>
            )
          })}
        </div>

        {showForm && (
          <Sheet title="Nueva tarea" onClose={() => setShowForm(false)}>
            <NuevaTareaForm onClose={() => setShowForm(false)} />
          </Sheet>
        )}
      </div>
    )
  }

  // Desktop — Kanban
  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tareas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{todas.length} tareas en total</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filtro por persona */}
          <div className="flex items-center gap-2">
            <select
              value={filtroAsignado}
              onChange={e => setFiltroAsignado(e.target.value)}
              className="text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="">Todos los miembros</option>
              {mockAbogados.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
            </select>
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
            Nueva tarea
          </Button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-3 gap-5 items-start">
        {columnas.map(({ estado, label, color, bg, icon: Icon }) => {
          const items = porEstado(estado)
          return (
            <div key={estado} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl', bg)}>
                <Icon className={cn('w-4 h-4', color)} />
                <span className={cn('text-xs font-bold uppercase tracking-wider', color)}>{label}</span>
                <span className={cn('ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full bg-white/60 dark:bg-black/20', color)}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3 min-h-[100px]">
                {items.map(t => <TareaCard key={t.id} tarea={t} />)}
                {items.length === 0 && (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 py-8 text-center">
                    <p className="text-xs text-slate-300 dark:text-slate-700">Sin tareas</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showForm && (
        <Modal title="Nueva tarea" onClose={() => setShowForm(false)}>
          <NuevaTareaForm onClose={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  )
}
