import { useState } from 'react'
import { Upload, FileText, File, Image, Table, Download, Trash2, FolderOpen } from 'lucide-react'
import { mockDocumentos, mockCausas } from '@/lib/mockData'
import type { Documento } from '@/types/database'
import PageHeader from '@/components/ui/PageHeader'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { formatDate, cn } from '@/lib/utils'
import { Select } from '@/components/ui/Input'
import { useToast } from '@/contexts/ToastContext'

function formatSize(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ mime }: { mime: string | null }) {
  if (!mime) return <File className="w-5 h-5 text-slate-400" />
  if (mime === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />
  if (mime.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />
  if (mime.includes('spreadsheet') || mime.includes('excel')) return <Table className="w-5 h-5 text-emerald-500" />
  return <File className="w-5 h-5 text-slate-400 dark:text-slate-500" />
}

function FileTypeBadge({ mime }: { mime: string | null }) {
  if (!mime) return <span className="text-xs text-slate-400">—</span>
  if (mime === 'application/pdf')
    return <span className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-medium">PDF</span>
  if (mime.startsWith('image/'))
    return <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-medium">Imagen</span>
  if (mime.includes('spreadsheet'))
    return <span className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-medium">Excel</span>
  return <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-medium">Archivo</span>
}

export default function DocumentosPage() {
  const toast = useToast()
  const [causaFilter,   setCausaFilter]   = useState('')
  const [docs,          setDocs]          = useState<Documento[]>(mockDocumentos)
  const [dragging,      setDragging]      = useState(false)
  const [selectedCausa, setSelectedCausa] = useState('')
  const [confirmId,     setConfirmId]     = useState<string | null>(null)

  const filtered = causaFilter ? docs.filter(d => d.causa_id === causaFilter) : docs

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    addMockDoc(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    addMockDoc(file)
    e.target.value = ''
  }

  function addMockDoc(file: File) {
    const nuevo: Documento = {
      id:           `d-${Date.now()}`,
      causa_id:     selectedCausa || null,
      cliente_id:   null,
      nombre:       file.name,
      descripcion:  null,
      storage_path: `mock/${file.name}`,
      mime_type:    file.type,
      size_bytes:   file.size,
      uploaded_by:  'user-1',
      created_at:   new Date().toISOString(),
    }
    setDocs(d => [nuevo, ...d])
    toast.success('Documento subido', file.name)
  }

  function confirmDelete(id: string) { setConfirmId(id) }

  function handleDelete() {
    if (!confirmId) return
    const doc = docs.find(d => d.id === confirmId)
    setDocs(d => d.filter(doc => doc.id !== confirmId))
    setConfirmId(null)
    toast.success('Documento eliminado', doc?.nombre ?? '')
  }

  return (
    <div className="p-8 max-w-6xl w-full">
      <PageHeader title="Documentos" subtitle="Escritos, resoluciones y contratos" />

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 mb-6 text-center transition-all duration-200',
          dragging
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
        )}
      >
        <Upload className={cn('w-8 h-8 mx-auto mb-3 transition-colors', dragging ? 'text-primary-500' : 'text-slate-300 dark:text-slate-600')} />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
          {dragging ? 'Soltá el archivo aquí' : 'Arrastrá un archivo o hacé clic para seleccionar'}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">PDF, Word, Excel, imágenes — hasta 50 MB</p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Select value={selectedCausa} onChange={e => setSelectedCausa(e.target.value)} className="w-64 text-left">
            <option value="">Sin causa vinculada</option>
            {mockCausas.map(c => (
              <option key={c.id} value={c.id}>{c.numero_expediente} — {c.caratula.slice(0, 40)}</option>
            ))}
          </Select>
          <label className="cursor-pointer bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Seleccionar archivo
            <input type="file" className="hidden" onChange={handleFileInput} />
          </label>
        </div>
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-3 mb-4">
        <Select value={causaFilter} onChange={e => setCausaFilter(e.target.value)} className="w-72">
          <option value="">Todos los documentos</option>
          {mockCausas.map(c => (
            <option key={c.id} value={c.id}>{c.numero_expediente} — {c.caratula.slice(0, 40)}</option>
          ))}
        </Select>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {filtered.length} documento{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card py-20 text-center">
          <FolderOpen className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 dark:text-slate-500 text-sm">No hay documentos</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {['Archivo', 'Tipo', 'Tamaño', 'Causa', 'Fecha', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map(doc => {
                const causa = mockCausas.find(c => c.id === doc.causa_id)
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <FileIcon mime={doc.mime_type} />
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm max-w-xs truncate">{doc.nombre}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><FileTypeBadge mime={doc.mime_type} /></td>
                    <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500 text-xs">{formatSize(doc.size_bytes)}</td>
                    <td className="px-5 py-3.5">
                      {causa
                        ? <span className="text-xs font-mono text-primary-600 dark:text-primary-400">{causa.numero_expediente}</span>
                        : <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                      }
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500 text-xs">{formatDate(doc.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 rounded-lg transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {confirmId && (
        <ConfirmDialog
          title="¿Eliminar documento?"
          message={`"${docs.find(d => d.id === confirmId)?.nombre}" será eliminado permanentemente.`}
          confirmLabel="Eliminar"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
