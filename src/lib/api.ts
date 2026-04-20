// Cliente HTTP para la API REST del backend
const BASE_URL = import.meta.env.VITE_API_URL as string ?? 'http://localhost:3001'

function getToken(): string | null {
  return localStorage.getItem('token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const json = await res.json()
  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? `Error ${res.status}`)
  }
  return json
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string, orgSlug: string) =>
    request<{ data: { token: string; usuario: any; org: any } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, orgSlug }),
    }),

  register: (data: { orgNombre: string; orgSlug: string; email: string; password: string; nombreCompleto: string }) =>
    request<{ data: { token: string; usuario: any; org: any } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<{ data: { usuario: any; org: any } }>('/api/auth/me'),
}

// ── Clientes ──────────────────────────────────────────────────────────────────
export const clientesApi = {
  list: (q?: string) => request<{ data: any[] }>(`/api/clientes${q ? `?q=${q}` : ''}`),
  get:  (id: string) => request<{ data: any }>(`/api/clientes/${id}`),
  create: (body: any) => request<{ data: any }>('/api/clientes', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => request<{ data: any }>(`/api/clientes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => request('/api/clientes/' + id, { method: 'DELETE' }),
}

// ── Causas ────────────────────────────────────────────────────────────────────
export const causasApi = {
  list: (params?: { estado?: string; q?: string }) => {
    const qs = new URLSearchParams(params as any).toString()
    return request<{ data: any[] }>(`/api/causas${qs ? `?${qs}` : ''}`)
  },
  get:    (id: string) => request<{ data: any }>(`/api/causas/${id}`),
  create: (body: any)  => request<{ data: any }>('/api/causas', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => request<{ data: any }>(`/api/causas/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => request('/api/causas/' + id, { method: 'DELETE' }),
}

// ── Eventos ───────────────────────────────────────────────────────────────────
export const eventosApi = {
  list: (params?: { causaId?: string; desde?: string; hasta?: string }) => {
    const qs = new URLSearchParams(params as any).toString()
    return request<{ data: any[] }>(`/api/eventos${qs ? `?${qs}` : ''}`)
  },
  create: (body: any)  => request<{ data: any }>('/api/eventos', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => request<{ data: any }>(`/api/eventos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => request('/api/eventos/' + id, { method: 'DELETE' }),
}

// ── Honorarios ────────────────────────────────────────────────────────────────
export const honorariosApi = {
  list: (estado?: string) => request<{ data: any[]; meta: any }>(`/api/honorarios${estado ? `?estado=${estado}` : ''}`),
  create: (body: any)  => request<{ data: any }>('/api/honorarios', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: any) => request<{ data: any }>(`/api/honorarios/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => request('/api/honorarios/' + id, { method: 'DELETE' }),
}

// ── Documentos ────────────────────────────────────────────────────────────────
export const documentosApi = {
  list: (params?: { causaId?: string; clienteId?: string }) => {
    const qs = new URLSearchParams(params as any).toString()
    return request<{ data: any[] }>(`/api/documentos${qs ? `?${qs}` : ''}`)
  },
  create: (body: any)  => request<{ data: any }>('/api/documentos', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id: string) => request('/api/documentos/' + id, { method: 'DELETE' }),
}
