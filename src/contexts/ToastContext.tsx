import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastAPI {
  success: (title: string, message?: string) => void
  error:   (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info:    (title: string, message?: string) => void
}

const ToastContext = createContext<ToastAPI | null>(null)

export function useToast(): ToastAPI {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
}
const styles: Record<ToastType, string> = {
  success: 'border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-slate-900',
  error:   'border-red-200 dark:border-red-800/40 bg-white dark:bg-slate-900',
  warning: 'border-amber-200 dark:border-amber-800/40 bg-white dark:bg-slate-900',
  info:    'border-blue-200 dark:border-blue-800/40 bg-white dark:bg-slate-900',
}
const iconStyles: Record<ToastType, string> = {
  success: 'text-emerald-500',
  error:   'text-red-500',
  warning: 'text-amber-500',
  info:    'text-blue-500',
}
const barStyles: Record<ToastType, string> = {
  success: 'bg-emerald-500',
  error:   'bg-red-500',
  warning: 'bg-amber-500',
  info:    'bg-blue-500',
}

const DURATION = 4000

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const Icon = icons[toast.type]

  useEffect(() => {
    const t = setTimeout(onDismiss, DURATION)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className={cn(
      'relative flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-xl min-w-[300px] max-w-sm overflow-hidden',
      'animate-in slide-in-from-right-5 fade-in duration-300',
      styles[toast.type]
    )}>
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconStyles[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</p>
        {toast.message && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={onDismiss} className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
      {/* Progress bar */}
      <div className={cn('absolute bottom-0 left-0 h-0.5 animate-toast-bar', barStyles[toast.type])} />
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = crypto.randomUUID()
    setToasts(p => [...p, { id, type, title, message }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id))
  }, [])

  const api: ToastAPI = {
    success: (t, m) => add('success', t, m),
    error:   (t, m) => add('error', t, m),
    warning: (t, m) => add('warning', t, m),
    info:    (t, m) => add('info', t, m),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastCard toast={t} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
