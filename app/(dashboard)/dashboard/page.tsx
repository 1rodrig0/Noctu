import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, FileText, Clock, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

// Tipos útiles
type LoanStatus = Database['public']['Tables']['loans']['Row']['status']
type LoanRow = Database['public']['Tables']['loans']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export default async function DashboardPage() {
  const supabase = await createClient()

  // Usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<ProfileRow>()

  const isManager = profile?.role === 'lab_manager'

  // =========================
  // DASHBOARD MANAGER
  // =========================
  if (isManager) {
    const { count: totalEquipment } = await supabase
      .from('equipment')
      .select('*', { count: 'exact', head: true })

    const { count: availableEquipment } = await supabase
      .from('equipment')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available')

    const { count: pendingLoans } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { count: activeLoans } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-500">Bienvenido, {profile?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex justify-between flex-row pb-2">
              <CardTitle className="text-sm">Total Equipos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEquipment ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                {availableEquipment ?? 0} disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between flex-row pb-2">
              <CardTitle className="text-sm">Solicitudes Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLoans ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between flex-row pb-2">
              <CardTitle className="text-sm">Préstamos Activos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeLoans ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between flex-row pb-2">
              <CardTitle className="text-sm">Disponibilidad</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalEquipment && availableEquipment
                  ? Math.round((availableEquipment / totalEquipment) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // =========================
  // DASHBOARD ESTUDIANTE
  // =========================
  const { data: myLoans } = await supabase
    .from('loans')
    .select('status')
    .eq('student_id', user.id)
    .returns<Pick<LoanRow, 'status'>[]>()

  const stats = (myLoans ?? []).reduce(
    (acc, loan) => {
      acc[loan.status]++
      return acc
    },
    {
      pending: 0,
      approved: 0,
      rejected: 0,
      returned: 0,
      overdue: 0,
    } satisfies Record<LoanStatus, number>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-gray-500">Bienvenido, {profile?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex justify-between flex-row pb-2">
            <CardTitle className="text-sm">Pendientes</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between flex-row pb-2">
            <CardTitle className="text-sm">Activos</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between flex-row pb-2">
            <CardTitle className="text-sm">Completados</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.returned}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
