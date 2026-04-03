import { getToken } from './authStorage';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.18.5:3000/api';

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
  active?: boolean;
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
  delivery_location?: string | null;
  delivery_preference?: string | null;
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

const normalizeProfileUser = (payload: any): ProfileUser | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  // El payload del servidor viene con estructura: { message, user: {...} }
  // Extraer el usuario del payload
  const userData = payload.user || payload;
  
  if (!userData || typeof userData !== 'object') {
    return null;
  }

  const id = Number(userData.id ?? userData.user_id);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const roleId = Number(userData.role_id ?? userData.roleId ?? 2);

  return {
    id,
    role_id: roleId,
    name: userData.name || undefined,
    email: userData.email || undefined,
    full_name: userData.full_name || userData.nombre || undefined,
    correo: userData.correo || userData.email || undefined,
  };
};

const normalizeOrders = (payload: any): Order[] => {
  const normalizeOptionalText = (value: unknown): string | null => {
    if (value === null || value === undefined) return null;
    const normalized = String(value).trim();
    return normalized.length ? normalized : null;
  };

  const normalizeStatus = (status: unknown): string => {
    const value = typeof status === 'string' ? status.trim().toLowerCase() : '';
    if (value === 'creado') return 'created';
    if (value === 'en preparación' || value === 'en preparacion') return 'preparing';
    if (value === 'enviado') return 'sent';
    if (value === 'entregado') return 'delivered';
    if (value === 'preparing' || value === 'sent' || value === 'delivered') return value;
    return 'created';
  };

  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.orders)
      ? payload.orders
      : [];

  return rows
    .map((raw: any) => ({
      id: Number(raw?.id ?? raw?.order_id ?? raw?.orderId),
      user_id: Number(raw?.user_id ?? raw?.userId),
      total: Number(raw?.total ?? 0),
      status: normalizeStatus(raw?.status),
      created_at: String(raw?.created_at ?? raw?.createdAt ?? new Date().toISOString()),
      delivery_location: normalizeOptionalText(raw?.delivery_location ?? raw?.deliveryLocation),
      delivery_preference: normalizeOptionalText(raw?.delivery_preference ?? raw?.deliveryPreference),
    }))
    .filter((order: Order) => Number.isFinite(order.id) && Number.isFinite(order.user_id));
};

const E2E_ORDERS: Order[] = [
  {
    id: 1,
    user_id: 1,
    total: 18.5,
    status: 'created',
    created_at: '2026-01-01T10:00:00.000Z',
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
  const payload = await response.json();
  if (!Array.isArray(payload)) return [];
  return payload.map((item: any) => ({
    id: Number(item.id),
    name: String(item.name ?? ''),
    description: String(item.description ?? ''),
    price: Number(item.price ?? 0),
    image: String(item.image ?? ''),
    active: item.active === true || item.active === 1 || item.active === '1',
  }));
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

export async function createOrder(user_id: number, delivery?: { delivery_location?: string; delivery_preference?: string }) {
  const token = await getToken();

  const cleanedLocation = (delivery?.delivery_location ?? '').trim();
  const cleanedPreference = (delivery?.delivery_preference ?? '').trim();

  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id,
      delivery: {
        location: cleanedLocation,
        preference: cleanedPreference,
      },
      delivery_location: cleanedLocation,
      delivery_preference: cleanedPreference,
      deliveryLocation: cleanedLocation,
      deliveryPreference: cleanedPreference,
    }),
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


export async function inactivateProduct(id: number) {
  const response = await fetch(`${BASE_URL}/products/${id}/inactivate`, {
    method: 'PATCH',
  });

  return response.json();
}

export async function activateProduct(id: number) {
  const response = await fetch(`${BASE_URL}/products/${id}/activate`, {
    method: 'PATCH',
  });

  return response.json();
}
