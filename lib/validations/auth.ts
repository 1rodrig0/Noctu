import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  fullName: z.string().min(3, 'El nombre completo debe tener al menos 3 caracteres'),
  role: z.enum(['student', 'lab_manager']),
  studentCode: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.role === 'student') {
    return data.studentCode && data.studentCode.length > 0
  }
  return true
}, {
  message: 'El código de estudiante es requerido',
  path: ['studentCode'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>