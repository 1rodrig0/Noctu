// middleware.ts

import { createServerClient } from '@supabase/auth-helpers-nextjs'; 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/types/database.types';

// Tipado necesario para las opciones de cookies (para evitar error ts(7006) y posibles errores de sobrecarga)
type CookieOptions = { 
  domain?: string | undefined;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  maxAge?: number | undefined;
  path?: string | undefined;
  sameSite?: "lax" | "strict" | "none" | undefined;
  secure?: boolean | undefined;
};

// ===============================================
// FUNCIÓN PRINCIPAL DEL MIDDLEWARE (CORREGIDA)
// ===============================================

// ¡CRÍTICO: DEBE INCLUIR LA PALABRA CLAVE 'export'!
export async function middleware(req: NextRequest) { 
  // 1. Inicialización: Creamos la respuesta que usaremos para reescribir las cookies
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // 2. Cliente Supabase: Usamos createServerClient para leer y actualizar las cookies.
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        
        // CRÍTICO: Tipamos 'options' como CookieOptions
        set: (name: string, value: string, options: CookieOptions) => {
          req.cookies.set({ name, value, ...options });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => { // Tipamos 'options'
          req.cookies.set({ name, value: '', ...options });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({ name, value: '', ...options });
        },
      } as any // <-- Mantenemos el 'as any' para el conflicto de sobrecarga de la librería
    }
  );

  // 3. Refresh de Sesión
  const { data: { session } } = await supabase.auth.getSession();

  // 4. Lógica de Redirección (Tu lógica de App Router)
  const isAuthPath = req.nextUrl.pathname.startsWith('/login');
  const isHomePage = req.nextUrl.pathname === '/';

  if (!session && !isAuthPath && !isHomePage) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname); 
    return NextResponse.redirect(redirectUrl);
  }
  
  if (session && (isAuthPath || isHomePage)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // 5. Devolver la respuesta (con las cookies de sesión ACTUALIZADAS)
  return res;
}

// 6. Configuración de Matcher (DEBE estar exportada)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};