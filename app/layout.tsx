import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NOCTU - SIG Vida Nocturna La Paz',
  description: 'Sistema de Información Geográfica para la exploración segura de la vida nocturna en La Paz.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-slate-950 text-slate-50`}>
        {children}
      </body>
    </html>
  )
}