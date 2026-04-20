import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import Sidebar from './Sidebar'
import BottomTabBar from './BottomTabBar'

export default function AppLayout() {
  const { profile, loading } = useAuth()
  const isMobile = useIsMobile()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  if (!profile) return <Navigate to="/login" replace />

  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <main className="pb-[calc(57px+env(safe-area-inset-bottom))] animate-fade-in">
          <Outlet />
        </main>
        <BottomTabBar />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-auto min-h-screen animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
