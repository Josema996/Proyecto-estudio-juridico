import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, Camera, Pencil, Check, X, FolderOpen, Calendar, DollarSign, CheckSquare, Bell, ChevronRight, Clock, AlertCircle, Fingerprint } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { checkBiometricSupport } from '@/hooks/useBiometric'
import { mockCausas, mockEventos, mockHonorarios, mockTareas, eventoConCausa } from '@/lib/mockData'
import MobileHeader from '@/components/layout/MobileHeader'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { CausaEstado, TareaEstado } from '@/types/database'

const estadoVariant: Record<CausaEstado, 'success' | 'warning' | 'default' | 'info'> = {
  activa: 'success', suspendida: 'warning', archivada: 'default', resuelta: 'info',
}
const roleLabel: Record<string, string> = {
  titular: 'Titular', asociado: 'Asociado/a', administrativo: 'Administrativo/a', cliente: 'Cliente',
}
const tareaConfig: Record<TareaEstado, { label: string; color: string; icon: typeof Clock }> = {
  pendiente:  { label: 'Pendiente',  color: 'text-slate-500 dark:text-slate-400',     icon: Clock       },
  en_proceso: { label: 'En proceso', color: 'text-amber-600 dark:text-amber-400',     icon: AlertCircle },
  finalizado: { label: 'Finalizado', color: 'text-emerald-600 dark:text-emerald-400', icon: Check as any},
}

type Tab = 'causas' | 'agenda' | 'honorarios' | 'tareas'

export default function MiPerfilPage() {
  const { profile, hasBiometric, setupBiometric, removeBiometric } = useAuth()
  const isMobile = useIsMobile()
  const fileRef = useRef<HTMLInputElement>(null)

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState(profile?.full_name ?? '')
  const [telefono, setTelefono] = useState(profile?.phone ?? '')
  const [tab, setTab] = useState<Tab>('causas')
  const [bioSupported, setBioSupported] = useState(false)
  const [bioLoading, setBioLoading] = useState(false)

  useEffect(() => { checkBiometricSupport().then(setBioSupported) }, [])

  async function handleToggleBio() {
    if (hasBiometric) {
      removeBiometric()
    } else {
      setBioLoading(true)
      await setupBiometric()
      setBioLoading(false)
    }
  }

  if (!profile) return null

  const userId = profile.id
  const initials = profile.full_name.split(' ').filter(w => /^[A-ZÁÉÍÓÚÑ]/i.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase()

  // Datos filtrados por el usuario logueado
  const causas    = mockCausas.filter(c => c.abogado_id === userId)
  const activas   = causas.filter(c => c.estado === 'activa')
  const now       = new Date()
  const eventos   = mockEventos.filter(e => e.participantes_ids.includes(userId)).map(eventoConCausa)
  const proximos  = eventos.filter(e => new Date(e.fecha_hora) >= now).sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
  const honorarios = mockHonorarios.filter(h => causas.some(c => c.id === h.causa_id))
  const tareas    = mockTareas.filter(t => t.asignado_a === userId && t.estado !== 'finalizado')

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarUrl(url)
  }

  function urgencia(fecha: string) {
    const d = Math.ceil((new Date(fecha).getTime() - now.getTime()) / 86400000)
    if (d <= 0) return { label: 'Hoy',    cls: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' }
    if (d === 1) return { label: 'Mañana', cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' }
    return        { label: `${d}d`,        cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' }
  }

  const tabs: { id: Tab; label: string; icon: typeof FolderOpen; count: number }[] = [
    { id: 'causas',     label: 'Causas',     icon: FolderOpen,  count: causas.length    },
    { id: 'agenda',     label: 'Agenda',     icon: Calendar,    count: proximos.length  },
    { id: 'honorarios', label: 'Honorarios', icon: DollarSign,  count: honorarios.length},
    { id: 'tareas',     label: 'Tareas',     icon: CheckSquare, count: tareas.length    },
  ]

  const AvatarSection = (
    <div className="relative inline-block">
      <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary-500/30 flex-shrink-0">
        {avatarUrl
          ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white font-bold text-3xl">{initials}</div>
        }
      </div>
      <button
        onClick={() => fileRef.current?.click()}
        className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <Camera className="w-3.5 h-3.5 text-white" />
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
    </div>
  )

  const TabContent = () => {
    if (tab === 'causas') return (
      <div className="space-y-2">
        {causas.length === 0
          ? <Empty icon={FolderOpen} text="Sin causas asignadas" />
          : causas.map(c => (
            <Link key={c.id} to={`/causas/${c.id}`}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all p-4 flex items-center gap-3 group">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs font-semibold text-primary-600 mb-0.5">{c.numero_expediente}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{c.caratula}</p>
                {c.fuero && <p className="text-xs text-slate-400 mt-0.5">{c.fuero}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge label={c.estado} variant={estadoVariant[c.estado]} />
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              </div>
            </Link>
          ))
        }
      </div>
    )

    if (tab === 'agenda') return (
      <div className="space-y-2">
        {proximos.length === 0
          ? <Empty icon={Calendar} text="Sin eventos próximos" />
          : proximos.map(ev => {
            const fecha = new Date(ev.fecha_hora)
            const urg = urgencia(ev.fecha_hora)
            return (
              <div key={ev.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card p-4 flex items-center gap-3">
                <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-2.5 text-center min-w-[48px] flex-shrink-0">
                  <p className="text-[9px] font-semibold text-primary-400 uppercase">{fecha.toLocaleDateString('es-AR', { month: 'short' })}</p>
                  <p className="text-xl font-bold text-primary-700 dark:text-primary-300 leading-none">{fecha.getDate()}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{ev.titulo}</p>
                  {ev.causa && <p className="text-xs text-slate-400 mt-0.5 font-mono">{ev.causa.numero_expediente}</p>}
                  <p className="text-xs text-slate-400">{fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${urg.cls}`}>{urg.label}</span>
                  {ev.recordatorio_enviado && <Bell className="w-3 h-3 text-primary-400" />}
                </div>
              </div>
            )
          })
        }
      </div>
    )

    if (tab === 'honorarios') return (
      <div className="space-y-2">
        {honorarios.length === 0
          ? <Empty icon={DollarSign} text="Sin honorarios registrados" />
          : honorarios.map(h => {
            const causa = causas.find(c => c.id === h.causa_id)
            const pct = h.monto_total > 0 ? Math.round((h.monto_pagado / h.monto_total) * 100) : 0
            return (
              <div key={h.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">{h.concepto}</p>
                    {causa && <p className="text-xs font-mono text-primary-600 mt-0.5">{causa.numero_expediente}</p>}
                  </div>
                  <Badge label={h.estado} variant={h.estado === 'cancelado' ? 'success' : h.estado === 'parcial' ? 'warning' : 'danger'} />
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs">Total: <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(h.monto_total)}</span></span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">Cobrado: {formatCurrency(h.monto_pagado)}</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                  <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-1">{pct}% cobrado · {formatDate(h.fecha_acuerdo)}</p>
              </div>
            )
          })
        }
      </div>
    )

    if (tab === 'tareas') return (
      <div className="space-y-2">
        {tareas.length === 0
          ? <Empty icon={CheckSquare} text="Sin tareas pendientes" />
          : tareas.map(t => {
            const cfg = tareaConfig[t.estado]
            const Icon = cfg.icon
            const causa = causas.find(c => c.id === t.causa_id)
            return (
              <div key={t.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-card p-4 flex items-center gap-3">
                <Icon className={cn('w-4 h-4 flex-shrink-0', cfg.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{t.titulo}</p>
                  {causa && <p className="text-xs font-mono text-primary-600 mt-0.5">{causa.numero_expediente}</p>}
                  {t.fecha_vencimiento && <p className="text-xs text-slate-400 mt-0.5">Vence: {formatDate(t.fecha_vencimiento)}</p>}
                </div>
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0',
                  t.prioridad === 'alta'  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  t.prioridad === 'media' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-500'
                )}>{t.prioridad}</span>
              </div>
            )
          })
        }
      </div>
    )

    return null
  }

  /* ── MOBILE ── */
  if (isMobile) {
    return (
      <div>
        <MobileHeader title="Mi perfil" />
        <div className="pb-8">
          {/* Header con avatar centrado */}
          <div className="px-4 pt-6 pb-5 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            {AvatarSection}
            <div className="mt-3">
              {editando
                ? <input value={nombre} onChange={e => setNombre(e.target.value)}
                    className="text-center text-lg font-bold bg-transparent border-b border-primary-500 text-slate-900 dark:text-slate-100 outline-none pb-0.5 w-48" />
                : <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{nombre}</p>
              }
              <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                {roleLabel[profile.role]}
              </span>
            </div>

            {/* Datos de contacto */}
            <div className="mt-4 w-full space-y-2 text-left">
              <div className="flex items-center gap-2.5 px-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{profile.email}</p>
              </div>
              <div className="flex items-center gap-2.5 px-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {editando
                  ? <input value={telefono} onChange={e => setTelefono(e.target.value)}
                      className="flex-1 text-sm bg-transparent border-b border-primary-500 text-slate-900 dark:text-slate-100 outline-none" />
                  : <p className="text-sm text-slate-500 dark:text-slate-400">{telefono || '—'}</p>
                }
              </div>
            </div>

            {/* Botón editar */}
            <div className="mt-4 flex gap-2 w-full">
              {editando
                ? <>
                    <button onClick={() => setEditando(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white">
                      <Check className="w-3.5 h-3.5" /> Guardar
                    </button>
                    <button onClick={() => { setNombre(profile.full_name); setTelefono(profile.phone ?? ''); setEditando(false) }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </button>
                  </>
                : <button onClick={() => setEditando(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Pencil className="w-3.5 h-3.5" /> Editar perfil
                  </button>
              }
            </div>
            {bioSupported && (
              <button onClick={handleToggleBio} disabled={bioLoading}
                className={`mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${hasBiometric ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'}`}>
                <Fingerprint className="w-3.5 h-3.5" />
                {bioLoading ? 'Configurando...' : hasBiometric ? 'Desactivar huella / Face ID' : 'Activar huella / Face ID'}
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-thin px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${tab === t.id ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
                <t.icon className="w-3 h-3" />
                {t.label}
                {t.count > 0 && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{t.count}</span>}
              </button>
            ))}
          </div>

          <div className="px-4 pt-3">
            <TabContent />
          </div>
        </div>
      </div>
    )
  }

  /* ── DESKTOP ── */
  return (
    <div className="p-8 max-w-6xl w-full">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Mi perfil</h1>

      <div className="grid grid-cols-4 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-4">
          {/* Card avatar + datos */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card p-6">
            <div className="flex flex-col items-center text-center mb-5">
              {AvatarSection}
              <div className="mt-4 w-full">
                {editando
                  ? <input value={nombre} onChange={e => setNombre(e.target.value)}
                      className="w-full text-center text-lg font-bold bg-transparent border-b border-primary-500 text-slate-900 dark:text-slate-100 outline-none pb-1" />
                  : <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">{nombre}</p>
                }
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg mt-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {roleLabel[profile.role]}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100 break-all">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 mb-0.5">Teléfono</p>
                  {editando
                    ? <input value={telefono} onChange={e => setTelefono(e.target.value)}
                        className="w-full text-sm bg-transparent border-b border-primary-500 text-slate-900 dark:text-slate-100 outline-none" />
                    : <p className="text-sm text-slate-900 dark:text-slate-100">{telefono || '—'}</p>
                  }
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              {editando
                ? <>
                    <button onClick={() => setEditando(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                      <Check className="w-3.5 h-3.5" /> Guardar
                    </button>
                    <button onClick={() => { setNombre(profile.full_name); setTelefono(profile.phone ?? ''); setEditando(false) }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </button>
                  </>
                : <button onClick={() => setEditando(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Editar perfil
                  </button>
              }
            </div>

            {bioSupported && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handleToggleBio} disabled={bioLoading}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${hasBiometric ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30'}`}>
                  <Fingerprint className="w-3.5 h-3.5" />
                  {bioLoading ? 'Configurando...' : hasBiometric ? 'Desactivar huella / Face ID' : 'Activar huella / Face ID'}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Columna derecha — tabs */}
        <div className="col-span-3 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${tab === t.id ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                <t.icon className="w-4 h-4" />
                {t.label}
                {t.count > 0 && <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{t.count}</span>}
              </button>
            ))}
          </div>

          <TabContent />
        </div>
      </div>
    </div>
  )
}

function Empty({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 py-14 text-center">
      <Icon className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  )
}
