import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, DollarSign, ChevronRight, LogOut, Scale, Moon, Sun, UserSquare2, CheckSquare, TableProperties } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import MobileHeader from '@/components/layout/MobileHeader'
import { mockHonorarios } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function MasPage() {
  const { profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()
  const [confirmLogout, setConfirmLogout] = useState(false)

  const totalPendiente = mockHonorarios
    .filter(h => h.estado !== 'cancelado')
    .reduce((s, h) => s + (h.monto_total - h.monto_pagado), 0)

  const secciones = [
    {
      titulo: 'Módulos',
      items: [
        {
          to: '/documentos',
          icon: FileText,
          color: 'bg-blue-500',
          label: 'Documentos',
          sub: '5 archivos',
        },
        {
          to: '/honorarios',
          icon: DollarSign,
          color: 'bg-emerald-500',
          label: 'Honorarios',
          sub: `${formatCurrency(totalPendiente)} pendiente`,
          badge: totalPendiente > 0 ? '!' : undefined,
        },
        {
          to: '/equipo',
          icon: UserSquare2,
          color: 'bg-violet-500',
          label: 'Equipo',
          sub: '3 miembros',
        },
        {
          to: '/tareas',
          icon: CheckSquare,
          color: 'bg-indigo-500',
          label: 'Tareas',
          sub: 'Gestión de tareas',
        },
        {
          to: '/planillas',
          icon: TableProperties,
          color: 'bg-teal-500',
          label: 'Planillas',
          sub: '20 plantillas descargables',
        },
      ],
    },
  ]

  const roleLabel: Record<string, string> = {
    titular: 'Titular',
    asociado: 'Asociado',
    administrativo: 'Administrativo',
    cliente: 'Cliente',
  }

  return (
    <div>
      {isMobile && <MobileHeader title="Más" />}

      <div className={isMobile ? 'px-4 pt-5 space-y-5' : 'p-8'}>
        {/* Perfil — clickeable */}
        <Link to="/perfil" className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card p-4 flex items-center gap-4 active:bg-slate-50 dark:active:bg-slate-800 transition-colors">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {profile?.full_name?.split(' ').map(w => w[0]).slice(0, 2).join('') ?? 'JG'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-ios-body font-semibold text-slate-900 dark:text-slate-100">{profile?.full_name}</p>
            <p className="text-ios-footnote text-slate-500 dark:text-slate-400">{profile?.email}</p>
            <span className="inline-block mt-1 text-ios-caption2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full font-medium">
              {roleLabel[profile?.role ?? ''] ?? '—'}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
        </Link>

        {/* Módulos extra */}
        {secciones.map(s => (
          <div key={s.titulo}>
            <p className="text-ios-caption1 text-slate-400 font-semibold uppercase tracking-wider mb-2 px-1">{s.titulo}</p>
            <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
              {s.items.map((item, i) => (
                <Link key={item.to} to={item.to}
                  className={`flex items-center gap-3 px-4 min-h-[56px] py-3 active:bg-slate-50 dark:active:bg-slate-800 transition-colors ${i < s.items.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                >
                  <div className={`${item.color} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ios-body font-medium text-slate-900 dark:text-slate-100">{item.label}</p>
                    <p className="text-ios-caption1 text-slate-400">{item.sub}</p>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 bg-red-500 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Ajustes */}
        <div>
          <p className="text-ios-caption1 text-slate-400 font-semibold uppercase tracking-wider mb-2 px-1">Ajustes</p>
          <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-4 min-h-[56px] py-3 active:bg-slate-50 dark:active:bg-slate-800 transition-colors"
            >
              <div className="bg-slate-100 dark:bg-slate-800 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                {theme === 'dark'
                  ? <Sun className="w-4 h-4 text-amber-500" />
                  : <Moon className="w-4 h-4 text-slate-500" />
                }
              </div>
              <div className="flex-1 text-left">
                <p className="text-ios-body font-medium text-slate-900 dark:text-slate-100">
                  {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                </p>
                <p className="text-ios-caption1 text-slate-400">
                  {theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                </p>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm mt-0.5 transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Info app */}
        <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="bg-primary-600 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-ios-body font-medium text-slate-900 dark:text-slate-100">Estudio Jurídico</p>
              <p className="text-ios-caption1 text-slate-400">Versión 0.1.0 · Demo</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmLogout(true)}
            className="flex items-center gap-3 w-full px-4 min-h-[56px] py-3 active:bg-slate-50 dark:active:bg-slate-800 transition-colors"
          >
            <div className="bg-red-50 dark:bg-red-900/20 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-ios-body font-medium text-red-600 dark:text-red-400">Cerrar sesión</p>
          </button>
        </div>
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
    </div>
  )
}
