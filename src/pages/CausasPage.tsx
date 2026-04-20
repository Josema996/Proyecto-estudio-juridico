import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, FolderOpen, ChevronRight } from 'lucide-react'
import { mockCausas, mockClientes, mockAbogados } from '@/lib/mockData'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { CausaEstado } from '@/types/database'
import MobileHeader from '@/components/layout/MobileHeader'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Sheet from '@/components/ui/Sheet'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/contexts/ToastContext'

const estadoVariant: Record<CausaEstado, 'success' | 'warning' | 'default' | 'info'> = {
  activa: 'success', suspendida: 'warning', archivada: 'default', resuelta: 'info',
}

const fueroColor: Record<string, string> = {
  Civil:                       'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Laboral:                     'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  Comercial:                   'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  Familia:                     'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  'Contencioso Administrativo':'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
}

const estados: CausaEstado[] = ['activa', 'suspendida', 'resuelta', 'archivada']

function NuevaCausaForm({ onClose }: { onClose: () => void; }) {
  const toast = useToast()
  const [form, setForm] = useState({
    numero_expediente: '',
    caratula:          '',
    fuero:             '',
    juzgado:           '',
    estado:            'activa' as CausaEstado,
    cliente_id:        '',
    abogado_id:        '',
    fecha_inicio:      '',
    descripcion:       '',
  })
  function set(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  return (
    <form onSubmit={e => { e.preventDefault(); toast.success('Causa creada', 'El expediente fue registrado correctamente.'); onClose() }} className="space-y-4">
      <Input
        label="Número de expediente *"
        required
        value={form.numero_expediente}
        onChange={e => set('numero_expediente', e.target.value)}
        placeholder="45.221/2024"
        className="font-mono"
      />
      <Textarea
        label="Carátula *"
        required
        rows={2}
        value={form.caratula}
        onChange={e => set('caratula', e.target.value)}
        placeholder="APELLIDO, Nombre c/ DEMANDADO s/ Tipo de acción"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Fuero" value={form.fuero} onChange={e => set('fuero', e.target.value)} placeholder="Civil, Laboral..." />
        <Input label="Juzgado" value={form.juzgado} onChange={e => set('juzgado', e.target.value)} placeholder="Juzgado N° X" />
        <Select label="Estado" value={form.estado} onChange={e => set('estado', e.target.value)}>
          {estados.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
        </Select>
        <Input label="Fecha inicio" type="date" value={form.fecha_inicio} onChange={e => set('fecha_inicio', e.target.value)} />
        <Select label="Cliente" value={form.cliente_id} onChange={e => set('cliente_id', e.target.value)}>
          <option value="">Sin asignar</option>
          {mockClientes.map(c => <option key={c.id} value={c.id}>{c.apellido}, {c.nombre}</option>)}
        </Select>
        <Select label="Abogado responsable" value={form.abogado_id} onChange={e => set('abogado_id', e.target.value)}>
          <option value="">Sin asignar</option>
          {mockAbogados.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
        </Select>
      </div>
      <Textarea label="Descripción" rows={2} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Resumen del caso..." />
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Crear causa</Button>
      </div>
    </form>
  )
}

export default function CausasPage() {
  const isMobile = useIsMobile()
  const [search, setSearch]           = useState('')
  const [estadoFilter, setEstadoFilter] = useState<CausaEstado | ''>('')
  const [showNueva, setShowNueva]     = useState(false)

  const filtered = mockCausas.filter(c => {
    const matchSearch = `${c.numero_expediente} ${c.caratula} ${c.fuero ?? ''}`.toLowerCase().includes(search.toLowerCase())
    const matchEstado = !estadoFilter || c.estado === estadoFilter
    return matchSearch && matchEstado
  })

  if (isMobile) {
    return (
      <div>
        <MobileHeader
          title="Causas"
          action={
            <button
              onClick={() => setShowNueva(true)}
              className="touch-target w-[44px] h-[44px] flex items-center justify-center text-primary-600"
            >
              <Plus className="w-6 h-6" />
            </button>
          }
        />

        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar expediente o carátula..."
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl pl-9 pr-4 py-2 text-ios-body outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-thin">
          <button onClick={() => setEstadoFilter('')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-ios-caption1 font-semibold border transition-all ${!estadoFilter ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
            Todas
          </button>
          {estados.map(e => (
            <button key={e} onClick={() => setEstadoFilter(estadoFilter === e ? '' : e)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-ios-caption1 font-semibold border transition-all capitalize ${estadoFilter === e ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
              {e}
            </button>
          ))}
        </div>

        <div className="px-4">
          <p className="text-ios-caption1 text-slate-400 font-medium uppercase tracking-wider mb-2 px-1">{filtered.length} expedientes</p>
          <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-14 text-center">
                <FolderOpen className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-ios-subhead text-slate-400">Sin causas</p>
              </div>
            ) : filtered.map((c, i) => {
              const cliente = mockClientes.find(cl => cl.id === c.cliente_id)
              return (
                <Link key={c.id} to={`/causas/${c.id}`}
                  className={`flex items-center gap-3 px-4 py-3 min-h-[60px] active:bg-slate-50 dark:active:bg-slate-800 transition-colors ${i < filtered.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-ios-caption2 font-mono text-primary-600 font-semibold">{c.numero_expediente}</span>
                      <Badge label={c.estado} variant={estadoVariant[c.estado]} />
                    </div>
                    <p className="text-ios-footnote font-medium text-slate-800 dark:text-slate-200 truncate">{c.caratula}</p>
                    {cliente && <p className="text-ios-caption2 text-slate-400 mt-0.5">{cliente.apellido}, {cliente.nombre}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>

        {showNueva && (
          <Sheet title="Nueva causa" onClose={() => setShowNueva(false)}>
            <NuevaCausaForm onClose={() => setShowNueva(false)} />
          </Sheet>
        )}
      </div>
    )
  }

  // Desktop
  return (
    <div className="p-8 max-w-7xl w-full">
      <PageHeader
        title="Causas / Expedientes"
        subtitle={`${mockCausas.length} expedientes en total`}
        action={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowNueva(true)}>
            Nueva causa
          </Button>
        }
      />
      <div className="flex gap-3 mb-6 flex-wrap">
        {estados.map(e => (
          <button key={e}
            onClick={() => setEstadoFilter(estadoFilter === e ? '' : e)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${estadoFilter === e ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
            {e} · {mockCausas.filter(c => c.estado === e).length}
          </button>
        ))}
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por expediente, carátula o fuero..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none max-w-lg"
        />
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <FolderOpen className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No se encontraron causas</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Expediente','Carátula','Cliente','Fuero','Estado','Inicio'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map(c => {
                const cliente = mockClientes.find(cl => cl.id === c.cliente_id)
                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <Link to={`/causas/${c.id}`} className="font-mono text-xs font-semibold text-primary-600">{c.numero_expediente}</Link>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="text-slate-800 dark:text-slate-200 font-medium truncate text-xs">{c.caratula}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{cliente ? `${cliente.apellido}, ${cliente.nombre}` : '—'}</td>
                    <td className="px-5 py-3.5">
                      {c.fuero ? <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${fueroColor[c.fuero] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>{c.fuero}</span> : '—'}
                    </td>
                    <td className="px-5 py-3.5"><Badge label={c.estado} variant={estadoVariant[c.estado]} /></td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(c.fecha_inicio)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {showNueva && (
        <Modal title="Nueva causa" onClose={() => setShowNueva(false)} size="lg">
          <NuevaCausaForm onClose={() => setShowNueva(false)} />
        </Modal>
      )}
    </div>
  )
}
