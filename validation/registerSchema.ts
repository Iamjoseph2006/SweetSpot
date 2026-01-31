import { z } from 'zod';

/**
 * Esquema centralizado de validación para registro
 * Se reutiliza en toda la app
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'El nombre debe tener al menos 3 caracteres'),

    email: z
      .string()
      .email('Correo electrónico inválido'),

    password: z
      .string()
      .min(8, 'La contraseña debe tener mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });