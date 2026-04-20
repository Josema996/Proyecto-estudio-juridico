import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { hapticLight } from '@/hooks/useHaptics'

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  action?: React.ReactNode
}

const routeTitles: Record<string, string> = {
  '/':           'Inicio',
  '/clientes':   'Clientes',
  '/causas':     'Causas',
  '/agenda':     'Agenda',
  '/documentos': 'Documentos',
  '/honorarios': 'Honorarios',
  '/mas':        'Más',
}

export function useMobileTitle(): string {
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/')[1]
  return routeTitles[base] ?? ''
}

export default function MobileHeader({ title, showBack, action }: MobileHeaderProps) {
  const navigate = useNavigate()

  function handleBack() {
    hapticLight()
    navigate(-1)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center h-[44px] px-2 relative">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center gap-0.5 h-[44px] px-2 text-primary-600 font-medium text-[17px] min-w-[44px]"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5px]" />
            <span className="text-[17px]">Atrás</span>
          </button>
        )}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap">
          {title}
        </h1>
        {action && (
          <div className="ml-auto flex items-center">
            {action}
          </div>
        )}
      </div>
    </header>
  )
}
