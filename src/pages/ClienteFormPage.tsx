import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'
import { mockClientes } from '@/lib/mockData'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ClienteFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = id ? mockClientes.find(c => c.id === id) : null
  const isEdit = Boolean(existing)

  const [form, setForm] = useState({
    nombre: existing?.nombre ?? '',
    apellido: existing?.apellido ?? '',
    dni: existing?.dni ?? '',
    email: existing?.email ?? '',
    phone: existing?.phone ?? '',
    direccion: existing?.direccion ?? '',
    notas: existing?.notas ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Mock: simula guardado
    alert(isEdit ? 'Cliente actualizado (demo)' : 'Cliente creado (demo)')
    navigate('/clientes')
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl">
      <button onClick={() => navigate('/clientes')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 text-sm font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver a clientes
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-2.5 rounded-xl">
          <User className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{isEdit ? 'Editar cliente' : 'Nuevo cliente'}</h1>
          {isEdit && <p className="text-sm text-slate-400">{existing?.apellido}, {existing?.nombre}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nombre *" value={form.nombre} onChange={e => set('nombre', e.target.value)} required placeholder="Juan" />
          <Input label="Apellido *" value={form.apellido} onChange={e => set('apellido', e.target.value)} required placeholder="García" />
          <Input label="DNI" value={form.dni} onChange={e => set('dni', e.target.value)} placeholder="28.451.223" />
          <Input label="Teléfono" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+54 11 1234-5678" />
          <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="cliente@email.com" className="col-span-1 sm:col-span-2" />
          <Input label="Dirección" value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Av. Corrientes 1500, CABA" className="col-span-1 sm:col-span-2" />
        </div>
        <Textarea label="Notas" value={form.notas} onChange={e => set('notas', e.target.value)} rows={3} placeholder="Observaciones sobre el cliente..." />

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          {isEdit && (
            <button type="button" onClick={() => { if (confirm('¿Eliminar cliente?')) navigate('/clientes') }}
              className="text-sm text-red-500 hover:text-red-700 transition-colors font-medium">
              Eliminar
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button variant="secondary" type="button" onClick={() => navigate('/clientes')}>Cancelar</Button>
            <Button type="submit">{isEdit ? 'Guardar cambios' : 'Crear cliente'}</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
