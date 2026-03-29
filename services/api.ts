import { getToken } from './authStorage';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.26:3000/api';

const E2E_EMAIL = 'demo@email.com';
const E2E_PASSWORD = '123456';
const E2E_TOKEN = 'e2e-demo-token';

const isE2EMode = () =>
  process.env.EXPO_PUBLIC_E2E_MODE === 'true' || process.env.NODE_ENV === 'test';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export type CartItem = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
};

export type Order = {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
  name?: string;
  email?: string;
};

const E2E_ORDERS: Order[] = [
  {
    id: 1,
    user_id: 1,
    total: 18.5,
    status: 'created',
    created_at: '2026-01-01T10:00:00.000Z',
    name: 'Cliente Demo',
    email: E2E_EMAIL,
  },
];

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
export async function loginUser(data: {
  email: string;
  password: string;
}) {
  if (isE2EMode()) {
    if (data.email === E2E_EMAIL && data.password === E2E_PASSWORD) {
      return { token: E2E_TOKEN };
    }

    return { error: 'Usuario no encontrado' };
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
    return {
      message: 'Dashboard listo para pruebas E2E',
      user: {
        id: 1,
        role_id: 2,
        name: 'Cliente Demo',
        email: E2E_EMAIL,
      },
    };
  }

  const response = await fetch(`${BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

/* VALIDACIÓN ASÍNCRONA */
export async function checkEmailExists(email: string): Promise<boolean> {
  if (isE2EMode()) {
    return email === E2E_EMAIL;
  }

  const response = await fetch(`${BASE_URL}/auth/check-email?email=${email}`);
  const data = await response.json();
  return data.exists;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos');
  }
  return response.json();
}

export async function addProductToCart(payload: {
  user_id: number;
  product_id: number;
  quantity: number;
}) {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function getCartByUser(userId: number): Promise<CartItem[]> {
  const response = await fetch(`${BASE_URL}/cart/${userId}`);
  if (!response.ok) {
    throw new Error('No se pudo obtener el carrito');
  }
  return response.json();
}

export async function deleteCartItem(id: number) {
  const response = await fetch(`${BASE_URL}/cart/${id}`, {
    method: 'DELETE',
  });

  return response.json();
}

export async function createOrder(user_id: number) {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id }),
  });

  return response.json();
}

export async function getOrders(): Promise<Order[]> {
  if (isE2EMode()) {
    return E2E_ORDERS;
  }

  const token = await getToken();
  const response = await fetch(`${BASE_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudieron obtener los pedidos');
  }

  return response.json();
}

export async function updateOrderStatus(id: number, status: string) {
  const token = await getToken();
  const response = await fetch(`${BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return response.json();
}

export async function createProduct(payload: {
  name: string;
  description: string;
  price: number;
  image?: string;
}) {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function updateProduct(
  id: number,
  payload: {
    name: string;
    description: string;
    price: number;
    image?: string;
  }
) {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function deleteProduct(id: number) {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });

  return response.json();
}
