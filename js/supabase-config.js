// js/supabase-config.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"

// Usa directamente tus URLs y claves (reemplaza estos valores con los tuyos)
const supabaseUrl = "https://buuwyzypfkvkrbranisy.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dXd5enlwZmt2a3JicmFuaXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNDI4MDcsImV4cCI6MjA1OTkxODgwN30.AlsLQ12yHxrXH8zb1dmERBDiWh1WDW9K_ePE7ipz5Uc"

console.log("Conectando a Supabase con URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
