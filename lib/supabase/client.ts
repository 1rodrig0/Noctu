// lib/supabase/client.ts

// 1. Importamos la función correcta
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'; 
import type { Database } from '@/lib/types/database.types';

// Verificamos que las variables de entorno públicas estén disponibles
// Esto es necesario porque tu versión de createBrowserClient espera los argumentos.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificación de existencia (para evitar errores en tiempo de ejecución)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// 2. La función crea y devuelve una instancia del cliente Supabase tipada.
export const createClient = () => {
  // Pasamos los argumentos requeridos explícitamente: URL y Anon Key.
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}