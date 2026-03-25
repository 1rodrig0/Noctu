import { z } from 'zod'

export const equipmentSchema = z.object({
  code: z.string().min(3, 'El código debe tener al menos 3 caracteres').toUpperCase(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  categoryId: z.string().uuid('Categoría inválida').optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  status: z.enum(['available', 'on_loan', 'maintenance', 'retired']).default('available'),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  purchaseDate: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type EquipmentInput = z.infer<typeof equipmentSchema>