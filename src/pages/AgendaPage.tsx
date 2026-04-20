import { useState } from 'react'
import { Plus, Calendar, Clock, ChevronRight, Pencil, Trash2, Bell, BellOff } from 'lucide-react'
import { mockEventos, mockCausas, mockAbogados, eventoConCausa } from '@/lib/mockData'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { Evento, EventoTipo } from '@/types/database'
import MobileHeader from '@/components/layout/MobileHeader'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Sheet from '@/components/ui/Sheet'
import Modal from '@/components/ui/Modal'
import { Input, Select, Textarea } from '@/components/ui/Input'

const tipoVariant: Record<EventoTipo, 'info' | 'danger' | 'warning' | 'default'> = {
  audiencia: 'info', vencimiento: 'danger', reunion: 'warning', otro: 'default',
}
const tipoIcon: Record<EventoTipo, string> = {
  audiencia: '⚖️', vencimiento: '⏰', reunion: '🤝', otro: '📌',
}

interface EventoFormData {
  titulo: string
  tipo: EventoTipo
  fecha_hora: string
  causa_id: string
  descripcion: string
  participantes_ids: string[]
}

function EventoForm({ initial, onClose, onSave }: {
  initial?: Partial<EventoFormData>
  onClose: () => void
  onSave: (data: EventoFormData) => void
}) {
  const [form, setForm] = useState<EventoFormData>({
    titulo: initial?.titulo ?? '',
    tipo: initial?.tipo ?? 'audiencia',
    fecha_hora: initial?.fecha_hora ?? '',
    causa_id: initial?.causa_id ?? '',
    descripcion: initial?.descripcion ?? '',
    participantes_ids: initial?.participantes_ids ?? [],
  })

  function set(f: keyof EventoFormData, v: string) {
    setForm(p => ({ ...p, [f]: v }))
  }

  function toggleParticipante(id: string) {
    setForm(p => ({
      ...p,
      participantes_ids: p.participantes_ids.includes(id)
        ? p.participantes_ids.filter(x => x !== id)
        : [...p.participantes_ids, id],
    }))
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Input label="Título *" required value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Audiencia preliminar..." />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
          {(['audiencia', 'vencimiento', 'reunion', 'otro'] as EventoTipo[]).map(t =>
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          )}
        </Select>
        <Input label="Fecha y hora *" type="datetime-local" required value={form.fecha_hora} onChange={e => set('fecha_hora', e.target.value)} />
      </div>
      <Select label="Causa" value={form.causa_id} onChange={e => set('causa_id', e.target.value)}>
        <option value="">Sin causa</option>
        {mockCausas.filter(c => c.estado === 'activa').map(c =>
          <option key={c.id} value={c.id}>{c.numero_expediente} — {c.caratula.slice(0, 45)}</option>
        )}
      </Select>
      <Textarea label="Descripción" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={2} placeholder="Notas del evento..." />

      <div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5" /> Participantes (recibirán recordatorio)
        </p>
        <div className="flex flex-wrap gap-2">
          {mockAbogados.map(a => {
            const selected = form.participantes_ids.includes(a.id)
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleParticipante(a.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selected
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                }`}
              >
                {a.full_name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Guardar</Button>
      </div>
    </form>
  )
}

type EventoConCausa = ReturnType<typeof eventoConCausa>

export default function AgendaPage() {
  const isMobile = useIsMobile()
  const [eventos, setEventos] = useState<Evento[]>(mockEventos)
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Evento | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Evento | null>(null)
  const now = new Date()

  const todos = eventos.map(eventoConCausa).sort((a, b) =>
    new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()
  )
  const proximos = todos.filter(e => new Date(e.fecha_hora) >= now)
  const pasados  = todos.filter(e => new Date(e.fecha_hora) < now).reverse()

  function urgencia(fecha: string) {
    const d = Math.ceil((new Date(fecha).getTime() - now.getTime()) / 86400000)
    if (d <= 0) return { label: 'Hoy',    cls: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' }
    if (d === 1) return { label: 'Mañana', cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' }
    if (d <= 7)  return { label: `${d}d`,  cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400' }
    return        { label: `${d}d`,        cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' }
  }

  function handleSave(data: EventoFormData) {
    if (editando) {
      setEventos(prev => prev.map(e => e.id === editando.id ? { ...editando, ...data } : e))
      setEditando(null)
    } else {
      const nuevo: Evento = {
        id: `e${Date.now()}`,
        ...data,
        causa_id: data.causa_id || null,
        descripcion: data.descripcion || null,
        creado_por: 'user-1',
        recordatorio_enviado: false,
        created_at: new Date().toISOString(),
      }
      setEventos(prev => [...prev, nuevo])
      setShowForm(false)
    }
  }

  function handleDelete(ev: Evento) {
    setEventos(prev => prev.filter(e => e.id !== ev.id))
    setConfirmDelete(null)
  }

  function toggleRecordatorio(ev: Evento) {
    setEventos(prev => prev.map(e => e.id === ev.id ? { ...e, recordatorio_enviado: !e.recordatorio_enviado } : e))
  }

  function participantesDeEvento(ev: EventoConCausa) {
    return mockAbogados.filter(a => ev.participantes_ids.includes(a.id))
  }

  function EventoCard({ ev, pasado = false }: { ev: EventoConCausa; pasado?: boolean }) {
    const fecha = new Date(ev.fecha_hora)
    const urg = urgencia(ev.fecha_hora)
    const participantes = participantesDeEvento(ev)
    return (
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-4 flex items-start gap-4 group transition-all ${pasado ? 'opacity-50' : 'hover:shadow-card-hover'}`}>
        <div className={`${pasado ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary-50 dark:bg-primary-900/30'} rounded-xl p-3 text-center min-w-[56px] flex-shrink-0`}>
          <p className={`text-[10px] font-semibold uppercase ${pasado ? 'text-slate-400' : 'text-primary-400'}`}>
            {fecha.toLocaleDateString('es-AR', { month: 'short' })}
          </p>
          <p className={`text-2xl font-bold leading-none ${pasado ? 'text-slate-500 dark:text-slate-400' : 'text-primary-700 dark:text-primary-300'}`}>
            {fecha.getDate()}
          </p>
          <p className={`text-[10px] mt-0.5 ${pasado ? 'text-slate-400' : 'text-primary-400'}`}>
            {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{tipoIcon[ev.tipo]}</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{ev.titulo}</p>
            <Badge label={ev.tipo} variant={tipoVariant[ev.tipo]} />
            {!pasado && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urg.cls}`}>{urg.label}</span>}
          </div>
          {ev.causa && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />{ev.causa.numero_expediente} · {ev.causa.caratula.slice(0, 60)}
            </p>
          )}
          {ev.descripcion && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ev.descripcion}</p>}
          {participantes.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <Bell className="w-3 h-3 text-slate-400" />
              {participantes.map(p => (
                <span key={p.id} className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                  {p.full_name}
                </span>
              ))}
            </div>
          )}
        </div>

        {!pasado && (
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => toggleRecordatorio(ev)}
              title={ev.recordatorio_enviado ? 'Recordatorio activo' : 'Activar recordatorio'}
              className={`p-1.5 rounded-lg transition-colors ${ev.recordatorio_enviado ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {ev.recordatorio_enviado ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setEditando(ev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setConfirmDelete(ev)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    )
  }

  if (isMobile) {
    return (
      <div>
        <MobileHeader
          title="Agenda"
          action={
            <button onClick={() => setShowForm(true)}
              className="touch-target w-[44px] h-[44px] flex items-center justify-center text-primary-600">
              <Plus className="w-6 h-6" />
            </button>
          }
        />

        <div className="px-4 pt-4 space-y-5">
          <section>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Calendar className="w-3.5 h-3.5 text-primary-500" />
              <p className="text-ios-caption1 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Próximos · {proximos.length}</p>
            </div>
            <div className="space-y-2">
              {proximos.length === 0
                ? <p className="text-sm text-slate-400 text-center py-10">Sin eventos próximos</p>
                : proximos.map(ev => <EventoCard key={ev.id} ev={ev} />)
              }
            </div>
          </section>

          {pasados.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-ios-caption1 text-slate-400 font-semibold uppercase tracking-wider">Pasados · {pasados.length}</p>
              </div>
              <div className="space-y-2">
                {pasados.map(ev => <EventoCard key={ev.id} ev={ev} pasado />)}
              </div>
            </section>
          )}
        </div>

        {showForm && (
          <Sheet title="Nuevo evento" onClose={() => setShowForm(false)}>
            <EventoForm onClose={() => setShowForm(false)} onSave={handleSave} />
          </Sheet>
        )}
        {editando && (
          <Sheet title="Editar evento" onClose={() => setEditando(null)}>
            <EventoForm initial={{ ...editando, causa_id: editando.causa_id ?? undefined, descripcion: editando.descripcion ?? undefined }} onClose={() => setEditando(null)} onSave={handleSave} />
          </Sheet>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <PageHeader
        title="Agenda"
        subtitle="Audiencias, vencimientos y reuniones"
        action={<Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>Nuevo evento</Button>}
      />
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary-500" />
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Próximos ({proximos.length})</h2>
          </div>
          {proximos.length === 0
            ? <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card py-12 text-center text-slate-400 text-sm">Sin eventos próximos</div>
            : <div className="space-y-2">{proximos.map(ev => <EventoCard key={ev.id} ev={ev} />)}</div>
          }
        </section>

        {pasados.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pasados ({pasados.length})</h2>
            </div>
            <div className="space-y-2">
              {pasados.map(ev => <EventoCard key={ev.id} ev={ev} pasado />)}
            </div>
          </section>
        )}
      </div>

      {showForm && (
        <Modal title="Nuevo evento" onClose={() => setShowForm(false)} size="lg">
          <EventoForm onClose={() => setShowForm(false)} onSave={handleSave} />
        </Modal>
      )}
      {editando && (
        <Modal title="Editar evento" onClose={() => setEditando(null)} size="lg">
          <EventoForm initial={{ ...editando, causa_id: editando.causa_id ?? undefined, descripcion: editando.descripcion ?? undefined }} onClose={() => setEditando(null)} onSave={handleSave} />
        </Modal>
      )}
      {confirmDelete && (
        <Modal title="Eliminar evento" onClose={() => setConfirmDelete(null)} size="sm">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            ¿Eliminar <span className="font-semibold">"{confirmDelete.titulo}"</span>? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)} className="flex-1">Cancelar</Button>
            <Button onClick={() => handleDelete(confirmDelete)} className="flex-1 !bg-red-600 hover:!bg-red-700">Eliminar</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
