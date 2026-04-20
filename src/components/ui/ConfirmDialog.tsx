import { AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  title:        string
  message:      string
  confirmLabel?: string
  cancelLabel?:  string
  variant?:     'danger' | 'warning' | 'info'
  onConfirm:    () => void
  onCancel:     () => void
}

export default function ConfirmDialog({
  title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar',
  variant = 'danger', onConfirm, onCancel,
}: ConfirmDialogProps) {
  const iconBg = variant === 'danger'  ? 'bg-red-100 dark:bg-red-900/30'
               : variant === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30'
               : 'bg-blue-100 dark:bg-blue-900/30'

  const iconColor = variant === 'danger'  ? 'text-red-600 dark:text-red-400'
                  : variant === 'warning' ? 'text-amber-600 dark:text-amber-400'
                  : 'text-blue-600 dark:text-blue-400'

  const btnColor = variant === 'danger'  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                 : variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
                 : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'

  const Icon = variant === 'info' ? Info : AlertTriangle

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className={cn(
        'relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm p-6',
        'animate-in zoom-in-95 fade-in duration-200'
      )}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0', iconBg)}>
            <Icon className={cn('w-7 h-7', iconColor)} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{message}</p>
          </div>
          <div className="flex gap-3 w-full pt-1">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={cn('flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2', btnColor)}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
