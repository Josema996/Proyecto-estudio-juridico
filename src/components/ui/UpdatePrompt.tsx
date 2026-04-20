import { useEffect, useState } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (!r) return
      // Revisa al montar
      r.update()
      // Revisa cada 60 minutos mientras la app está abierta
      setInterval(() => r.update(), 60 * 60 * 1000)
    },
    onNeedRefresh() {
      setVisible(true)
    },
  })

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (needRefresh) setVisible(true)
  }, [needRefresh])

  function dismiss() {
    setNeedRefresh(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm animate-slide-up">
      <div className="bg-slate-900 dark:bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl px-4 py-3.5 flex items-center gap-3">
        <div className="bg-primary-600/20 p-2 rounded-xl flex-shrink-0">
          <RefreshCw className="w-4 h-4 text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">Nueva versión disponible</p>
          <p className="text-xs text-slate-400 mt-0.5">Actualizá para ver los últimos cambios.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => updateServiceWorker(true)}
            className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Actualizar
          </button>
          <button
            onClick={dismiss}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
