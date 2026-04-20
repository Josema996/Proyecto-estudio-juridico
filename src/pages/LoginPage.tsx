import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useIsMobile } from '@/hooks/useIsMobile'
import { checkBiometricSupport } from '@/hooks/useBiometric'
import { Scale, ArrowRight, Lock, Mail, Eye, EyeOff, CheckCircle2, Fingerprint } from 'lucide-react'

const features = [
  'Gestión de expedientes y causas',
  'Agenda con alertas de vencimientos',
  'Control de honorarios en tiempo real',
  'Asignación de tareas al equipo',
]

function delay(ms: number): React.CSSProperties {
  return { animationDelay: `${ms}ms`, animationFillMode: 'both' }
}

function BiometricSetupPrompt({ onAccept, onDismiss }: { onAccept: () => void; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-3xl p-6 text-center space-y-4"
        style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Fingerprint className="w-8 h-8 text-primary-400" />
          </div>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Activar acceso biométrico</h3>
          <p className="text-slate-400 text-sm mt-1">
            Ingresá más rápido usando tu huella digital o Face ID sin necesidad de contraseña.
          </p>
        </div>
        <div className="space-y-2 pt-1">
          <button onClick={onAccept}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
            Activar huella / Face ID
          </button>
          <button onClick={onDismiss}
            className="w-full py-3 rounded-xl text-slate-400 text-sm hover:text-slate-300 transition-colors">
            Ahora no
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const { signIn, signInWithBiometric, setupBiometric, hasBiometric } = useAuth()
  const navigate   = useNavigate()
  const isMobile   = useIsMobile()

  const [email,          setEmail]          = useState('demo@estudiojuridico.com')
  const [password,       setPassword]       = useState('demo1234')
  const [showPass,       setShowPass]       = useState(false)
  const [error,          setError]          = useState<string | null>(null)
  const [loading,        setLoading]        = useState(false)
  const [bioLoading,     setBioLoading]     = useState(false)
  const [bioSupported,   setBioSupported]   = useState(false)
  const [showBioPrompt,  setShowBioPrompt]  = useState(false)

  useEffect(() => {
    checkBiometricSupport().then(setBioSupported)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError(error); return }
    if (bioSupported && !hasBiometric) {
      setShowBioPrompt(true)
    } else {
      navigate('/')
    }
  }

  async function handleBiometricLogin() {
    setBioLoading(true)
    setError(null)
    const { error } = await signInWithBiometric()
    setBioLoading(false)
    if (error) setError('No se pudo verificar la identidad. Usá tu contraseña.')
    else navigate('/')
  }

  async function handleBioSetup() {
    setShowBioPrompt(false)
    const ok = await setupBiometric()
    if (!ok) {
      // El usuario canceló o el dispositivo no lo soportó — igual entramos
    }
    navigate('/')
  }

  const biometricButton = bioSupported && hasBiometric && (
    <button
      type="button"
      onClick={handleBiometricLogin}
      disabled={bioLoading}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all"
      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
    >
      {bioLoading
        ? <><Spinner /><span>Verificando...</span></>
        : <><Fingerprint className="w-5 h-5" /><span>Ingresar con huella / Face ID</span></>
      }
    </button>
  )

  /* ─── MOBILE ─── */
  if (isMobile) {
    return (
      <>
        <div
          className="min-h-screen flex flex-col justify-center px-6 py-10"
          style={{
            background: 'linear-gradient(160deg, #0f172a 0%, #0d1629 60%, #0f0f23 100%)',
            paddingTop:    'max(40px, env(safe-area-inset-top))',
            paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          }}
        >
          <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgb(255 255 255) 1px,transparent 1px),linear-gradient(90deg,rgb(255 255 255) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />

          <div className="flex flex-col items-center mb-10 animate-enter-bottom" style={delay(0)}>
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-3xl blur-xl scale-110"
                style={{ background: 'rgba(99,102,241,0.35)' }} />
              <div className="relative bg-gradient-to-br from-primary-500 to-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl">
                <Scale className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Estudio Jurídico</h1>
            <p className="text-slate-400 text-sm mt-1">Sistema de Gestión Profesional</p>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-5">
            <div className="animate-enter-bottom" style={delay(120)}>
              <h2 className="text-xl font-bold text-white mb-0.5">Bienvenido</h2>
              <p className="text-slate-400 text-sm">Ingresá con tus credenciales</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-enter-bottom" style={delay(200)}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none transition"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    placeholder="tu@email.com" />
                </div>
              </div>

              <div className="animate-enter-bottom" style={delay(260)}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none transition"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                  {error}
                </div>
              )}

              <div className="animate-enter-bottom pt-1 space-y-3" style={delay(320)}>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-2xl transition-all text-base min-h-[56px]"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>
                  {loading ? <><Spinner />Ingresando...</> : <><span>Ingresar</span><ArrowRight className="w-5 h-5" /></>}
                </button>
                {biometricButton}
              </div>
            </form>

            <p className="text-center text-xs text-slate-600 animate-enter-bottom" style={delay(380)}>
              Modo demo · cualquier credencial funciona
            </p>
          </div>
        </div>

        {showBioPrompt && (
          <BiometricSetupPrompt
            onAccept={handleBioSetup}
            onDismiss={() => { setShowBioPrompt(false); navigate('/') }}
          />
        )}
      </>
    )
  }

  /* ─── DESKTOP ─── */
  return (
    <>
      <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d1629 50%, #0f0f23 100%)' }}>
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-16 py-14">
          <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgb(255 255 255) 1px,transparent 1px),linear-gradient(90deg,rgb(255 255 255) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="fixed top-0 left-[25%] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

          <div className="flex items-center gap-3 animate-enter-left" style={delay(0)}>
            <div className="bg-gradient-to-br from-primary-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Estudio Jurídico</span>
            <span className="text-[11px] text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">Sistema de Gestión</span>
          </div>

          <div className="space-y-7">
            <div className="animate-enter-left" style={delay(100)}>
              <div className="inline-flex items-center gap-2 border border-primary-500/25 rounded-full px-3 py-1"
                style={{ background: 'rgba(99,102,241,0.08)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                <span className="text-primary-300 text-xs font-medium">Plataforma profesional</span>
              </div>
            </div>

            <h2 className="text-5xl font-bold text-white leading-[1.1] animate-enter-left" style={delay(180)}>
              Gestioná tu<br />
              <span style={{ background: 'linear-gradient(90deg, #818cf8, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                estudio jurídico
              </span>
            </h2>

            <p className="text-slate-400 text-base leading-relaxed max-w-sm animate-enter-left" style={delay(260)}>
              Causas, clientes, agenda y honorarios en un solo lugar. Diseñado para estudios profesionales.
            </p>

            <ul className="space-y-4 animate-enter-left" style={delay(340)}>
              {features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-slate-600 text-xs animate-enter-left" style={delay(420)}>
            © 2025 Estudio Jurídico · Todos los derechos reservados
          </p>
        </div>

        <div className="hidden lg:block w-px flex-shrink-0 relative self-stretch">
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, #334155 30%, #334155 70%, transparent 100%)' }} />
          <div className="absolute inset-y-[20%] w-px animate-glow-line"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, #6366f1 50%, transparent 100%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse"
            style={{ boxShadow: '0 0 16px 5px rgba(99,102,241,0.55)' }} />
        </div>

        <div className="flex-1 flex items-center justify-center px-12 lg:px-20">
          <div className="w-full max-w-md animate-enter-right" style={delay(150)}>
            <div className="mb-10 animate-enter-bottom" style={delay(280)}>
              <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
              <p className="text-slate-400">Ingresá con tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-enter-bottom" style={delay(360)}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none transition"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
                    onBlur={e =>  { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                    placeholder="tu@email.com" />
                </div>
              </div>

              <div className="animate-enter-bottom" style={delay(420)}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Contraseña</label>
                  <button type="button" className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                  <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none transition"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
                    onBlur={e =>  { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm px-4 py-3 rounded-xl animate-enter-bottom"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                  {error}
                </div>
              )}

              <div className="animate-enter-bottom space-y-3 pt-1" style={delay(480)}>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 32px rgba(99,102,241,0.5)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(99,102,241,0.35)' }}>
                  {loading ? <><Spinner />Ingresando...</> : <><span>Ingresar al sistema</span><ArrowRight className="w-4 h-4" /></>}
                </button>
                {biometricButton}
              </div>
            </form>

            <div className="mt-8 animate-enter-bottom" style={delay(540)}>
              <div className="h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
              <p className="text-center text-xs text-slate-600">
                Modo demo · cualquier email y contraseña funciona
              </p>
            </div>
          </div>
        </div>
      </div>

      {showBioPrompt && (
        <BiometricSetupPrompt
          onAccept={handleBioSetup}
          onDismiss={() => { setShowBioPrompt(false); navigate('/') }}
        />
      )}
    </>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4 text-white mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}
