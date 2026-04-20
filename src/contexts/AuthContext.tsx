import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Profile } from '@/types/database'
import { mockProfile } from '@/lib/mockData'

interface AuthContextValue {
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => {
    return sessionStorage.getItem('mock_auth') ? mockProfile : null
  })
  const [loading] = useState(false)

  async function signIn(email: string, password: string) {
    if (!email || password.length < 4) {
      return { error: 'Email o contraseña incorrectos' }
    }
    // Mock: cualquier email válido + contraseña de 4+ chars ingresa como titular
    const p = { ...mockProfile, email }
    setProfile(p)
    sessionStorage.setItem('mock_auth', '1')
    return { error: null }
  }

  function signOut() {
    setProfile(null)
    sessionStorage.removeItem('mock_auth')
  }

  return (
    <AuthContext.Provider value={{ profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
