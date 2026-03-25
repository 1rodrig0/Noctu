'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatStatus } from '@/lib/utils/formatters'
import { EQUIPMENT_STATUS } from '@/lib/utils/constants'
import { Package } from 'lucide-react'

interface EquipmentCardProps {
  equipment: {
    id: string
    code: string
    name: string | null
    brand?: string | null
    model?: string | null
    status: 'available' | 'on_loan' | 'maintenance' | 'retired'
    condition?: 'excellent' | 'good' | 'fair' | 'poor' | null
    location?: string | null
    category?: { name: string; icon?: string | null }
  }
  isManager: boolean
  onRequestLoan?: (id: string) => void
}

export default function EquipmentCard({ equipment, isManager, onRequestLoan }: EquipmentCardProps) {
  // 🔹 Normalizamos directamente dentro del componente
  const normalized = {
    ...equipment,
    name: equipment.name ?? undefined,
    brand: equipment.brand ?? undefined,
    model: equipment.model ?? undefined,
    location: equipment.location ?? undefined,
    condition: equipment.condition ?? undefined,
    category: equipment.category
      ? { ...equipment.category, icon: equipment.category.icon ?? undefined }
      : undefined,
  }

  const statusConfig = EQUIPMENT_STATUS[normalized.status]

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {normalized.category?.icon ? (
              <span className="text-2xl">{normalized.category.icon}</span>
            ) : (
              <Package className="h-6 w-6 text-gray-400" />
            )}
            <div>
              <CardTitle className="text-lg">{normalized.name}</CardTitle>
              <p className="text-sm text-gray-500">{normalized.code}</p>
            </div>
          </div>
          <Badge
            variant={
              statusConfig.color === 'green'
                ? 'success'
                : statusConfig.color === 'red'
                ? 'destructive'
                : statusConfig.color === 'yellow'
                ? 'warning'
                : 'secondary'
            }
          >
            {formatStatus(normalized.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {normalized.brand && (
          <p className="text-sm">
            <span className="font-medium">Marca:</span> {normalized.brand}
          </p>
        )}
        {normalized.model && (
          <p className="text-sm">
            <span className="font-medium">Modelo:</span> {normalized.model}
          </p>
        )}
        {normalized.location && (
          <p className="text-sm">
            <span className="font-medium">Ubicación:</span> {normalized.location}
          </p>
        )}
        {normalized.condition && (
          <p className="text-sm">
            <span className="font-medium">Estado:</span> {formatStatus(normalized.condition)}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Link href={`/dashboard/equipment/${normalized.id}`}>
          <Button variant="outline" size="sm">
            Ver Detalles
          </Button>
        </Link>
        {!isManager && normalized.status === 'available' && onRequestLoan && (
          <Button size="sm" onClick={() => onRequestLoan(normalized.id)}>
            Solicitar Préstamo
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
