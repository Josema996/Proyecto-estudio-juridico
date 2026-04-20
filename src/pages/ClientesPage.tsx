import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Phone, Mail, ChevronRight, User } from 'lucide-react'
import { mockClientes } from '@/lib/mockData'
import { useIsMobile } from '@/hooks/useIsMobile'
import MobileHeader from '@/components/layout/MobileHeader'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Sheet from '@/components/ui/Sheet'
import { Input, Textarea } from '@/components/ui/Input'
import { useToast } from '@/contexts/ToastContext'

const avatarColors = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-cyan-500']

function Initials({ nombre, apellido, idx }: { nombre: string; apellido: string; idx: number }) {
  return (
    <div className={`${avatarColors[idx % avatarColors.length]} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
      {apellido[0]}{nombre[0]}
    </div>
  )
}

function NuevoClienteForm({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const [form, setForm] = useState({ nombre: '', apellido: '', dni: '', phone: '', email: '', direccion: '', notas: '' })
  function set(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast.success('Cliente creado', `${form.apellido}, ${form.nombre}`)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Nombre *" required value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Juan" />
        <Input label="Apellido *" required value={form.apellido} onChange={e => set('apellido', e.target.value)} placeholder="García" />
        <Input label="DNI" value={form.dni} onChange={e => set('dni', e.target.value)} placeholder="28.451.223" />
        <Input label="Teléfono" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+54 11 1234-5678" />
        <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="cliente@email.com" className="col-span-1 sm:col-span-2" />
        <Input label="Dirección" value={form.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Av. Corrientes 1500, CABA" className="col-span-1 sm:col-span-2" />
      </div>
      <Textarea label="Notas" value={form.notas} onChange={e => set('notas', e.target.value)} rows={2} placeholder="Observaciones sobre el cliente..." />
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Crear cliente</Button>
      </div>
    </form>
  )
}

export default function ClientesPage() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showNuevo, setShowNuevo] = useState(false)

  const filtered = mockClientes.filter(c =>
    `${c.nombre} ${c.apellido} ${c.dni ?? ''} ${c.email ?? ''}`.toLowerCase().includes(search.toLowerCase())
  )

  if (isMobile) {
    return (
      <div>
        <MobileHeader
          title="Clientes"
          action={
            <button onClick={() => setShowNuevo(true)}
              className="touch-target w-[44px] h-[44px] flex items-center justify-center text-primary-600">
              <Plus className="w-6 h-6" />
            </button>
          }
        />

        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar"
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl pl-9 pr-4 py-2 text-ios-body outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100" />
          </div>
        </div>

        <div className="px-4 pt-4">
          <p className="text-ios-caption1 text-slate-400 font-medium uppercase tracking-wider mb-2 px-1">
            {filtered.length} clientes
          </p>
          <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-14 text-center">
                <User className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-ios-subhead text-slate-400">Sin resultados</p>
              </div>
            ) : filtered.map((c, i) => (
              <Link key={c.id} to={`/clientes/${c.id}`}
                className={`flex items-center gap-3 px-4 min-h-[64px] py-3 active:bg-slate-50 dark:active:bg-slate-800 transition-colors ${i < filtered.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                <Initials nombre={c.nombre} apellido={c.apellido} idx={i} />
                <div className="flex-1 min-w-0">
                  <p className="text-ios-body font-medium text-slate-900 dark:text-slate-100">{c.apellido}, {c.nombre}</p>
                  <p className="text-ios-footnote text-slate-400 truncate">{c.phone ?? c.email ?? c.dni ?? '—'}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {showNuevo && (
          <Sheet title="Nuevo cliente" onClose={() => setShowNuevo(false)}>
            <NuevoClienteForm onClose={() => setShowNuevo(false)} />
          </Sheet>
        )}
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader
        title="Clientes"
        subtitle={`${mockClientes.length} clientes registrados`}
        action={<Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowNuevo(true)}>Nuevo cliente</Button>}
      />
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, DNI o email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none max-w-md" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card py-20 text-center">
          <User className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No se encontraron clientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <Link key={c.id} to={`/clientes/${c.id}`}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-5 group">
              <div className="flex items-start gap-4">
                <div className={`${avatarColors[i % avatarColors.length]} w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {c.apellido[0]}{c.nombre[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">{c.apellido}, {c.nombre}</p>
                  {c.dni && <p className="text-xs text-slate-400 mt-0.5">DNI {c.dni}</p>}
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                {c.phone && <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Phone className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />{c.phone}</div>}
                {c.email && <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Mail className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" /><span className="truncate">{c.email}</span></div>}
                {c.direccion && <p className="text-xs text-slate-400 truncate mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">{c.direccion}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {showNuevo && (
        <Modal title="Nuevo cliente" onClose={() => setShowNuevo(false)} size="lg">
          <NuevoClienteForm onClose={() => setShowNuevo(false)} />
        </Modal>
      )}
    </div>
  )
}
