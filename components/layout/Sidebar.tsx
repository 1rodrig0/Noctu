'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/formatters'
import { Home, Package, FileText, ClipboardList, History } from 'lucide-react'

interface SidebarProps {
  role: 'student' | 'lab_manager'
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const studentLinks = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/equipment', label: 'Equipos', icon: Package },
    { href: '/dashboard/loans', label: 'Mis Préstamos', icon: FileText },
  ]

  const managerLinks = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/equipment', label: 'Equipos', icon: Package },
    { href: '/dashboard/requests', label: 'Solicitudes', icon: ClipboardList },
    { href: '/dashboard/loans', label: 'Préstamos', icon: FileText },
    { href: '/dashboard/audit', label: 'Auditoría', icon: History },
  ]

  const links = role === 'lab_manager' ? managerLinks : studentLinks

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-57px)]">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}