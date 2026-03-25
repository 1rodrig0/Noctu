import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (date: string | Date, formatString = 'dd/MM/yyyy') => {
  return format(new Date(date), formatString, { locale: es })
}

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), "dd/MM/yyyy 'a las' HH:mm", { locale: es })
}

export const formatRelativeTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

export const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    available: 'Disponible',
    on_loan: 'Prestado',
    maintenance: 'Mantenimiento',
    retired: 'Retirado',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    returned: 'Devuelto',
    overdue: 'Vencido',
    excellent: 'Excelente',
    good: 'Bueno',
    fair: 'Regular',
    poor: 'Malo',
    damaged: 'Dañado',
  }
  return statusMap[status] || status
}

export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}