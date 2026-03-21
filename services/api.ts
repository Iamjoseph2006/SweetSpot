import { getToken } from './authStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.0.9:3000/api';
const E2E_EMAIL = 'demo@email.com';
const E2E_PASSWORD = '123456';
const E2E_TOKEN = 'e2e-demo-token';

const isE2EMode = () => process.env.EXPO_PUBLIC_E2E_MODE === 'true';

/* REGISTRO DE USUARIO */
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role_id: number;
}) {
  if (isE2EMode()) {
    return {
      message: 'Usuario registrado correctamente',
      user: {
        id: 1,
        ...data,
      },
    };
  }

  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}

/* LOGIN DE USUARIO */
export async function loginUser(data: { email: string; password: string }) {
  if (isE2EMode()) {
    if (data.email === E2E_EMAIL && data.password === E2E_PASSWORD) {
      return { token: E2E_TOKEN };
    }

    return { error: 'Correo o contraseña incorrectos' };
  }

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}

/* ENDPOINT PROTEGIDO */
export async function getProtectedProfile() {
  const token = await getToken();

  if (isE2EMode()) {
    if (token === E2E_TOKEN) {
      return { message: 'Dashboard listo para pruebas E2E' };
    }

    return { error: 'Token inválido' };
  }

  const response = await fetch(`${BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

/* VALIDACIÓN ASÍNCRONA Verifica si el correo ya existe */
export async function checkEmailExists(email: string): Promise<boolean> {
  if (isE2EMode()) {
    return email === E2E_EMAIL;
  }

  const response = await fetch(`${BASE_URL}/auth/check-email?email=${email}`);

  const data = await response.json();
  return data.exists;
}
