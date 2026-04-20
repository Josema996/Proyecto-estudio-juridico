import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase. Revisá el archivo .env')
}

// Sin generic Database para evitar conflictos con el tipado interno del SDK.
// Los tipos de la app están en src/types/database.ts y se usan manualmente.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
