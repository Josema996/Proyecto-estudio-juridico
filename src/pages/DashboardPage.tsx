import { Link } from 'react-router-dom'
import {
  Users, FolderOpen, Calendar, DollarSign,
  ArrowRight, AlertCircle, CheckSquare, Clock,
  TrendingUp, Scale,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
  mockClientes, mockCausas, mockEventos, mockHonorarios,
  mockTareas, mockAbogados, eventoConCausa, tareaConRelaciones,
} from '@/lib/mockData'
import { formatCurrency, cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import MobileHeader from '@/components/layout/MobileHeader'
import type { CausaEstado, EventoTipo } from '@/types/database'

const estadoVariant: Record<CausaEstado, 'success' | 'warning' | 'default' | 'info'> = {
  activa: 'success', suspendida: 'warning', archivada: 'default', resuelta: 'info',
}
const tipoVariant: Record<EventoTipo, 'info' | 'danger' | 'warning' | 'default'> = {
  audiencia: 'info', vencimiento: 'danger', reunion: 'warning', otro: 'default',
}
const tipoLabel: Record<EventoTipo, string> = {
  audiencia: 'Audiencia', vencimiento: 'Vencimiento', reunion: 'Reunión', otro: 'Otro',
}
const avatarColors = [
  'from-primary-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
]
function initials(name: string) {
  return name.split(' ').filter(w => /^[A-ZÁÉÍÓÚÑ]/i.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const isMobile = useIsMobile()
  const now = new Date()

  const causasActivas  = mockCausas.filter(c => c.estado === 'activa')
  const eventosProximos = mockEventos
    .filter(e => new Date(e.fecha_hora) >= now)
    .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
    .slice(0, 5)
    .map(eventoConCausa)

  const totalPagado    = mockHonorarios.reduce((s, h) => s + h.monto_pagado, 0)
  const totalPendiente = mockHonorarios.filter(h => h.estado !== 'cancelado').reduce((s, h) => s + (h.monto_total - h.monto_pagado), 0)
  const honPendientes  = mockHonorarios.filter(h => h.estado !== 'cancelado').length

  const tareasUrgentes = mockTareas
    .filter(t => t.estado !== 'finalizado')
    .map(tareaConRelaciones)
    .sort((a, b) => {
      const pa = a.prioridad === 'alta' ? 0 : a.prioridad === 'media' ? 1 : 2
      const pb = b.prioridad === 'alta' ? 0 : b.prioridad === 'media' ? 1 : 2
      return pa - pb
    })
    .slice(0, isMobile ? 3 : 4)

  const tareasPendientesCount = mockTareas.filter(t => t.estado === 'pendiente').length
  const tareasEnProcesoCount  = mockTareas.filter(t => t.estado === 'en_proceso').length

  const firstName = profile?.full_name?.split(' ').find(w => !/^Dr\.?a?\.?$/i.test(w)) ?? 'Doctor'

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  const stats = [
    {
      label: 'Clientes',
      value: mockClientes.length,
      sub: 'activos',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800/30',
      to: '/clientes',
    },
    {
      label: 'Causas activas',
      value: causasActivas.length,
      sub: `de ${mockCausas.length} total`,
      icon: FolderOpen,
      color: 'text-primary-500',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      border: 'border-primary-100 dark:border-primary-800/30',
      to: '/causas',
    },
    {
      label: 'Próximos eventos',
      value: eventosProximos.length,
      sub: 'programados',
      icon: Calendar,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-100 dark:border-amber-800/30',
      to: '/agenda',
    },
    {
      label: 'Tareas pendientes',
      value: tareasPendientesCount + tareasEnProcesoCount,
      sub: `${tareasEnProcesoCount} en proceso`,
      icon: CheckSquare,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-800/30',
      to: '/tareas',
    },
  ]

  /* ─── MOBILE ─── */
  if (isMobile) {
    return (
      <div>
        <MobileHeader
          title="Inicio"
          action={
            <span className="text-ios-subhead text-slate-400 pr-2">
              {now.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
            </span>
          }
        />

        <div className="px-4 pt-5 pb-6 space-y-5">
          {/* Saludo */}
          <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-sm font-medium text-primary-200">{greeting},</p>
            <p className="text-xl font-bold mt-0.5">{firstName}</p>
            <p className="text-xs text-primary-300 mt-1 capitalize">
              {now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-lg font-bold">{causasActivas.length}</p>
                <p className="text-[11px] text-primary-300">Causas activas</p>
              </div>
              <div>
                <p className="text-lg font-bold">{eventosProximos.length}</p>
                <p className="text-[11px] text-primary-300">Eventos próximos</p>
              </div>
              <div>
                <p className="text-lg font-bold">{tareasPendientesCount}</p>
                <p className="text-[11px] text-primary-300">Tareas pendientes</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ label, value, sub, icon: Icon, color, bg, to }) => (
              <Link key={label} to={to}
                className="bg-white dark:bg-slate-900 rounded-ios-xl p-4 border border-slate-100 dark:border-slate-800 shadow-card active:scale-95 transition-transform duration-150"
              >
                <div className={cn(bg, 'w-9 h-9 rounded-xl flex items-center justify-center mb-3')}>
                  <Icon className={cn('w-4.5 h-4.5', color)} />
                </div>
                <p className={cn('text-2xl font-bold text-slate-900 dark:text-slate-100')}>{value}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-600">{sub}</p>
              </Link>
            ))}
          </div>

          {/* Próximos eventos */}
          <Section title="Próximos eventos" to="/agenda" linkLabel="Ver agenda">
            {eventosProximos.length === 0 ? (
              <EmptyState text="Sin eventos próximos" />
            ) : eventosProximos.slice(0, 3).map((ev, i) => {
              const fecha = new Date(ev.fecha_hora)
              const dias = Math.ceil((fecha.getTime() - now.getTime()) / 86400000)
              return (
                <Row key={ev.id} last={i === Math.min(eventosProximos.length, 3) - 1}>
                  <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl px-2.5 py-1.5 text-center min-w-[40px]">
                    <p className="text-[9px] font-semibold text-primary-400 uppercase leading-none">
                      {fecha.toLocaleDateString('es-AR', { month: 'short' })}
                    </p>
                    <p className="text-base font-bold text-primary-700 dark:text-primary-300 leading-tight">{fecha.getDate()}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ios-footnote font-semibold text-slate-900 dark:text-slate-100 truncate">{ev.titulo}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge label={tipoLabel[ev.tipo]} variant={tipoVariant[ev.tipo]} />
                      {ev.causa && <p className="text-ios-caption2 text-slate-400 truncate">{ev.causa.numero_expediente}</p>}
                    </div>
                  </div>
                  <DaysBadge dias={dias} />
                </Row>
              )
            })}
          </Section>

          {/* Tareas urgentes */}
          <Section title="Tareas urgentes" to="/tareas" linkLabel="Ver tareas">
            {tareasUrgentes.length === 0 ? (
              <EmptyState text="Sin tareas pendientes" />
            ) : tareasUrgentes.map((t, i) => (
              <Row key={t.id} last={i === tareasUrgentes.length - 1}>
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1',
                  t.prioridad === 'alta' ? 'bg-red-500' : t.prioridad === 'media' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-ios-footnote font-semibold text-slate-900 dark:text-slate-100 truncate">{t.titulo}</p>
                  <p className="text-ios-caption2 text-slate-400">{t.causa?.numero_expediente ?? 'Sin causa'}</p>
                </div>
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0',
                  t.estado === 'en_proceso'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                )}>
                  {t.estado === 'en_proceso' ? 'En proceso' : 'Pendiente'}
                </span>
              </Row>
            ))}
          </Section>

          {/* Honorarios alerta */}
          {honPendientes > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-ios-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-ios-footnote font-semibold text-amber-900 dark:text-amber-300">Honorarios por cobrar</p>
                <p className="text-ios-caption1 text-amber-700 dark:text-amber-400 mt-0.5">
                  {honPendientes} causas · {formatCurrency(totalPendiente)} pendientes
                </p>
                <Link to="/mas" className="inline-flex items-center gap-1 text-ios-caption1 text-amber-700 dark:text-amber-400 font-semibold mt-2">
                  Ver honorarios <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ─── DESKTOP ─── */
  return (
    <div className="p-8 max-w-7xl w-full">
      {/* Header saludo */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{greeting},</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{firstName} 👋</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 capitalize">
            {now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-card">
          <Scale className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Estudio Jurídico</span>
          <span className="text-xs text-slate-400 ml-1">· Demo</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {stats.map(({ label, value, sub, icon: Icon, color, bg, border, to }) => (
          <Link key={label} to={to}
            className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-150"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn(bg, border, 'w-11 h-11 rounded-xl flex items-center justify-center border')}>
                <Icon className={cn('w-5 h-5', color)} />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">{label}</p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: main content (2 cols) */}
        <div className="col-span-2 space-y-5">

          {/* Próximos eventos */}
          <Card title="Próximos eventos" to="/agenda" linkLabel="Ver agenda">
            {eventosProximos.length === 0 ? (
              <EmptyState text="Sin eventos próximos" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800">
                    {['Fecha', 'Evento', 'Tipo', 'Expediente', ''].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {eventosProximos.map(ev => {
                    const fecha = new Date(ev.fecha_hora)
                    const dias = Math.ceil((fecha.getTime() - now.getTime()) / 86400000)
                    return (
                      <tr key={ev.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg px-2 py-1 text-center min-w-[36px]">
                              <p className="text-[8px] font-semibold text-primary-400 uppercase leading-none">
                                {fecha.toLocaleDateString('es-AR', { month: 'short' })}
                              </p>
                              <p className="text-sm font-bold text-primary-700 dark:text-primary-300 leading-tight">{fecha.getDate()}</p>
                            </div>
                            <p className="text-xs text-slate-400">
                              {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{ev.titulo}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge label={tipoLabel[ev.tipo]} variant={tipoVariant[ev.tipo]} />
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{ev.causa?.numero_expediente ?? '—'}</td>
                        <td className="px-4 py-3 text-right">
                          <DaysBadge dias={dias} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </Card>

          {/* Causas activas */}
          <Card title="Causas activas" to="/causas" linkLabel="Ver todas">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 dark:border-slate-800">
                  {['Expediente', 'Carátula', 'Fuero', 'Estado'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {causasActivas.slice(0, 5).map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-4 py-3">
                      <Link to={`/causas/${c.id}`} className="font-mono text-xs font-semibold text-primary-600 hover:underline">{c.numero_expediente}</Link>
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">{c.caratula}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{c.fuero ?? '—'}</td>
                    <td className="px-4 py-3"><Badge label={c.estado} variant={estadoVariant[c.estado]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right: sidebar (1 col) */}
        <div className="space-y-5">
          {/* Resumen financiero */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Resumen financiero</p>
              </div>
              <p className="text-xs text-slate-400">Honorarios del estudio</p>
            </div>
            <div className="px-5 pb-5 space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Total cobrado</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPagado)}</p>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800" />
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Pendiente de cobro</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalPendiente)}</p>
              </div>
              {totalPendiente > 0 && (
                <>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.round(totalPagado / (totalPagado + totalPendiente) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {Math.round(totalPagado / (totalPagado + totalPendiente) * 100)}% cobrado
                  </p>
                </>
              )}
              <Link to="/honorarios" className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:underline mt-1">
                Ver detalle <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Tareas urgentes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tareas urgentes</p>
              </div>
              <Link to="/tareas" className="text-xs text-primary-600 font-medium hover:underline">Ver todas</Link>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {tareasUrgentes.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Sin tareas pendientes</p>
              ) : tareasUrgentes.map(t => (
                <div key={t.id} className="px-5 py-3 flex items-start gap-3">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1.5',
                    t.prioridad === 'alta' ? 'bg-red-500' : t.prioridad === 'media' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{t.titulo}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t.causa?.numero_expediente ?? 'Sin causa'}</p>
                    {t.asignado && (
                      <div className="flex items-center gap-1 mt-1">
                        {(() => {
                          const idx = mockAbogados.findIndex(a => a.id === t.asignado_a)
                          return (
                            <div className={cn('w-4 h-4 rounded-full bg-gradient-to-br text-white text-[7px] font-bold flex items-center justify-center flex-shrink-0', avatarColors[idx % avatarColors.length])}>
                              {initials(t.asignado.full_name)}
                            </div>
                          )
                        })()}
                        <p className="text-[10px] text-slate-400 truncate">{t.asignado.full_name.split(' ').slice(-1)[0]}</p>
                      </div>
                    )}
                  </div>
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5',
                    t.estado === 'en_proceso'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  )}>
                    {t.estado === 'en_proceso' ? 'En proceso' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipo */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-500" />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Equipo</p>
              </div>
              <Link to="/equipo" className="text-xs text-primary-600 font-medium hover:underline">Ver equipo</Link>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {mockAbogados.map((a, i) => {
                const causasA = mockCausas.filter(c => c.abogado_id === a.id && c.estado === 'activa').length
                const tareasA = mockTareas.filter(t => t.asignado_a === a.id && t.estado !== 'finalizado').length
                return (
                  <Link key={a.id} to={`/equipo/${a.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <div className={cn('w-8 h-8 rounded-full bg-gradient-to-br text-white text-xs font-bold flex items-center justify-center flex-shrink-0', avatarColors[i % avatarColors.length])}>
                      {initials(a.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{a.full_name}</p>
                      <p className="text-[11px] text-slate-400 capitalize">{a.role}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{causasA} causas</p>
                      <p className="text-[10px] text-slate-400">{tareasA} tareas</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── helpers ── */
function Section({ title, to, linkLabel, children }: { title: string; to: string; linkLabel: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-50 dark:border-slate-800">
        <p className="text-ios-headline font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        <Link to={to} className="text-ios-subhead text-primary-600 font-medium">{linkLabel}</Link>
      </div>
      {children}
    </div>
  )
}

function Card({ title, to, linkLabel, children }: { title: string; to: string; linkLabel: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-50 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        <Link to={to} className="text-xs text-primary-600 font-medium hover:underline">{linkLabel}</Link>
      </div>
      {children}
    </div>
  )
}

function Row({ children, last }: { children: React.ReactNode; last: boolean }) {
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3 min-h-[44px]', !last && 'border-b border-slate-50 dark:border-slate-800')}>
      {children}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-xs text-slate-400 text-center py-8">{text}</p>
}

function DaysBadge({ dias }: { dias: number }) {
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0',
      dias <= 1 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
      dias <= 7 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
      'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
    )}>
      {dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : `${dias}d`}
    </span>
  )
}
