export type UserRole = 'titular' | 'asociado' | 'administrativo' | 'cliente'
export type CausaEstado = 'activa' | 'suspendida' | 'archivada' | 'resuelta'
export type HonorarioEstado = 'pendiente' | 'parcial' | 'cancelado'
export type EventoTipo = 'audiencia' | 'vencimiento' | 'reunion' | 'otro'
export type TareaEstado = 'pendiente' | 'en_proceso' | 'finalizado'
export type TareaPrioridad = 'baja' | 'media' | 'alta'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: string
  nombre: string
  apellido: string
  dni: string | null
  email: string | null
  phone: string | null
  direccion: string | null
  notas: string | null
  created_at: string
  updated_at: string
}

export interface Causa {
  id: string
  numero_expediente: string
  caratula: string
  fuero: string | null
  juzgado: string | null
  estado: CausaEstado
  cliente_id: string | null
  abogado_id: string | null
  descripcion: string | null
  fecha_inicio: string | null
  created_at: string
  updated_at: string
  // joins
  cliente?: Cliente | null
  abogado?: Profile | null
}

export interface Documento {
  id: string
  causa_id: string | null
  cliente_id: string | null
  nombre: string
  descripcion: string | null
  storage_path: string
  mime_type: string | null
  size_bytes: number | null
  uploaded_by: string | null
  created_at: string
}

export interface Evento {
  id: string
  titulo: string
  descripcion: string | null
  tipo: EventoTipo
  fecha_hora: string
  causa_id: string | null
  creado_por: string | null
  recordatorio_enviado: boolean
  participantes_ids: string[]
  created_at: string
  // joins
  causa?: Causa | null
}

export interface Honorario {
  id: string
  causa_id: string | null
  cliente_id: string | null
  concepto: string
  monto_total: number
  monto_pagado: number
  estado: HonorarioEstado
  fecha_acuerdo: string | null
  notas: string | null
  created_at: string
  updated_at: string
  // joins
  causa?: Causa | null
  cliente?: Cliente | null
}

export interface Tarea {
  id: string
  titulo: string
  descripcion: string | null
  estado: TareaEstado
  prioridad: TareaPrioridad
  asignado_a: string | null
  causa_id: string | null
  fecha_vencimiento: string | null
  creado_por: string
  created_at: string
  updated_at: string
  // joins
  asignado?: Profile | null
  causa?: Causa | null
}

// Supabase Database generic type (skeleton — se puede regenerar con CLI)
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Profile> }
      clientes: { Row: Cliente; Insert: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Cliente> }
      causas: { Row: Causa; Insert: Omit<Causa, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Causa> }
      documentos: { Row: Documento; Insert: Omit<Documento, 'id' | 'created_at'>; Update: Partial<Documento> }
      eventos: { Row: Evento; Insert: Omit<Evento, 'id' | 'created_at'>; Update: Partial<Evento> }
      honorarios: { Row: Honorario; Insert: Omit<Honorario, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Honorario> }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      causa_estado: CausaEstado
      honorario_estado: HonorarioEstado
      evento_tipo: EventoTipo
    }
  }
}
