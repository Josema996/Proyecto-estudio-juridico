import { useParams, Link } from 'react-router-dom'
import { Mail, Phone, FolderOpen, ArrowRight, CheckSquare, Clock, AlertCircle } from 'lucide-react'
import { mockAbogados, causasDeAbogado, tareasDeAbogado, tareaConRelaciones } from '@/lib/mockData'
import { useIsMobile } from '@/hooks/useIsMobile'
import MobileHeader from '@/components/layout/MobileHeader'
import Badge from '@/components/ui/Badge'
import type { CausaEstado, UserRole, TareaEstado } from '@/types/database'
import { cn } from '@/lib/utils'

const tareaEstadoConfig: Record<TareaEstado, { label: string; color: string; icon: typeof Clock }> = {
  pendiente:  { label: 'Pendiente',  color: 'text-slate-500 dark:text-slate-400',     icon: Clock        },
  en_proceso: { label: 'En proceso', color: 'text-amber-600 dark:text-amber-400',     icon: AlertCircle  },
  finalizado: { label: 'Finalizado', color: 'text-emerald-600 dark:text-emerald-400', icon: CheckSquare  },
}

const estadoVariant: Record<CausaEstado, 'success' | 'warning' | 'default' | 'info'> = {
  activa: 'success', suspendida: 'warning', archivada: 'default', resuelta: 'info',
}

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
]

export default function PerfilAbogadoPage() {
  const { id } = useParams()
  const isMobile = useIsMobile()

  const abogado = mockAbogados.find(a => a.id === id)
  if (!abogado) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Perfil no encontrado</p>
        <Link to="/equipo" className="text-primary-600 text-sm mt-2 inline-block">← Volver al equipo</Link>
      </div>
    )
  }

  const idx = mockAbogados.findIndex(a => a.id === id)
  const causas = causasDeAbogado(abogado.id)
  const activas = causas.filter(c => c.estado === 'activa')
  const otras   = causas.filter(c => c.estado !== 'activa')
  const tareas  = tareasDeAbogado(abogado.id).map(tareaConRelaciones)
  const tareasActivas = tareas.filter(t => t.estado !== 'finalizado')

  const initials = abogado.full_name.split(' ').filter(w => /^[A-ZÁÉÍÓÚÑ]/.test(w)).slice(0, 2).map(w => w[0]).join('')

  if (isMobile) {
    return (
      <div>
        <MobileHeader title="Perfil" showBack />

        <div className="px-4 pt-5 space-y-5">
          {/* Card perfil */}
          <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ios-title3 font-bold text-slate-900 dark:text-slate-100 leading-tight">{abogado.full_name}</p>
                <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md mt-1 ${roleColor[abogado.role]}`}>
                  {roleLabel[abogado.role]}
                </span>
              </div>
            </div>
            <div className="space-y-3 border-t border-slate-50 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-ios-caption2 text-slate-400 uppercase tracking-wider font-medium">Email</p>
                  <p className="text-ios-footnote text-slate-900 dark:text-slate-100 truncate">{abogado.email}</p>
                </div>
              </div>
              {abogado.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-ios-caption2 text-slate-400 uppercase tracking-wider font-medium">Teléfono</p>
                    <p className="text-ios-footnote text-slate-900 dark:text-slate-100">{abogado.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-ios-xl border border-emerald-100 dark:border-emerald-800/30 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{activas.length}</p>
              <p className="text-ios-caption2 text-emerald-600 dark:text-emerald-400 mt-0.5">Causas activas</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 p-3 text-center shadow-card">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{causas.length}</p>
              <p className="text-ios-caption2 text-slate-400 mt-0.5">Total causas</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-ios-xl border border-amber-100 dark:border-amber-800/30 p-3 text-center">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{tareasActivas.length}</p>
              <p className="text-ios-caption2 text-amber-600 dark:text-amber-400 mt-0.5">Tareas</p>
            </div>
          </div>

          {/* Causas activas */}
          {activas.length > 0 && (
            <div>
              <p className="text-ios-caption1 text-slate-400 font-semibold uppercase tracking-wider mb-2 px-1">Causas activas</p>
              <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
                {activas.map((c, i) => (
                  <Link key={c.id} to={`/causas/${c.id}`}
                    className={`flex items-center gap-3 px-4 py-3 min-h-[60px] active:bg-slate-50 dark:active:bg-slate-800 transition-colors ${i < activas.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-mono text-primary-600 font-semibold">{c.numero_expediente}</p>
                      <p className="text-ios-footnote font-medium text-slate-800 dark:text-slate-200 truncate">{c.caratula}</p>
                      {c.fuero && <p className="text-ios-caption2 text-slate-400 mt-0.5">{c.fuero}</p>}
                    </div>
                    <Badge label={c.estado} variant={estadoVariant[c.estado]} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Otras causas */}
          {otras.length > 0 && (
            <div>
              <p className="text-ios-caption1 text-slate-400 font-semibold uppercase tracking-wider mb-2 px-1">Historial</p>
              <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden opacity-70">
                {otras.map((c, i) => (
                  <Link key={c.id} to={`/causas/${c.id}`}
                    className={`flex items-center gap-3 px-4 py-3 min-h-[56px] active:bg-slate-50 dark:active:bg-slate-800 transition-colors ${i < otras.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-mono text-slate-400">{c.numero_expediente}</p>
                      <p className="text-ios-footnote text-slate-600 dark:text-slate-300 truncate">{c.caratula}</p>
                    </div>
                    <Badge label={c.estado} variant={estadoVariant[c.estado]} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tareas asignadas */}
          {tareasActivas.length > 0 && (
            <div>
              <p className="text-ios-caption1 text-slate-400 font-semibold uppercase tracking-wider mb-2 px-1">Tareas asignadas</p>
              <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
                {tareasActivas.map((t, i) => {
                  const cfg = tareaEstadoConfig[t.estado]
                  const Icon = cfg.icon
                  return (
                    <div key={t.id}
                      className={`flex items-center gap-3 px-4 py-3 min-h-[56px] ${i < tareasActivas.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                    >
                      <Icon className={cn('w-4 h-4 flex-shrink-0', cfg.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-ios-footnote font-medium text-slate-900 dark:text-slate-100 truncate">{t.titulo}</p>
                        {t.causa && <p className="text-ios-caption2 text-primary-600 font-mono mt-0.5">{t.causa.numero_expediente}</p>}
                      </div>
                      <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0',
                        t.prioridad === 'alta' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                        t.prioridad === 'media' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      )}>
                        {t.prioridad}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Desktop
  return (
    <div className="p-8 max-w-7xl w-full">
      <Link to="/equipo" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 text-sm font-medium transition-colors">
        ← Volver al equipo
      </Link>

      <div className="grid grid-cols-3 gap-6">
        {/* Columna izquierda — datos del perfil */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-6 text-center">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4`}>
              {initials}
            </div>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight">{abogado.full_name}</p>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-lg mt-2 ${roleColor[abogado.role]}`}>
              {roleLabel[abogado.role]}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-5 space-y-4">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contacto</p>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Email</p>
                <p className="text-sm text-slate-900 dark:text-slate-100 break-all">{abogado.email}</p>
              </div>
            </div>
            {abogado.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Teléfono</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{abogado.phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{activas.length}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Activas</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-card p-4 text-center">
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{causas.length}</p>
              <p className="text-xs text-slate-400 mt-1">Total</p>
            </div>
          </div>
        </div>

        {/* Columna derecha — causas */}
        <div className="col-span-2 space-y-5">
          {activas.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FolderOpen className="w-3.5 h-3.5" /> Causas activas
              </p>
              <div className="space-y-2">
                {activas.map(c => (
                  <Link key={c.id} to={`/causas/${c.id}`}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-4 flex items-center gap-4 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs font-semibold text-primary-600 mb-0.5">{c.numero_expediente}</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-primary-600 transition-colors">{c.caratula}</p>
                      {c.fuero && <p className="text-xs text-slate-400 mt-0.5">{c.fuero} · {c.juzgado}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge label={c.estado} variant={estadoVariant[c.estado]} />
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {otras.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FolderOpen className="w-3.5 h-3.5" /> Historial
              </p>
              <div className="space-y-2 opacity-60">
                {otras.map(c => (
                  <Link key={c.id} to={`/causas/${c.id}`}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-slate-400 mb-0.5">{c.numero_expediente}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{c.caratula}</p>
                    </div>
                    <Badge label={c.estado} variant={estadoVariant[c.estado]} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {causas.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card py-16 text-center">
              <FolderOpen className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Sin causas asignadas</p>
            </div>
          )}

          {/* Tareas asignadas */}
          {tareasActivas.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5" /> Tareas asignadas
              </p>
              <div className="space-y-2">
                {tareasActivas.map(t => {
                  const cfg = tareaEstadoConfig[t.estado]
                  const Icon = cfg.icon
                  return (
                    <div key={t.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card p-4 flex items-center gap-4">
                      <Icon className={cn('w-4 h-4 flex-shrink-0', cfg.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{t.titulo}</p>
                        {t.causa && <p className="text-xs text-primary-600 font-mono mt-0.5">{t.causa.numero_expediente}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                          t.prioridad === 'alta' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                          t.prioridad === 'media' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        )}>
                          {t.prioridad}
                        </span>
                        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md', cfg.color, 'bg-slate-50 dark:bg-slate-800')}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
