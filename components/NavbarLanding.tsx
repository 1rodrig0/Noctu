import Link from 'next/link'

export default function NavbarLanding() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-yellow-500 tracking-tighter">NOCTU</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Iniciar Sesión
          </Link>
          <Link href="/mapa" className="bg-yellow-500 text-slate-950 px-5 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all text-sm">
            Explorar Mapa
          </Link>
        </div>
      </div>
    </nav>
  )
}