import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code2, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Layers, 
  MonitorSmartphone 
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* --- NAV --- */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="bg-primary rounded-lg p-1">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tighter">NOCTU</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#servicios">Servicios</Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#proyectos">Proyectos</Link>
          <Link href="/login">
            <Button variant="outline" size="sm">Ingresar</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-dot-black/[0.2] relative">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Ingeniería de Software de <span className="text-primary">Nueva Generación</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Soluciones Full-Stack, IoT y Consultoría Legal Digital. Transformamos ideas complejas en sistemas eficientes para Bolivia y el mundo.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button className="px-8 h-12 text-lg gap-2">
                    Iniciar Proyecto <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#proyectos">
                  <Button variant="outline" className="px-8 h-12 text-lg">Ver Portafolio</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- SERVICIOS (Basado en tus estudios de 8vo Sem) --- */}
        <section id="servicios" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 sm:text-4xl">Especialidades Técnicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-all duration-300">
                <CardHeader>
                  <Code2 className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Desarrollo Full-Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Sistemas robustos con React, Next.js y Supabase. Arquitecturas escalables para plataformas web modernas.</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300">
                <CardHeader>
                  <Cpu className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Robótica e IoT</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Programación de sistemas embebidos (ESP32/Arduino) y control de dispositivos para automatización industrial.</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300">
                <CardHeader>
                  <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Consultoría Digital</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Expertos en la Ley 164 y normativa digital boliviana. Seguridad de la información y auditoría de sistemas.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- PROYECTOS DESTACADOS --- */}
        <section id="proyectos" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Proyectos de Ingeniería</h2>
              <p className="text-muted-foreground">Una muestra de los sistemas que hemos diseñado y desplegado.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <MonitorSmartphone className="h-8 w-8 text-primary" />
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">Web App</span>
                </div>
                <h3 className="text-xl font-bold mb-2">ViajeSeguro</h3>
                <p className="text-muted-foreground mb-4">Plataforma de visualización nocturna interactiva con mapeo en tiempo real para seguridad ciudadana.</p>
              </div>

              <div className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Layers className="h-8 w-8 text-primary" />
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">System</span>
                </div>
                <h3 className="text-xl font-bold mb-2">SICPEL (EMI)</h3>
                <p className="text-muted-foreground mb-4">Sistema de control y préstamos de equipos de laboratorio con auditoría y gestión de perfiles.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Noctu Software. Desarrollado por R. Hanma - Ingeniería de Sistemas.</p>
          <div className="flex gap-4">
            <Link className="text-xs hover:underline underline-offset-4" href="#">Términos</Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}