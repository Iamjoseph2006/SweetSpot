export type JwtPayload = {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
};

export function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const encoded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const normalized = encoded.padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), '=');
    const decodeFn = typeof atob === 'function'
      ? atob
      : (value: string) => Buffer.from(value, 'base64').toString('utf-8');

    return JSON.parse(decodeFn(normalized));
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}
