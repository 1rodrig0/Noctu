const info = [
  { t: "Filtros Avanzados", d: "Música en vivo, DJ set, estilos y tipos de tragos.", i: "🎧" },
  { t: "Seguridad Legal", d: "Solo establecimientos con licencia vigente (Ley 164).", i: "⚖️" },
  { t: "Aforo Real", d: "Conoce cuántas personas hay antes de llegar al lugar.", i: "📊" }
];

export default function Features() {
  return (
    <section className="py-20 px-6 bg-white/5">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {info.map((item, idx) => (
          <div key={idx} className="p-8 rounded-3xl border border-white/10 bg-slate-900/50">
            <div className="text-4xl mb-4">{item.i}</div>
            <h3 className="text-xl font-bold mb-2">{item.t}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
