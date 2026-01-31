// URL base de la API (cambia solo aquí si cambia la IP)
const BASE_URL = 'http://192.168.1.26:3000/api';

/* REGISTRO DE USUARIO */
export async function registerUser(data: any) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}

/* LOGIN DE USUARIO */
export async function loginUser(data: any) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
}

/* VALIDACIÓN ASÍNCRONA Verifica si el correo ya existe */
export async function checkEmailExists(email: string): Promise<boolean> {
  const response = await fetch(
    `${BASE_URL}/auth/check-email?email=${email}`
  );

  const data = await response.json();
  return data.exists; // true | false
}
