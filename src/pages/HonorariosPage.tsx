import { useState } from 'react'
import { Plus, DollarSign, TrendingUp } from 'lucide-react'
import { mockHonorarios, mockCausas, mockClientes, honorarioConRelaciones } from '@/lib/mockData'
import type { HonorarioEstado } from '@/types/database'
import PageHeader from '@/components/ui/PageHeader'
import MobileHeader from '@/components/layout/MobileHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Sheet from '@/components/ui/Sheet'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useIsMobile'

type EstadoVariant = Record<HonorarioEstado, 'danger' | 'warning' | 'success'>
const estadoVariant: EstadoVariant = { pendiente: 'danger', parcial: 'warning', cancelado: 'success' }

function HonorarioForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ concepto: '', monto_total: '', monto_pagado: '0', estado: 'pendiente' as HonorarioEstado, causa_id: '', cliente_id: '', fecha_acuerdo: '', notas: '' })
  function set(field: string, value: string) { setForm(f => ({ ...f, [field]: value })) }

  return (
    <form onSubmit={e => { e.preventDefault(); alert('Honorario creado (demo)'); onClose() }} className="space-y-4">
      <Input label="Concepto *" required value={form.concepto} onChange={e => set('concepto', e.target.value)} placeholder="Honorarios inicio causa..." />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Monto total *" required type="number" min="0" step="1000" value={form.monto_total} onChange={e => set('monto_total', e.target.value)} placeholder="350000" />
        <Input label="Monto pagado" type="number" min="0" step="1000" value={form.monto_pagado} onChange={e => set('monto_pagado', e.target.value)} />
        <Select label="Estado" value={form.estado} onChange={e => set('estado', e.target.value)}>
          <option value="pendiente">Pendiente</option>
          <option value="parcial">Parcial</option>
          <option value="cancelado">Cancelado</option>
        </Select>
        <Input label="Fecha acuerdo" type="date" value={form.fecha_acuerdo} onChange={e => set('fecha_acuerdo', e.target.value)} />
        <Select label="Cliente" value={form.cliente_id} onChange={e => set('cliente_id', e.target.value)}>
          <option value="">Sin asignar</option>
          {mockClientes.map(c => <option key={c.id} value={c.id}>{c.apellido}, {c.nombre}</option>)}
        </Select>
        <Select label="Causa" value={form.causa_id} onChange={e => set('causa_id', e.target.value)}>
          <option value="">Sin causa</option>
          {mockCausas.map(c => <option key={c.id} value={c.id}>{c.numero_expediente}</option>)}
        </Select>
      </div>
      <Textarea label="Notas" value={form.notas} onChange={e => set('notas', e.target.value)} rows={2} />
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Guardar</Button>
      </div>
    </form>
  )
}

export default function HonorariosPage() {
  const isMobile = useIsMobile()
  const [showModal, setShowModal] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState<HonorarioEstado | ''>('')

  const datos = mockHonorarios.map(honorarioConRelaciones)
  const filtrados = filtroEstado ? datos.filter(h => h.estado === filtroEstado) : datos

  const totalAcordado  = mockHonorarios.reduce((s, h) => s + h.monto_total, 0)
  const totalCobrado   = mockHonorarios.reduce((s, h) => s + h.monto_pagado, 0)
  const totalPendiente = totalAcordado - totalCobrado
  const pct = totalAcordado > 0 ? Math.round((totalCobrado / totalAcordado) * 100) : 0

  const filtros = (['', 'pendiente', 'parcial', 'cancelado'] as (HonorarioEstado | '')[])

  if (isMobile) {
    return (
      <div>
        <MobileHeader
          title="Honorarios"
          action={
            <button onClick={() => setShowModal(true)}
              className="touch-target w-[44px] h-[44px] flex items-center justify-center text-primary-600">
              <Plus className="w-6 h-6" />
            </button>
          }
        />

        <div className="px-4 pt-4 space-y-4">
          {/* Resumen — apilado en mobile */}
          <div className="space-y-2">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total acordado</p>
                <DollarSign className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalAcordado)}</p>
              <div className="mt-2 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{pct}% cobrado</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">Cobrado</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(totalCobrado)}</p>
                <p className="text-xs text-emerald-500 mt-1">{mockHonorarios.filter(h => h.estado === 'cancelado').length} canceladas</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl p-4">
                <p className="text-xs font-medium text-red-500 dark:text-red-400 uppercase tracking-wide mb-1">Por cobrar</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(totalPendiente)}</p>
                <p className="text-xs text-red-400 mt-1">{mockHonorarios.filter(h => h.estado !== 'cancelado').length} pendientes</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {filtros.map(e => (
              <button key={e} onClick={() => setFiltroEstado(e)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filtroEstado === e ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
                {e === '' ? 'Todos' : e.charAt(0).toUpperCase() + e.slice(1)}
              </button>
            ))}
          </div>

          {/* Lista tipo cards */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
            {filtrados.length === 0
              ? <p className="text-center text-slate-400 text-sm py-12">No hay honorarios</p>
              : filtrados.map((h, i) => (
                <div key={h.id} className={`p-4 ${i < filtrados.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug">{h.concepto}</p>
                    <Badge label={h.estado} variant={estadoVariant[h.estado]} />
                  </div>
                  {h.causa && <p className="text-xs font-mono text-slate-400 mb-1">{h.causa.numero_expediente}</p>}
                  {h.cliente && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{h.cliente.apellido}, {h.cliente.nombre}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(h.monto_total)}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Cobrado: {formatCurrency(h.monto_pagado)}</p>
                      {h.monto_pagado < h.monto_total && (
                        <p className="text-xs text-red-400">Restante: {formatCurrency(h.monto_total - h.monto_pagado)}</p>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{formatDate(h.fecha_acuerdo)}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {showModal && (
          <Sheet title="Nuevo honorario" onClose={() => setShowModal(false)}>
            <HonorarioForm onClose={() => setShowModal(false)} />
          </Sheet>
        )}
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader
        title="Honorarios"
        subtitle="Registro de pagos por causa y cliente"
        action={<Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>Nuevo honorario</Button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total acordado</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalAcordado)}</p>
          <div className="mt-3 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
            <div className="bg-primary-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">{pct}% cobrado</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Cobrado</p>
          </div>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(totalCobrado)}</p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-2">{mockHonorarios.filter(h => h.estado === 'cancelado').length} causas canceladas</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-red-400" />
            <p className="text-xs font-medium text-red-500 dark:text-red-400 uppercase tracking-wide">Por cobrar</p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalPendiente)}</p>
          <p className="text-xs text-red-400 mt-2">{mockHonorarios.filter(h => h.estado !== 'cancelado').length} causas pendientes</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {filtros.map(e => (
          <button key={e} onClick={() => setFiltroEstado(e)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filtroEstado === e ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
            {e === '' ? 'Todos' : e.charAt(0).toUpperCase() + e.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Concepto</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cliente</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cobrado</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filtrados.map(h => (
              <tr key={h.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{h.concepto}</p>
                  {h.causa && <p className="text-xs text-slate-400 font-mono mt-0.5">{h.causa.numero_expediente}</p>}
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                  {h.cliente ? `${h.cliente.apellido}, ${h.cliente.nombre}` : '—'}
                </td>
                <td className="px-5 py-3.5 text-right font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(h.monto_total)}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(h.monto_pagado)}</span>
                  {h.monto_pagado < h.monto_total && (
                    <p className="text-xs text-red-400">{formatCurrency(h.monto_total - h.monto_pagado)} restante</p>
                  )}
                </td>
                <td className="px-5 py-3.5"><Badge label={h.estado} variant={estadoVariant[h.estado]} /></td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(h.fecha_acuerdo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && <div className="py-16 text-center text-slate-400 text-sm">No hay honorarios</div>}
      </div>

      {showModal && (
        <Modal title="Nuevo honorario" onClose={() => setShowModal(false)} size="lg">
          <HonorarioForm onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  )
}
