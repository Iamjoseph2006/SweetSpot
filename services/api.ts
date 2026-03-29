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


export type ProfileUser = {
  id: number;
  role_id: number;
  name?: string;
  email?: string;
  full_name?: string;
  correo?: string;
};

export type ProtectedProfileResponse = {
  message?: string;
  user?: ProfileUser | null;
  error?: string;
};

const normalizeProfileUser = (raw: any): ProfileUser | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const user = raw.user && typeof raw.user === 'object' ? raw.user : raw;
  const id = Number(user.id ?? user.user_id);
  const roleId = Number(user.role_id ?? user.roleId ?? 2);

  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const name = user.name ?? user.full_name ?? user.nombre;
  const email = user.email ?? user.correo;

  return {
    id,
    role_id: Number.isFinite(roleId) ? roleId : 2,
    name: typeof name === 'string' ? name : undefined,
    full_name: typeof user.full_name === 'string' ? user.full_name : undefined,
    email: typeof email === 'string' ? email : undefined,
    correo: typeof user.correo === 'string' ? user.correo : undefined,
  };
};

const normalizeOrders = (payload: any): Order[] => {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.orders)
      ? payload.orders
      : [];

  return rows
    .map((raw) => ({
      id: Number(raw?.id),
      user_id: Number(raw?.user_id ?? raw?.userId),
      total: Number(raw?.total ?? 0),
      status: typeof raw?.status === 'string' ? raw.status : 'created',
      created_at: String(raw?.created_at ?? raw?.createdAt ?? new Date().toISOString()),
      name: typeof raw?.name === 'string' ? raw.name : undefined,
      email: typeof raw?.email === 'string' ? raw.email : undefined,
    }))
    .filter((order) => Number.isFinite(order.id) && Number.isFinite(order.user_id));
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
export async function getProtectedProfile(): Promise<ProtectedProfileResponse> {
  const token = await getToken();
  if (!token) {
    return { error: 'No hay sesión activa. Inicia sesión nuevamente.' };
  }

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

  const payload = await response.json();

  if (!response.ok) {
    return { error: payload?.error || 'No se pudo cargar el perfil' };
  }

  return {
    message: payload?.message,
    user: normalizeProfileUser(payload),
  };
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

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || 'No se pudieron obtener los pedidos');
  }

  return normalizeOrders(payload);
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
