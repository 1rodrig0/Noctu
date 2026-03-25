import { z } from 'zod'

export const loanRequestSchema = z.object({
  equipmentId: z.string().uuid('Equipo inválido'),
  purpose: z.string().min(10, 'El propósito debe tener al menos 10 caracteres'),
  expectedReturnDate: z.string().refine((date) => {
    const returnDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return returnDate > today
  }, 'La fecha de devolución debe ser futura'),
})

export const loanApprovalSchema = z.object({
  loanStartDate: z.string().optional(),
})

export const loanRejectionSchema = z.object({
  rejectionReason: z.string().min(10, 'Debe proporcionar una razón de rechazo'),
})

export const loanReturnSchema = z.object({
  returnCondition: z.enum(['excellent', 'good', 'fair', 'poor', 'damaged']),
  returnNotes: z.string().optional(),
})

export type LoanRequestInput = z.infer<typeof loanRequestSchema>
export type LoanApprovalInput = z.infer<typeof loanApprovalSchema>
export type LoanRejectionInput = z.infer<typeof loanRejectionSchema>
export type LoanReturnInput = z.infer<typeof loanReturnSchema>