import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatStatus } from '@/lib/utils/formatters'
import { Plus } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type LoanWithRelations = Database['public']['Tables']['loans']['Row'] & {
  equipment?: Database['public']['Tables']['equipment']['Row']
  student?: Database['public']['Tables']['profiles']['Row']
}

export default async function LoansPage() {
  const supabase = await createClient()

  // Obtener usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Obtener perfil
  const { data: profileData } = await (supabase
    .from('profiles') as any)
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Database['public']['Tables']['profiles']['Row'] | null
  const isManager = profile?.role === 'lab_manager'

  // Consulta de préstamos con tipado
  const { data: loansData } = await supabase
    .from('loans')
    .select(`
      *,
      equipment:equipment(id, code, name, brand, model, location),
      student:profiles!loans_student_id_fkey(id, full_name, student_code)
    `)
    .order('created_at', { ascending: false }) as { data: LoanWithRelations[] | null }

  // Filtrar si no es manager
  const loans: LoanWithRelations[] = (loansData ?? []).filter(
    (loan) => isManager || loan.student_id === user.id
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            {isManager ? 'Préstamos' : 'Mis Préstamos'}
          </h2>
          <p className="text-gray-500">
            {isManager ? 'Historial de préstamos del sistema' : 'Historial de tus solicitudes'}
          </p>
        </div>
        {!isManager && (
          <Link href="/dashboard/loans/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Solicitud
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {loans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {loan.equipment?.name} ({loan.equipment?.code})
                </CardTitle>
                <Badge
                  variant={
                    loan.status === 'approved'
                      ? 'success'
                      : loan.status === 'rejected'
                      ? 'destructive'
                      : loan.status === 'returned'
                      ? 'secondary'
                      : 'warning'
                  }
                >
                  {formatStatus(loan.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {isManager && loan.student && (
                  <div>
                    <span className="font-medium">Estudiante:</span>{' '}
                    {loan.student.full_name} ({loan.student.student_code})
                  </div>
                )}
                <div>
                  <span className="font-medium">Fecha de solicitud:</span>{' '}
                  {formatDate(loan.requested_at)}
                </div>
                <div>
                  <span className="font-medium">Devolución esperada:</span>{' '}
                  {formatDate(loan.expected_return_date)}
                </div>
                {loan.status === 'approved' && loan.loan_start_date && (
                  <div>
                    <span className="font-medium">Fecha de préstamo:</span>{' '}
                    {formatDate(loan.loan_start_date)}
                  </div>
                )}
                {loan.status === 'returned' && loan.actual_return_date && (
                  <div>
                    <span className="font-medium">Fecha de devolución:</span>{' '}
                    {formatDate(loan.actual_return_date)}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <span className="font-medium text-sm">Propósito:</span>
                <p className="text-sm text-gray-600 mt-1">{loan.purpose}</p>
              </div>

              {loan.rejection_reason && (
                <div className="mt-4">
                  <span className="font-medium text-sm text-red-600">Razón de rechazo:</span>
                  <p className="text-sm text-gray-600 mt-1">{loan.rejection_reason}</p>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <Link href={`/dashboard/loans/${loan.id}`}>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay préstamos registrados</p>
        </div>
      )}
    </div>
  )
}
