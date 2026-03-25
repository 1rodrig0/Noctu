'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils/formatters'
import { CheckCircle, XCircle } from 'lucide-react'

export default function RequestsPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null)

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const res = await fetch('/api/loans?status=pending')
      if (res.ok) {
        const data = await res.json()
        setLoans(data)
      }
    } catch (err) {
      setError('Error al cargar solicitudes')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (loanId: string) => {
    setProcessingId(loanId)
    try {
      const res = await fetch(`/api/loans/${loanId}/approve`, {
        method: 'POST',
      })

      if (res.ok) {
        await fetchLoans()
      } else {
        const data = await res.json()
        setError(data.error)
      }
    } catch (err) {
      setError('Error al aprobar préstamo')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (loanId: string) => {
    if (!rejectionReason || rejectionReason.length < 10) {
      setError('La razón de rechazo debe tener al menos 10 caracteres')
      return
    }

    setProcessingId(loanId)
    try {
      const res = await fetch(`/api/loans/${loanId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason }),
      })

      if (res.ok) {
        setShowRejectDialog(null)
        setRejectionReason('')
        await fetchLoans()
      } else {
        const data = await res.json()
        setError(data.error)
      }
    } catch (err) {
      setError('Error al rechazar préstamo')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <div>Cargando solicitudes...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Solicitudes Pendientes</h2>
        <p className="text-gray-500">Aprobar o rechazar solicitudes de préstamo</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {loans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {loan.equipment?.name} ({loan.equipment?.code})
                </CardTitle>
                <Badge variant="warning">Pendiente</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Estudiante:</span>{' '}
                  {loan.student?.full_name}
                </div>
                <div>
                  <span className="font-medium">Código:</span>{' '}
                  {loan.student?.student_code}
                </div>
                <div>
                  <span className="font-medium">Solicitado:</span>{' '}
                  {formatDate(loan.requested_at)}
                </div>
                <div>
                  <span className="font-medium">Devolución esperada:</span>{' '}
                  {formatDate(loan.expected_return_date)}
                </div>
              </div>

              <div>
                <span className="font-medium text-sm">Propósito:</span>
                <p className="text-sm text-gray-600 mt-1">{loan.purpose}</p>
              </div>

              {showRejectDialog === loan.id ? (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <Label htmlFor={`reject-${loan.id}`}>Razón del Rechazo *</Label>
                  <Textarea
                    id={`reject-${loan.id}`}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explicar por qué se rechaza la solicitud (mínimo 10 caracteres)"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowRejectDialog(null)
                        setRejectionReason('')
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(loan.id)}
                      disabled={processingId === loan.id}
                    >
                      {processingId === loan.id ? 'Procesando...' : 'Confirmar Rechazo'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectDialog(loan.id)}
                    disabled={processingId === loan.id}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => handleApprove(loan.id)}
                    disabled={processingId === loan.id}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {processingId === loan.id ? 'Procesando...' : 'Aprobar'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {loans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay solicitudes pendientes</p>
        </div>
      )}
    </div>
  )
}