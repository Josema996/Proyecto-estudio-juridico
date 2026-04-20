import { useState } from 'react'
import { Plus, Calendar, Clock, ChevronRight } from 'lucide-react'
import { mockEventos, mockCausas, eventoConCausa } from '@/lib/mockData'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { EventoTipo } from '@/types/database'
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

function EventoForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ titulo: '', tipo: 'audiencia' as EventoTipo, fecha_hora: '', causa_id: '', descripcion: '' })
  function set(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }
  return (
    <form onSubmit={e => { e.preventDefault(); alert('Evento creado (demo)'); onClose() }} className="space-y-4">
      <Input label="Título *" required value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Audiencia preliminar..." />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
          {(['audiencia','vencimiento','reunion','otro'] as EventoTipo[]).map(t =>
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
      <Textarea label="Descripción" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={2} />
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Guardar</Button>
      </div>
    </form>
  )
}

export default function AgendaPage() {
  const isMobile = useIsMobile()
  const [showForm, setShowForm] = useState(false)
  const now = new Date()

  const todos = mockEventos.map(eventoConCausa).sort((a, b) =>
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
            <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
              {proximos.length === 0 ? (
                <p className="text-ios-subhead text-slate-400 text-center py-10">Sin eventos próximos</p>
              ) : proximos.map((ev, i) => {
                const fecha = new Date(ev.fecha_hora)
                const urg = urgencia(ev.fecha_hora)
                return (
                  <div key={ev.id}
                    className={`flex items-center gap-3 px-4 py-3.5 min-h-[64px] ${i < proximos.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                  >
                    <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-2 text-center min-w-[44px] flex-shrink-0">
                      <p className="text-[9px] font-semibold text-primary-400 uppercase leading-none">
                        {fecha.toLocaleDateString('es-AR', { month: 'short' })}
                      </p>
                      <p className="text-lg font-bold text-primary-700 dark:text-primary-300 leading-tight">{fecha.getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{tipoIcon[ev.tipo]}</span>
                        <p className="text-ios-footnote font-semibold text-slate-900 dark:text-slate-100 truncate">{ev.titulo}</p>
                      </div>
                      {ev.causa && (
                        <p className="text-ios-caption2 text-slate-400 mt-0.5 truncate">{ev.causa.numero_expediente}</p>
                      )}
                      <p className="text-ios-caption2 text-slate-400">
                        {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${urg.cls}`}>{urg.label}</span>
                      <Badge label={ev.tipo} variant={tipoVariant[ev.tipo]} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {pasados.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-ios-caption1 text-slate-400 font-semibold uppercase tracking-wider">Pasados · {pasados.length}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden opacity-60">
                {pasados.map((ev, i) => {
                  const fecha = new Date(ev.fecha_hora)
                  return (
                    <div key={ev.id}
                      className={`flex items-center gap-3 px-4 py-3.5 min-h-[60px] ${i < pasados.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                    >
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-2 text-center min-w-[44px] flex-shrink-0">
                        <p className="text-[9px] font-semibold text-slate-400 uppercase leading-none">
                          {fecha.toLocaleDateString('es-AR', { month: 'short' })}
                        </p>
                        <p className="text-lg font-bold text-slate-500 dark:text-slate-400 leading-tight">{fecha.getDate()}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-ios-footnote font-medium text-slate-600 dark:text-slate-300 truncate">{ev.titulo}</p>
                        {ev.causa && <p className="text-ios-caption2 text-slate-400 mt-0.5">{ev.causa.numero_expediente}</p>}
                      </div>
                      <Badge label={ev.tipo} variant={tipoVariant[ev.tipo]} />
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>

        {showForm && <Sheet title="Nuevo evento" onClose={() => setShowForm(false)}><EventoForm onClose={() => setShowForm(false)} /></Sheet>}
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl">
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
          {proximos.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card py-12 text-center text-slate-400 text-sm">Sin eventos próximos</div>
          ) : (
            <div className="space-y-2">
              {proximos.map(ev => {
                const fecha = new Date(ev.fecha_hora)
                const urg = urgencia(ev.fecha_hora)
                return (
                  <div key={ev.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all p-4 flex items-start gap-4 group">
                    <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-3 text-center min-w-[56px] flex-shrink-0">
                      <p className="text-[10px] font-semibold text-primary-400 uppercase">{fecha.toLocaleDateString('es-AR', { month: 'short' })}</p>
                      <p className="text-2xl font-bold text-primary-700 dark:text-primary-300 leading-none">{fecha.getDate()}</p>
                      <p className="text-[10px] text-primary-400 mt-0.5">{fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base">{tipoIcon[ev.tipo]}</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{ev.titulo}</p>
                        <Badge label={ev.tipo} variant={tipoVariant[ev.tipo]} />
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urg.cls}`}>{urg.label}</span>
                      </div>
                      {ev.causa && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><ChevronRight className="w-3 h-3" />{ev.causa.numero_expediente} · {ev.causa.caratula.slice(0, 60)}</p>}
                      {ev.descripcion && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ev.descripcion}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
        {pasados.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pasados ({pasados.length})</h2>
            </div>
            <div className="space-y-2 opacity-50">
              {pasados.map(ev => {
                const fecha = new Date(ev.fecha_hora)
                return (
                  <div key={ev.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex items-start gap-4">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-3 text-center min-w-[56px] flex-shrink-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">{fecha.toLocaleDateString('es-AR', { month: 'short' })}</p>
                      <p className="text-2xl font-bold text-slate-500 dark:text-slate-400 leading-none">{fecha.getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-600 dark:text-slate-300 text-sm">{ev.titulo}</p>
                        <Badge label={ev.tipo} variant={tipoVariant[ev.tipo]} />
                      </div>
                      {ev.causa && <p className="text-xs text-slate-400 mt-0.5 truncate">{ev.causa.numero_expediente} · {ev.causa.caratula.slice(0, 50)}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
      {showForm && <Modal title="Nuevo evento" onClose={() => setShowForm(false)}><EventoForm onClose={() => setShowForm(false)} /></Modal>}
    </div>
  )
}
