import { z } from 'zod';
import { loginUser } from '../services/api';
import { buildLoginPayload, mapInternalError } from '../services/authLogic';
import { saveToken } from '../services/authStorage';

export const loginSchema = z.object({
  email: z.string().email('Ingrese un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function loginWithCredentials(form: { email: string; password: string }) {
  const validation = loginSchema.safeParse(form);
  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {
      fieldErrors[String(issue.path[0])] = issue.message;
    });
    return { errors: fieldErrors };
  }

  try {
    const response = await loginUser(buildLoginPayload(form));
    if (!response?.token) {
      return { errors: { general: response?.error || 'Correo o contraseña incorrectos' } };
    }

    await saveToken(response.token);
    return { success: true as const };
  } catch (error) {
    return {
      errors: {
        general: mapInternalError(error, 'No se pudo conectar al servidor. Verifica tu conexión o la IP.'),
      },
    };
  }
}
