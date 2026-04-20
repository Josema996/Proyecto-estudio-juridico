const STORAGE_KEY = 'biometric_credential_id'
const STORAGE_RAW_KEY = 'biometric_credential_raw'

export function isBiometricAvailable(): boolean {
  return (
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
  )
}

export async function checkBiometricSupport(): Promise<boolean> {
  if (!isBiometricAvailable()) return false
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

export function hasBiometricRegistered(): boolean {
  // Verifica que haya un raw ID válido (no solo el string ID)
  return !!localStorage.getItem(STORAGE_RAW_KEY)
}

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  const binary = atob(padded)
  const buffer = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i)
  return buffer.buffer
}

export async function registerBiometric(userId: string): Promise<boolean> {
  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'Estudio Jurídico', id: window.location.hostname },
        user: {
          id: new TextEncoder().encode(userId),
          name: userId,
          displayName: 'Usuario Estudio Jurídico',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      },
    }) as PublicKeyCredential | null

    if (!credential) return false

    // Guardamos el rawId como base64url (confiable para re-usar)
    const rawId = bufferToBase64url(credential.rawId)
    localStorage.setItem(STORAGE_KEY, credential.id)
    localStorage.setItem(STORAGE_RAW_KEY, rawId)
    return true
  } catch {
    return false
  }
}

export async function authenticateWithBiometric(): Promise<boolean> {
  const rawId = localStorage.getItem(STORAGE_RAW_KEY)
  if (!rawId) return false

  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{
          id: base64urlToBuffer(rawId),
          type: 'public-key',
          transports: ['internal'],
        }],
        userVerification: 'required',
        timeout: 60000,
      },
    })
    return !!assertion
  } catch {
    return false
  }
}

export function removeBiometric(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STORAGE_RAW_KEY)
}
