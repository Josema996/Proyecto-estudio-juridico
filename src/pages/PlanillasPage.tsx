import { useState } from 'react'
import {
  FileSpreadsheet, FileText, File, Download, Search,
  Star, ChevronRight, LayoutGrid, List,
} from 'lucide-react'
import { mockPlanillas, type PlanillaCategoria, type Planilla } from '@/lib/mockData'
import { downloadPlanilla } from '@/lib/planillaTemplates'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useToast } from '@/contexts/ToastContext'
import MobileHeader from '@/components/layout/MobileHeader'
import { cn } from '@/lib/utils'

const categorias: PlanillaCategoria[] = ['Civil', 'Laboral', 'Familia', 'Comercial', 'General']

const categoriaColor: Record<PlanillaCategoria, string> = {
  Civil:     'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
  Laboral:   'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
  Familia:   'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
  Comercial: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/40',
  General:   'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
}

const categoriaActiveBg: Record<PlanillaCategoria, string> = {
  Civil:     'bg-blue-600 border-blue-600 text-white',
  Laboral:   'bg-emerald-600 border-emerald-600 text-white',
  Familia:   'bg-rose-600 border-rose-600 text-white',
  Comercial: 'bg-violet-600 border-violet-600 text-white',
  General:   'bg-slate-600 border-slate-600 text-white',
}

const tipoConfig: Record<Planilla['tipo'], { icon: typeof File; label: string; color: string; bg: string }> = {
  xlsx: { icon: FileSpreadsheet, label: 'Excel',  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  docx: { icon: FileText,        label: 'Word',   color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-900/20'       },
  pdf:  { icon: File,            label: 'PDF',    color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-900/20'         },
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function CategoriaBadge({ cat }: { cat: PlanillaCategoria }) {
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', categoriaColor[cat])}>
      {cat}
    </span>
  )
}

function TipoBadge({ tipo }: { tipo: Planilla['tipo'] }) {
  const cfg = tipoConfig[tipo]
  return (
    <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md', cfg.bg, cfg.color)}>
      <cfg.icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

export default function PlanillasPage() {
  const isMobile  = useIsMobile()
  const toast     = useToast()
  const [search, setSearch]     = useState('')
  const [catFiltro, setCatFiltro] = useState<PlanillaCategoria | ''>('')
  const [vista, setVista]       = useState<'grid' | 'list'>('grid')

  const filtradas = mockPlanillas.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
    const matchCat    = !catFiltro || p.categoria === catFiltro
    return matchSearch && matchCat
  })

  function descargar(p: Planilla) {
    downloadPlanilla(p)
    const msg = p.tipo === 'pdf'
      ? 'Se abrió en una nueva pestaña. Usá Imprimir → Guardar como PDF.'
      : `Archivo ${p.tipo === 'xlsx' ? 'CSV/Excel' : 'Word'} descargado. Listo para editar.`
    toast.success(`${p.nombre}`, msg)
  }

  /* ─── MOBILE ─── */
  if (isMobile) {
    return (
      <div>
        <MobileHeader title="Planillas" />

        {/* Search */}
        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar planilla..."
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl pl-9 pr-4 py-2 text-ios-body outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Filtro categorías */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-thin">
          <button onClick={() => setCatFiltro('')}
            className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-ios-caption1 font-semibold border transition-all',
              !catFiltro ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            )}>
            Todas
          </button>
          {categorias.map(c => (
            <button key={c} onClick={() => setCatFiltro(catFiltro === c ? '' : c)}
              className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-ios-caption1 font-semibold border transition-all',
                catFiltro === c ? categoriaActiveBg[c] : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              )}>
              {c}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="px-4 pb-4">
          <p className="text-ios-caption1 text-slate-400 font-medium uppercase tracking-wider mb-2 px-1">
            {filtradas.length} planillas
          </p>
          <div className="bg-white dark:bg-slate-900 rounded-ios-xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
            {filtradas.length === 0 ? (
              <div className="py-14 text-center">
                <File className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-ios-subhead text-slate-400">Sin planillas</p>
              </div>
            ) : filtradas.map((p, i) => {
              const cfg = tipoConfig[p.tipo]
              return (
                <div key={p.id}
                  className={cn('flex items-center gap-3 px-4 py-3.5 min-h-[64px]',
                    i < filtradas.length - 1 && 'border-b border-slate-100 dark:border-slate-800'
                  )}>
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg)}>
                    <cfg.icon className={cn('w-5 h-5', cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <p className="text-ios-footnote font-semibold text-slate-900 dark:text-slate-100 truncate">{p.nombre}</p>
                      {p.popular && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CategoriaBadge cat={p.categoria} />
                      <TipoBadge tipo={p.tipo} />
                    </div>
                  </div>
                  <button onClick={() => descargar(p)}
                    className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 active:scale-95 transition-transform flex-shrink-0">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ─── DESKTOP ─── */
  return (
    <div className="p-8 max-w-7xl w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Planillas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {mockPlanillas.length} plantillas listas para descargar y editar
          </p>
        </div>
        {/* Vista toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <button onClick={() => setVista('grid')}
            className={cn('p-2 rounded-lg transition-all',
              vista === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            )}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setVista('list')}
            className={cn('p-2 rounded-lg transition-all',
              vista === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            )}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search + filtros */}
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar planilla..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCatFiltro('')}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              !catFiltro ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            )}>
            Todas · {mockPlanillas.length}
          </button>
          {categorias.map(c => (
            <button key={c} onClick={() => setCatFiltro(catFiltro === c ? '' : c)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                catFiltro === c ? categoriaActiveBg[c] : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              )}>
              {c} · {mockPlanillas.filter(p => p.categoria === c).length}
            </button>
          ))}
        </div>
      </div>

      {filtradas.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 py-20 text-center">
          <File className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No se encontraron planillas</p>
        </div>
      ) : vista === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-3 gap-4">
          {filtradas.map(p => {
            const cfg = tipoConfig[p.tipo]
            return (
              <div key={p.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 p-5 flex flex-col gap-4">

                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg)}>
                    <cfg.icon className={cn('w-6 h-6', cfg.color)} />
                  </div>
                  {p.popular && (
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-full px-2 py-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Popular</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug mb-1.5">
                    {p.nombre}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {p.descripcion}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <CategoriaBadge cat={p.categoria} />
                  <TipoBadge tipo={p.tipo} />
                  {p.paginas && (
                    <span className="text-[10px] text-slate-400 ml-auto">{p.paginas} pág.</span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                  <span className="text-xs text-slate-400">Act. {formatFecha(p.actualizado)}</span>
                  <button
                    onClick={() => descargar(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Planilla', 'Categoría', 'Formato', 'Páginas', 'Actualizado', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtradas.map(p => {
                const cfg = tipoConfig[p.tipo]
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg)}>
                          <cfg.icon className={cn('w-4 h-4', cfg.color)} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.nombre}</p>
                            {p.popular && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          </div>
                          <p className="text-xs text-slate-400 truncate max-w-xs">{p.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><CategoriaBadge cat={p.categoria} /></td>
                    <td className="px-5 py-3.5"><TipoBadge tipo={p.tipo} /></td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{p.paginas ? `${p.paginas} pág.` : '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{formatFecha(p.actualizado)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => descargar(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Download className="w-3.5 h-3.5" />
                        Descargar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
