'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, formatDateTime, formatStatus } from '@/lib/utils/formatters'
import { ArrowLeft, CheckCircle, Package } from 'lucide-react'

export default function LoanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loan, setLoan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [returnData, setReturnData] = useState({
    returnCondition: 'good' as 'excellent' | 'good' | 'fair' | 'poor' | 'damaged',
    returnNotes: '',
  })

  useEffect(() => {
    fetchLoan()
  }, [])

  const fetchLoan = async () => {
    try {
      const res = await fetch(`/api/loans/${resolvedParams.id}`)
      if (res.ok) {
        const data = await res.json()
        setLoan(data)
      } else {
        setError('Préstamo no encontrado')
      }
    } catch (err) {
      setError('Error al cargar préstamo')
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async () => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/loans/${resolvedParams.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData),
      })

      if (res.ok) {
        await fetchLoan()
        setShowReturnDialog(false)
      } else {
        const data = await res.json()
        setError(data.error)
      }
    } catch (err) {
      setError('Error al registrar devolución')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div>Cargando...</div>

  if (error && !loan) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const statusVariant = 
    loan.status === 'approved' ? 'success' :
    loan.status === 'rejected' ? 'destructive' :
    loan.status === 'returned' ? 'secondary' : 'warning'

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/loans">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold">Detalle del Préstamo</h2>
          <p className="text-gray-500">ID: {loan.id.slice(0, 8)}</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información del Préstamo</CardTitle>
                <Badge variant={statusVariant}>{formatStatus(loan.status)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Solicitud</p>
                  <p className="text-sm">{formatDateTime(loan.requested_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Devolución Esperada</p>
                  <p className="text-sm">{formatDate(loan.expected_return_date)}</p>
                </div>
                {loan.approved_at && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Aprobación</p>
                      <p className="text-sm">{formatDateTime(loan.approved_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Aprobado Por</p>
                      <p className="text-sm">{loan.approver?.full_name || 'N/A'}</p>
                    </div>
                  </>
                )}
                {loan.rejected_at && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Rechazo</p>
                      <p className="text-sm">{formatDateTime(loan.rejected_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rechazado Por</p>
                      <p className="text-sm">{loan.rejecter?.full_name || 'N/A'}</p>
                    </div>
                  </>
                )}
                {loan.actual_return_date && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Devolución</p>
                      <p className="text-sm">{formatDateTime(loan.actual_return_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Recibido Por</p>
                      <p className="text-sm">{loan.returner?.full_name || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Propósito</p>
                <p className="text-sm bg-gray-50 p-3 rounded">{loan.purpose}</p>
              </div>

              {loan.rejection_reason && (
                <div>
                  <p className="text-sm font-medium text-red-600 mb-2">Razón de Rechazo</p>
                  <p className="text-sm bg-red-50 p-3 rounded text-red-700">{loan.rejection_reason}</p>
                </div>
              )}

              {loan.return_condition && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Condición al Devolver</p>
                    <p className="text-sm">{formatStatus(loan.return_condition)}</p>
                  </div>
                </div>
              )}

              {loan.return_notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Notas de Devolución</p>
                  <p className="text-sm bg-gray-50 p-3 rounded">{loan.return_notes}</p>
                </div>
              )}

              {loan.status === 'approved' && !showReturnDialog && (
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setShowReturnDialog(true)}>
                    <Package className="h-4 w-4 mr-2" />
                    Registrar Devolución
                  </Button>
                </div>
              )}

              {showReturnDialog && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Registrar Devolución</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="returnCondition">Condición del Equipo *</Label>
                    <select
                      id="returnCondition"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={returnData.returnCondition}
                      onChange={(e) => setReturnData({ 
                        ...returnData, 
                        returnCondition: e.target.value as any 
                      })}
                    >
                      <option value="excellent">Excelente</option>
                      <option value="good">Bueno</option>
                      <option value="fair">Regular</option>
                      <option value="poor">Malo</option>
                      <option value="damaged">Dañado</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="returnNotes">Notas (opcional)</Label>
                    <Textarea
                      id="returnNotes"
                      value={returnData.returnNotes}
                      onChange={(e) => setReturnData({ ...returnData, returnNotes: e.target.value })}
                      placeholder="Observaciones sobre el equipo devuelto"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowReturnDialog(false)}
                      disabled={processing}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleReturn}
                      disabled={processing}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {processing ? 'Procesando...' : 'Confirmar Devolución'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Código</p>
                <p className="text-sm">{loan.equipment?.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="text-sm">{loan.equipment?.name}</p>
              </div>
              {loan.equipment?.brand && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Marca</p>
                  <p className="text-sm">{loan.equipment.brand}</p>
                </div>
              )}
              {loan.equipment?.model && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Modelo</p>
                  <p className="text-sm">{loan.equipment.model}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estudiante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="text-sm">{loan.student?.full_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Código</p>
                <p className="text-sm">{loan.student?.student_code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{loan.student?.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}