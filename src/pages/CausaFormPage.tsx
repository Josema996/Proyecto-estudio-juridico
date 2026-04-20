import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FolderOpen } from 'lucide-react'
import { mockCausas, mockClientes, mockAbogados } from '@/lib/mockData'
import type { CausaEstado } from '@/types/database'
import { Input, Select, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function CausaFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = id ? mockCausas.find(c => c.id === id) : null
  const isEdit = Boolean(existing)

  const [form, setForm] = useState({
    numero_expediente: existing?.numero_expediente ?? '',
    caratula:          existing?.caratula ?? '',
    fuero:             existing?.fuero ?? '',
    juzgado:           existing?.juzgado ?? '',
    estado:            existing?.estado ?? 'activa' as CausaEstado,
    cliente_id:        existing?.cliente_id ?? '',
    abogado_id:        existing?.abogado_id ?? '',
    fecha_inicio:      existing?.fecha_inicio ?? '',
    descripcion:       existing?.descripcion ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(isEdit ? 'Causa actualizada (demo)' : 'Causa creada (demo)')
    navigate('/causas')
  }

  const estados: CausaEstado[] = ['activa', 'suspendida', 'resuelta', 'archivada']

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => navigate('/causas')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 text-sm font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver a causas
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-50 dark:bg-primary-900/30 p-2.5 rounded-xl">
          <FolderOpen className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{isEdit ? 'Editar causa' : 'Nueva causa'}</h1>
          {isEdit && <p className="text-sm text-slate-400 font-mono">{existing?.numero_expediente}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-6 space-y-4">
        <Input label="Número de expediente *" value={form.numero_expediente} onChange={e => set('numero_expediente', e.target.value)} required placeholder="45.221/2024" className="font-mono" />
        <Textarea label="Carátula *" value={form.caratula} onChange={e => set('caratula', e.target.value)} required rows={2} placeholder="APELLIDO, Nombre c/ DEMANDADO s/ Tipo de acción" />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Fuero" value={form.fuero} onChange={e => set('fuero', e.target.value)} placeholder="Civil, Laboral, etc." />
          <Input label="Juzgado" value={form.juzgado} onChange={e => set('juzgado', e.target.value)} placeholder="Juzgado N° X" />
          <Select label="Estado" value={form.estado} onChange={e => set('estado', e.target.value)}>
            {estados.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
          </Select>
          <Input label="Fecha inicio" type="date" value={form.fecha_inicio} onChange={e => set('fecha_inicio', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Cliente" value={form.cliente_id} onChange={e => set('cliente_id', e.target.value)}>
            <option value="">Sin asignar</option>
            {mockClientes.map(c => <option key={c.id} value={c.id}>{c.apellido}, {c.nombre}</option>)}
          </Select>
          <Select label="Abogado responsable" value={form.abogado_id} onChange={e => set('abogado_id', e.target.value)}>
            <option value="">Sin asignar</option>
            {mockAbogados.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
          </Select>
        </div>

        <Textarea label="Descripción" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={3} placeholder="Resumen del caso..." />

        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
          {isEdit && (
            <button type="button" onClick={() => { if (confirm('¿Eliminar causa?')) navigate('/causas') }}
              className="text-sm text-red-500 hover:text-red-700 transition-colors font-medium">
              Eliminar
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button variant="secondary" type="button" onClick={() => navigate('/causas')}>Cancelar</Button>
            <Button type="submit">{isEdit ? 'Guardar cambios' : 'Crear causa'}</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
