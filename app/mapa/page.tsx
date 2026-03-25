"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js'; 
import { LogOut, ChevronLeft, Map as MapIcon, Filter, Search, Star, DollarSign, ShieldCheck } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export default function MapaPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [locales, setLocales] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados de Filtros
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [soloConLicencia, setSoloConLicencia] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const centerLaPaz: [number, number] = [-16.4994, -68.1227];

  useEffect(() => {
    setIsMounted(true);
    fetchLocales();
    
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    });
  }, []);

  async function fetchLocales() {
    let query = supabase.from('establecimientos').select('*');
    
    if (filtroTipo !== 'todos') query = query.eq('tipo', filtroTipo);
    if (soloConLicencia) query = query.eq('tiene_licencia', true);
    if (minRating > 0) query = query.gte('rating', minRating);
    if (busqueda) query = query.ilike('nombre', `%${busqueda}%`);

    const { data, error } = await query;
    if (!error) setLocales(data);
  }

  useEffect(() => { if (isMounted) fetchLocales(); }, [filtroTipo, soloConLicencia, minRating, busqueda]);

  if (!isMounted) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-yellow-500 font-bold animate-pulse">CARGANDO SIG NOCTU...</p>
    </div>
  );

  return (
    <div className="h-screen w-full relative bg-slate-900 overflow-hidden font-sans">
      
      {/* --- BARRA SUPERIOR (Buscador y Navegación) --- */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col md:flex-row gap-2 items-center pointer-events-none">
        
        {/* Logo y Buscador */}
        <div className="flex gap-2 w-full md:w-auto pointer-events-auto">
            <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
                <MapIcon className="text-yellow-500 h-5 w-5" />
                <h1 className="text-white font-black italic text-lg hidden sm:block">NOCTU</h1>
            </div>

            <div className="relative flex-1 md:w-80 bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                    type="text"
                    placeholder="Buscar establecimiento..."
                    className="w-full bg-transparent p-3 pl-10 text-white text-sm outline-none focus:ring-1 focus:ring-yellow-500 transition-all"
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-2 ml-auto pointer-events-auto">
            <button 
                onClick={() => router.push('/')}
                className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-all shadow-xl flex items-center gap-2 text-xs font-bold"
            >
                <ChevronLeft className="h-4 w-4" /> VOLVER
            </button>
            <button 
                onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
                className="bg-red-500/10 backdrop-blur-md border border-red-500/30 p-3 rounded-2xl text-red-500 hover:bg-red-500/20 transition-all shadow-xl"
                title="Cerrar Sesión"
            >
                <LogOut className="h-4 w-4" />
            </button>
        </div>
      </div>

      {/* --- PANEL DE FILTROS LATERAL (Flotante) --- */}
      <aside className="absolute top-24 left-4 z-[1000] w-72 space-y-3 pointer-events-none">
        <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-5 rounded-3xl shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <Filter className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Filtros Inteligentes</span>
          </div>

          <div className="space-y-5">
            {/* Tipo */}
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Tipo de lugar</label>
              <select 
                className="w-full bg-slate-900 border border-white/10 p-2.5 rounded-xl text-white text-xs mt-1 outline-none focus:border-yellow-500 transition-all cursor-pointer"
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="todos">Todos los ambientes</option>
                <option value="discoteca">Discotecas</option>
                <option value="bar">Bares/Pubs</option>
                <option value="karaoke">Karaokes</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase ml-1 flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" /> Valoración Mínima
              </label>
              <div className="flex gap-2 mt-1">
                {[3, 4, 4.5].map((val) => (
                    <button
                        key={val}
                        onClick={() => setMinRating(minRating === val ? 0 : val)}
                        className={`flex-1 p-2 rounded-lg text-[10px] font-bold border transition-all ${minRating === val ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30'}`}
                    >
                        {val}+ ⭐
                    </button>
                ))}
              </div>
            </div>

            {/* Switch de Licencia */}
            <div className="pt-2 border-t border-white/5">
                <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className={`h-4 w-4 transition-colors ${soloConLicencia ? 'text-green-500' : 'text-slate-500'}`} />
                        <span className="text-xs text-white font-medium group-hover:text-yellow-500 transition-colors">Seguridad Ley 164</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-all ${soloConLicencia ? 'bg-green-600' : 'bg-slate-700'}`}>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            onChange={(e) => setSoloConLicencia(e.target.checked)}
                        />
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${soloConLicencia ? 'left-6' : 'left-1'}`} />
                    </div>
                </label>
            </div>
          </div>
        </div>

        {/* Info adicional abajo de filtros */}
        <div className="bg-yellow-500 p-3 rounded-2xl shadow-xl pointer-events-auto">
            <p className="text-[10px] text-black font-black leading-tight italic uppercase">
                Estás visualizando la base de datos SIG Noctu optimizada para La Paz.
            </p>
        </div>
      </aside>

      {/* --- MAPA --- */}
      <main className="h-full w-full z-0">
        <MapContainer 
            center={centerLaPaz} 
            zoom={14} 
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {locales.map((local: any) => (
            <Marker key={local.id} position={[local.latitud, local.longitud]}>
              <Popup className="noctu-popup">
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-black text-slate-900 text-base">{local.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                        {local.tipo}
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {local.rating}
                    </span>
                  </div>
                  <hr className="my-2 border-slate-200" />
                  <div className={`text-[10px] font-bold text-center p-1 rounded-lg ${local.tiene_licencia ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {local.tiene_licencia ? '✓ LOCAL AUTORIZADO' : '✗ EN REVISIÓN'}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>

      {/* --- ESTILOS ADICIONALES --- */}
      <style jsx global>{`
        .leaflet-container { background: #020617 !important; }
        .leaflet-popup-content-wrapper { 
            background: rgba(255, 255, 255, 0.9) !important; 
            backdrop-filter: blur(8px); 
            border-radius: 20px !important;
            border: 2px solid #e2e8f0;
        }
        .leaflet-popup-tip { background: rgba(255, 255, 255, 0.9) !important; }
      `}</style>
    </div>
  );
}