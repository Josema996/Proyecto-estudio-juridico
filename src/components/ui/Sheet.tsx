import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface SheetProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Sheet({ title, onClose, children }: SheetProps) {
  const startY = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY
  }

  function onTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientY - startY.current
    if (delta > 80) onClose()
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative bg-white dark:bg-slate-900 rounded-t-3xl shadow-modal animate-slide-up max-h-[92vh] flex flex-col"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <h2 className="text-[17px] font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="w-[44px] h-[44px] flex items-center justify-center -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1.5">
              <X className="w-4 h-4" />
            </div>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  )
}
