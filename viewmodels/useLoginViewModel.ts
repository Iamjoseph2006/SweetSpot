import { useState } from 'react';
import { z } from 'zod';
import { buildLoginPayload, mapInternalError } from '../services/authLogic';
import { loginUser } from '../services/api';
import { saveToken } from '../services/authStorage';

const loginSchema = z.object({
  email: z.string().email('Ingrese un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export function useLoginViewModel() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (form: { email: string; password: string }) => {
    const parsed = loginSchema.safeParse({
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      return { success: false as const, errors: fieldErrors };
    }

    setIsSubmitting(true);
    try {
      const response = await loginUser(buildLoginPayload(form));
      if (!response.token) {
        return { success: false as const, errors: { general: response.error || 'Correo o contraseña incorrectos' } };
      }

      await saveToken(response.token);
      return { success: true as const, errors: {} };
    } catch (error) {
      return {
        success: false as const,
        errors: { general: mapInternalError(error, 'No se pudo conectar al servidor. Verifica la API.') },
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    login,
  };
}
