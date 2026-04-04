import { Platform } from 'react-native';

const TOKEN_KEY = 'sweetspot_access_token';
let memoryToken = '';
const SECURE_STORE_OPTIONS = { keychainService: TOKEN_KEY } as const;

const encode = (value: string) => {
  if (typeof btoa === 'function') {
    return btoa(value);
  }
  return globalThis.encodeURIComponent(value);
};

const decode = (value: string) => {
  if (!value) return '';

  if (typeof atob === 'function') {
    return atob(value);
  }
  return globalThis.decodeURIComponent(value);
};

const getSecureStore = () => {
  try {
    const moduleName = 'expo-secure-store';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(moduleName);
  } catch {
    return null;
  }
};

export async function saveToken(token: string) {
  const encoded = encode(token);
  const SecureStore = getSecureStore();

  if (SecureStore?.setItemAsync) {
    await SecureStore.setItemAsync(TOKEN_KEY, encoded, SECURE_STORE_OPTIONS);
    return;
  }

  memoryToken = encoded;
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, encoded);
  }
}

export async function getToken() {
  const SecureStore = getSecureStore();

  if (SecureStore?.getItemAsync) {
    const value = await SecureStore.getItemAsync(TOKEN_KEY, SECURE_STORE_OPTIONS);
    return decode(value ?? '');
  }

  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    const value = localStorage.getItem(TOKEN_KEY) ?? '';
    return decode(value);
  }

  return decode(memoryToken);
}

const parseJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const [, payloadPart] = token.split('.');
    if (!payloadPart) return null;

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded =
      typeof atob === 'function'
        ? atob(padded)
        : Buffer.from(padded, 'base64').toString('utf-8');

    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export async function getValidToken() {
  const token = await getToken();
  if (!token) return '';

  const payload = parseJwtPayload(token);
  if (!payload?.exp) return token;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp <= nowInSeconds) {
    await removeToken();
    return '';
  }

  return token;
}

export async function removeToken() {
  const SecureStore = getSecureStore();

  if (SecureStore?.deleteItemAsync) {
    await SecureStore.deleteItemAsync(TOKEN_KEY, SECURE_STORE_OPTIONS);
    return;
  }

  memoryToken = '';
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}
