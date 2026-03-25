'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogOut, User } from 'lucide-react'

interface NavbarProps {
  user: {
    full_name: string
    email: string
    role: 'student' | 'lab_manager'
    student_code?: string | null 
  }
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">
            SICPEL - EMI La Paz
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.full_name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
            <Badge variant={user.role === 'lab_manager' ? 'default' : 'secondary'}>
              {user.role === 'lab_manager' ? 'Encargado' : 'Estudiante'}
            </Badge>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </nav>
  )
}