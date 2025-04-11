// js/supabase-config.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"

// Usar variables de entorno que configuraremos en Vercel
const supabaseUrl = window.SUPABASE_URL || "url_por_defecto"
const supabaseAnonKey = window.SUPABASE_ANON_KEY || "clave_por_defecto"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
