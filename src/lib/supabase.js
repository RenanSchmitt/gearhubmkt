import { createClient } from '@supabase/supabase-js'

// O Vite exige o "import.meta.env" para ler as variáveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)