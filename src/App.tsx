import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import AppLayout from '@/components/layout/AppLayout'
import UpdatePrompt from '@/components/ui/UpdatePrompt'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import ClientesPage from '@/pages/ClientesPage'
import ClienteFormPage from '@/pages/ClienteFormPage'
import CausasPage from '@/pages/CausasPage'
import CausaFormPage from '@/pages/CausaFormPage'
import AgendaPage from '@/pages/AgendaPage'
import DocumentosPage from '@/pages/DocumentosPage'
import HonorariosPage from '@/pages/HonorariosPage'
import MasPage from '@/pages/MasPage'
import MiPerfilPage from '@/pages/MiPerfilPage'
import EquipoPage from '@/pages/EquipoPage'
import PerfilAbogadoPage from '@/pages/PerfilAbogadoPage'
import TareasPage from '@/pages/TareasPage'
import PlanillasPage from '@/pages/PlanillasPage'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/clientes/nuevo" element={<ClienteFormPage />} />
            <Route path="/clientes/:id" element={<ClienteFormPage />} />
            <Route path="/causas" element={<CausasPage />} />
            <Route path="/causas/nueva" element={<CausaFormPage />} />
            <Route path="/causas/:id" element={<CausaFormPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route path="/honorarios" element={<HonorariosPage />} />
            <Route path="/equipo" element={<EquipoPage />} />
            <Route path="/equipo/:id" element={<PerfilAbogadoPage />} />
            <Route path="/tareas" element={<TareasPage />} />
            <Route path="/planillas" element={<PlanillasPage />} />
            <Route path="/mas" element={<MasPage />} />
            <Route path="/perfil" element={<MiPerfilPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
      </ToastProvider>
      <UpdatePrompt />
      </ThemeProvider>
    </BrowserRouter>
  )
}
