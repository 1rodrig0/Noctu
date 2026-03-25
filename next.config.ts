/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Configuración del compilador de React (si lo deseas activo)
  // Nota: Esto fue para Next 13/14 y podría ser eliminado en versiones posteriores.
  // reactCompiler: true, 

  // 2. Configuración de Imágenes Remotas (Crucial para Supabase Storage)
  images: {
    // Usamos remotePatterns para mayor seguridad en lugar de 'domains'
    remotePatterns: [
      {
        protocol: 'https',
        // Esto permite la carga desde CUALQUIER dominio terminado en .supabase.co
        // (Recomendado para desarrollo, pero ajusta 'hostname' para producción)
        hostname: '**.supabase.co', 
        port: '',
        // Restringimos la ruta a la ubicación estándar de archivos públicos de Supabase
        pathname: '/storage/v1/object/public/**', 
      },
    ],
  },
  
  // 3. Config|uración de Server Actions
  // Aunque Server Actions es estable en Next 14, la clave 'experimental' 
  // es la que a veces causa problemas si no está estructurada correctamente.
  // Si te sigue dando error, prueba a ELIMINAR esta sección por completo, 
  // ya que Server Actions está habilitado por defecto en 14.
  experimental: {
    serverActions:  {}
  },
};

module.exports = nextConfig;