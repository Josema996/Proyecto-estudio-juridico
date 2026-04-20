const STORAGE_KEY = 'biometric_credential_id'

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
  return !!localStorage.getItem(STORAGE_KEY)
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
    localStorage.setItem(STORAGE_KEY, credential.id)
    return true
  } catch {
    return false
  }
}

export async function authenticateWithBiometric(): Promise<boolean> {
  const credentialId = localStorage.getItem(STORAGE_KEY)
  if (!credentialId) return false

  try {
    const challenge = crypto.getRandomValues(new Uint8Array(32))

    function base64urlToBuffer(base64url: string): ArrayBuffer {
      const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
      const binary = atob(padded)
      const buffer = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i)
      return buffer.buffer
    }

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{
          id: base64urlToBuffer(credentialId),
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
}
