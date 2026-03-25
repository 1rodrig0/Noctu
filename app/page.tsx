import NavbarLanding from '../components/NavbarLanding'
import Hero from '../components/Hero'
import Features from '../components/Features'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <NavbarLanding />
      <main>
        <Hero />
        <Features />
      </main>
      <footer className="py-10 text-center text-slate-500 border-t border-white/5">
        <p>© 2026 NOCTU SIG - Proyecto EMI Ingeniería de Sistemas</p>
      </footer>
    </div>
  )
}