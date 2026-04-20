import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Calendar, Users, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hapticSelection } from '@/hooks/useHaptics'

const tabs = [
  { to: '/',          icon: LayoutDashboard, label: 'Inicio',  end: true },
  { to: '/causas',    icon: FolderOpen,      label: 'Causas'          },
  { to: '/agenda',    icon: Calendar,        label: 'Agenda'          },
  { to: '/clientes',  icon: Users,           label: 'Clientes'        },
  { to: '/mas',       icon: MoreHorizontal,  label: 'Más'             },
]

export default function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 flex pb-[env(safe-area-inset-bottom)]">
      {tabs.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => hapticSelection()}
          className={({ isActive }) => cn(
            'flex-1 flex flex-col items-center justify-center pt-2 pb-1 min-h-[49px] transition-colors duration-150',
            isActive ? 'text-primary-600' : 'text-slate-400 dark:text-slate-500'
          )}
        >
          {({ isActive }) => (
            <>
              <div className={cn(
                'w-12 h-7 flex items-center justify-center rounded-2xl transition-all duration-200',
                isActive && 'bg-primary-50 dark:bg-primary-900/30 scale-110'
              )}>
                <Icon className={cn('w-[22px] h-[22px] transition-all', isActive && 'stroke-[2.2px]')} />
              </div>
              <span className={cn(
                'text-[10px] mt-0.5 font-medium tracking-tight transition-all',
                isActive ? 'text-primary-600' : 'text-slate-400 dark:text-slate-500'
              )}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
