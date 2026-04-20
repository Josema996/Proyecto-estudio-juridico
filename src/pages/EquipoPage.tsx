import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ChevronRight, FolderOpen, Plus, X } from 'lucide-react'
import { mockAbogados, causasDeAbogado } from '@/lib/mockData'
import { useIsMobile } from '@/hooks/useIsMobile'
import MobileHeader from '@/components/layout/MobileHeader'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Sheet from '@/components/ui/Sheet'
import { Input, Select } from '@/components/ui/Input'
import type { UserRole } from '@/types/database'

const roleLabel: Record<UserRole, string> = {
  titular:        'Titular',
  asociado:       'Asociado/a',
  administrativo: 'Administrativo/a',
  cliente:        'Cliente',
}

const roleColor: Record<UserRole, string> = {
  titular:        'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
  asociado:       'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  administrativo: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  cliente:        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
}

const avatarColors = [
  'from-primary-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
]

function initials(fullName: string) {
  return fullName.split(' ').filter(w => /^[A-ZÁÉÍÓÚÑ]/i.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function MiembroForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    full_name: '',
    email:     '',
    phone:     '',
    rol:       'asociado' as UserRole,
    password:  '',
  })
  function set(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  return (
    <form
      onSubmit={e => { e.preventDefault(); alert('Miembro agregado (demo)'); onClose() }}
      className="space-y-4"
    >
      <Input
        label="Nombre completo *"
        required
        value={form.full_name}
        onChange={e => set('full_name', e.target.value)}
        placeholder="Dr. Juan Pérez"
      />
      <Input
        label="Email *"
        type="email"
        required
        value={form.email}
        onChange={e => set('email', e.target.value)}
        placeholder="jperez@estudiojuridico.com"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Teléfono"
          type="tel"
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
          placeholder="+54 11 1234-5678"
        />
        <Select label="Rol *" value={form.rol} onChange={e => set('rol', e.target.value)}>
          <option value="asociado">Asociado/a</option>
          <option value="administrativo">Administrativo/a</option>
          <option value="titular">Titular</option>
        </Select>
      </div>
      <Input
        label="Contraseña temporal *"
        type="password"
        required
        minLength={8}
        value={form.password}
        onChange={e => set('password', e.target.value)}
        placeholder="Mínimo 8 caracteres"
      />
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Agregar miembro</Button>
      </div>
    </form>
  )
}

export default function EquipoPage() {
  const isMobile = useIsMobile()
  const [showForm, setShowForm] = useState(false)

  if (isMobile) {
    return (
      <div>
        <MobileHeader
          title="Equipo"
          action={
            <button
              onClick={() => setShowForm(true)}
              className="touch-target w-[44px] h-[44px] flex items-center justify-center text-primary-600"
            >
              <Plus className="w-6 h-6" />
            </button>
          }
        />

        <div className="px-4 pt-4">
          <p className="text-ios-caption1 text-slate-400 font-medium uppercase tracking-wider mb-2 px-1">
            {mockAbogados.length} miembros
          </p>
          <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
            {mockAbogados.map((ab, i) => {
              const causas = causasDeAbogado(ab.id)
              const activas = causas.filter(c => c.estado === 'activa').length
              return (
                <Link key={ab.id} to={`/equipo/${ab.id}`}
                  className={`flex items-center gap-3 px-4 py-3.5 min-h-[72px] active:bg-slate-50 dark:active:bg-slate-800 transition-colors ${i < mockAbogados.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                >
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {initials(ab.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ios-body font-semibold text-slate-900 dark:text-slate-100 truncate">{ab.full_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${roleColor[ab.role]}`}>
                        {roleLabel[ab.role]}
                      </span>
                      <span className="text-ios-caption2 text-slate-400">{causas.length} causas · {activas} activas</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>

        {showForm && (
          <Sheet title="Nuevo miembro" onClose={() => setShowForm(false)}>
            <MiembroForm onClose={() => setShowForm(false)} />
          </Sheet>
        )}
      </div>
    )
  }

  // Desktop
  return (
    <div className="p-8 max-w-7xl w-full">
      <PageHeader
        title="Equipo"
        subtitle={`${mockAbogados.length} miembros del estudio`}
        action={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
            Agregar miembro
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockAbogados.map((ab, i) => {
          const causas = causasDeAbogado(ab.id)
          const activas = causas.filter(c => c.estado === 'activa').length
          return (
            <Link key={ab.id} to={`/equipo/${ab.id}`}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-5 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                  {initials(ab.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors truncate">{ab.full_name}</p>
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 ${roleColor[ab.role]}`}>
                    {roleLabel[ab.role]}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1">{ab.email}</p>
              {ab.phone && <p className="text-xs text-slate-400 mb-3">{ab.phone}</p>}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <FolderOpen className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                  {causas.length} causas
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {activas} activas
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {showForm && (
        <Modal title="Agregar miembro al equipo" onClose={() => setShowForm(false)}>
          <MiembroForm onClose={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  )
}
