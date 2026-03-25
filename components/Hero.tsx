import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight">
          Explora la noche con <br />
          <span className="text-yellow-500">Inteligencia Geográfica</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10">
          Encuentra los mejores locales en La Paz filtrando por estilo de música, 
          costo de cover y aforo en tiempo real. Todo bajo normativa legal.
        </p>
        
        <div className="flex justify-center gap-4">
          {/* Implementación de la redirección profesional */}
          <Link href="/mapa">
            <button className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/10">
              Ver Mapa en Vivo
            </button>
          </Link>
        </div>
      </div>

      {/* Luz de fondo decorativa */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] -z-10"></div>
    </section>
  )
}