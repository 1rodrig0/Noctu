'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewLoanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [equipment, setEquipment] = useState<any[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null)
  const [formData, setFormData] = useState({
    equipmentId: '',
    purpose: '',
    expectedReturnDate: '',
  })

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    const res = await fetch('/api/equipment?status=available')
    if (res.ok) {
      const data = await res.json()
      setEquipment(data)
    }
  }

  const handleEquipmentChange = (equipmentId: string) => {
    const selected = equipment.find(e => e.id === equipmentId)
    setSelectedEquipment(selected)
    setFormData({ ...formData, equipmentId })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear solicitud')
      }

      router.push('/dashboard/loans')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/loans">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold">Nueva Solicitud de Préstamo</h2>
          <p className="text-gray-500">Solicitar el préstamo de un equipo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Información del Préstamo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="equipmentId">Equipo *</Label>
                  <select
                    id="equipmentId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.equipmentId}
                    onChange={(e) => handleEquipmentChange(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar equipo</option>
                    {equipment.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.code} - {eq.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedReturnDate">Fecha de Devolución Esperada *</Label>
                  <Input
                    id="expectedReturnDate"
                    type="date"
                    min={minDateStr}
                    value={formData.expectedReturnDate}
                    onChange={(e) => setFormData({ ...formData, expectedReturnDate: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    La fecha debe ser futura
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Propósito del Préstamo *</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Ej: Práctica de configuración de OSPF para la materia de Redes II"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Mínimo 10 caracteres
                  </p>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link href="/dashboard/loans">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading || !formData.equipmentId}>
                    {loading ? 'Enviando...' : 'Enviar Solicitud'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedEquipment && (
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Equipo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Código</p>
                  <p className="text-sm text-gray-600">{selectedEquipment.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Nombre</p>
                  <p className="text-sm text-gray-600">{selectedEquipment.name}</p>
                </div>
                {selectedEquipment.brand && (
                  <div>
                    <p className="text-sm font-medium">Marca</p>
                    <p className="text-sm text-gray-600">{selectedEquipment.brand}</p>
                  </div>
                )}
                {selectedEquipment.model && (
                  <div>
                    <p className="text-sm font-medium">Modelo</p>
                    <p className="text-sm text-gray-600">{selectedEquipment.model}</p>
                  </div>
                )}
                {selectedEquipment.location && (
                  <div>
                    <p className="text-sm font-medium">Ubicación</p>
                    <p className="text-sm text-gray-600">{selectedEquipment.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <Badge variant="success" className="mt-1">Disponible</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}