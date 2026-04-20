import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Profile } from '@/types/database'
import { mockProfile } from '@/lib/mockData'
import { registerBiometric, authenticateWithBiometric, removeBiometric, hasBiometricRegistered } from '@/hooks/useBiometric'

interface AuthContextValue {
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithBiometric: () => Promise<{ error: string | null }>
  setupBiometric: () => Promise<boolean>
  removeBiometric: () => void
  hasBiometric: boolean
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => {
    return sessionStorage.getItem('mock_auth') ? mockProfile : null
  })
  const [loading] = useState(false)
  const [hasBiometric, setHasBiometric] = useState(() => hasBiometricRegistered())

  function doSignIn(email: string) {
    const p = { ...mockProfile, email }
    setProfile(p)
    sessionStorage.setItem('mock_auth', email)
  }

  async function signIn(email: string, password: string) {
    if (!email || password.length < 4) {
      return { error: 'Email o contraseña incorrectos' }
    }
    doSignIn(email)
    return { error: null }
  }

  async function signInWithBiometric() {
    const ok = await authenticateWithBiometric()
    if (!ok) return { error: 'Autenticación biométrica fallida' }
    const savedEmail = sessionStorage.getItem('mock_auth') || 'demo@estudiojuridico.com'
    doSignIn(savedEmail)
    return { error: null }
  }

  async function setupBiometric() {
    const savedEmail = sessionStorage.getItem('mock_auth') || profile?.email || 'user'
    const ok = await registerBiometric(savedEmail)
    if (ok) setHasBiometric(true)
    return ok
  }

  function handleRemoveBiometric() {
    removeBiometric()
    setHasBiometric(false)
  }

  function signOut() {
    setProfile(null)
    sessionStorage.removeItem('mock_auth')
  }

  return (
    <AuthContext.Provider value={{ profile, loading, signIn, signInWithBiometric, setupBiometric, removeBiometric: handleRemoveBiometric, hasBiometric, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
