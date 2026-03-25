export const EQUIPMENT_STATUS = {
  // Estado que mapea a 'success'
  available: { label: 'Disponible', color: 'green' }, 
  
  // Estado que mapea a 'destructive' (rojo)
  on_loan: { label: 'En Préstamo', color: 'red' }, // <--- ¡ASEGÚRATE DE QUE ALGÚN ESTADO TIENE color: 'red'!
  
  // Estado que mapea a 'warning' (amarillo)
  maintenance: { label: 'Mantenimiento', color: 'yellow' }, 
  
  // Estado que mapea a 'secondary' (gris)
  retired: { label: 'Retirado', color: 'gray' }, 
  
  // Otros estados...
  // ...
} as const

export const EQUIPMENT_CONDITION = {
  excellent: { label: 'Excelente', color: 'green' },
  good: { label: 'Bueno', color: 'blue' },
  fair: { label: 'Regular', color: 'yellow' },
  poor: { label: 'Malo', color: 'red' },
} as const

export const LOAN_STATUS = {
  pending: { label: 'Pendiente', color: 'yellow' },
  approved: { label: 'Aprobado', color: 'green' },
  rejected: { label: 'Rechazado', color: 'red' },
  returned: { label: 'Devuelto', color: 'gray' },
  overdue: { label: 'Vencido', color: 'red' },
} as const

export const USER_ROLES = {
  student: { label: 'Estudiante', color: 'blue' },
  lab_manager: { label: 'Encargado', color: 'purple' },
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const
export type EquipmentStatus = keyof typeof EQUIPMENT_STATUS;