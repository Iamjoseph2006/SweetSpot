import { Platform } from 'react-native';
import { isJwtExpired } from '../domain/auth';

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

async function clearStoredToken() {
  const SecureStore = getSecureStore();
  if (SecureStore?.deleteItemAsync) {
    await SecureStore.deleteItemAsync(TOKEN_KEY, SECURE_STORE_OPTIONS);
  }

  memoryToken = '';
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

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
  let token = '';

  if (SecureStore?.getItemAsync) {
    const value = await SecureStore.getItemAsync(TOKEN_KEY, SECURE_STORE_OPTIONS);
    token = decode(value ?? '');
  } else if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    token = decode(localStorage.getItem(TOKEN_KEY) ?? '');
  } else {
    token = decode(memoryToken);
  }

  if (token && isJwtExpired(token)) {
    await clearStoredToken();
    return '';
  }

  return token;
}

export async function removeToken() {
  await clearStoredToken();
}
