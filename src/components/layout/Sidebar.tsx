import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Scale, Users, FolderOpen, Calendar, FileText,
  DollarSign, LogOut, LayoutDashboard, ChevronRight,
  Sun, Moon, UserSquare2, CheckSquare, TableProperties,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/causas', icon: FolderOpen, label: 'Causas' },
  { to: '/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/documentos', icon: FileText, label: 'Documentos' },
  { to: '/honorarios', icon: DollarSign, label: 'Honorarios' },
  { to: '/equipo', icon: UserSquare2, label: 'Equipo' },
  { to: '/tareas', icon: CheckSquare, label: 'Tareas' },
  { to: '/planillas', icon: TableProperties, label: 'Planillas' },
]

const roleLabel: Record<string, string> = {
  titular: 'Titular',
  asociado: 'Asociado',
  administrativo: 'Administrativo',
  cliente: 'Cliente',
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  )
}

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const name = profile?.full_name ?? profile?.email ?? '?'

  return (
    <aside className="w-[260px] flex-shrink-0 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 select-none">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-none truncate">Estudio Jurídico</p>
            <p className="text-xs text-slate-500 mt-0.5">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Menú</p>
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('w-4 h-4 flex-shrink-0 transition-colors', isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300')} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-primary-300 opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        {/* Usuario */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <Avatar name={name} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-200 truncate leading-none">{name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{roleLabel[profile?.role ?? ''] ?? '—'}</p>
          </div>
        </div>

        {/* Toggle tema */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </button>

        <button
          onClick={() => setConfirmLogout(true)}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>

      {confirmLogout && (
        <ConfirmDialog
          title="¿Cerrar sesión?"
          message="Vas a salir del sistema. Podés volver a ingresar en cualquier momento."
          confirmLabel="Cerrar sesión"
          cancelLabel="Cancelar"
          variant="warning"
          onConfirm={signOut}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
    </aside>
  )
}
