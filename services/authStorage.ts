import { Platform } from 'react-native';

const TOKEN_KEY = 'sweetspot_access_token';
let memoryToken = '';

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
    await SecureStore.setItemAsync(TOKEN_KEY, encoded, { keychainService: TOKEN_KEY });
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
    const value = await SecureStore.getItemAsync(TOKEN_KEY);
    return decode(value ?? '');
  }

  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    const value = localStorage.getItem(TOKEN_KEY) ?? '';
    return decode(value);
  }

  return decode(memoryToken);
}

export async function removeToken() {
  const SecureStore = getSecureStore();

  if (SecureStore?.deleteItemAsync) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    return;
  }

  memoryToken = '';
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}